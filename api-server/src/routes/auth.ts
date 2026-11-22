import {
  LoginAccountBody,
  LoginAccountResponse,
  RegisterAccountBody,
  RegisterAccountResponse,
} from "@workspace/api-zod";
import {
  db,
  schoolSessionsTable,
  schoolUsersTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { Router, type IRouter } from "express";
import {
  clearSessionCookie,
  createSessionToken,
  hashPassword,
  hashSessionToken,
  isAdminSignupCodeConfigured,
  limitAuthAttempts,
  matchesAdminSignupCode,
  requireSameOrigin,
  SESSION_DURATION_MS,
  setSessionCookie,
  verifyPassword,
} from "../lib/authSecurity";

const router: IRouter = Router();


function publicUser(user: typeof schoolUsersTable.$inferSelect) {
  if (!user.username || !user.name) {
    throw new Error("A conta não tem o nome de usuário ou nome obrigatório.");
  }
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}

function hasPostgresErrorCode(
  error: unknown,
  code: string,
  depth = 0,
): boolean {
  if (depth > 5 || typeof error !== "object" || error === null) {
    return false;
  }

  const wrappedError = error as { code?: unknown; cause?: unknown };
  return (
    wrappedError.code === code ||
    hasPostgresErrorCode(wrappedError.cause, code, depth + 1)
  );
}

function isUniqueConstraintError(error: unknown): boolean {
  return hasPostgresErrorCode(error, "23505");
}

async function createSession(
  userId: string,
): Promise<{ token: string; expiresAt: Date }> {
  const token = createSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
  await db.insert(schoolSessionsTable).values({
    tokenHash: hashSessionToken(token),
    userId,
    expiresAt,
  });
  return { token, expiresAt };
}

router.post(
  "/auth/register",
  requireSameOrigin,
  limitAuthAttempts,
  async (req, res): Promise<void> => {
    const parsed = RegisterAccountBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Confira os campos do cadastro." });
      return;
    }

    const username = parsed.data.username.trim().toLocaleLowerCase("en-US");
    const name = parsed.data.name.trim();
    const email = parsed.data.email.trim().toLocaleLowerCase("en-US");
    if (name.length < 2) {
      res.status(400).json({ error: "Informe seu nome completo." });
      return;
    }

    let role: "student" | "admin" = "student";
    if (parsed.data.adminSignupCode) {
      if (!isAdminSignupCodeConfigured()) {
        res.status(503).json({
          error: "O cadastro de administradores ainda não está configurado.",
        });
        return;
      }
      if (!matchesAdminSignupCode(parsed.data.adminSignupCode)) {
        res.status(400).json({
          error: "O código de administrador está incorreto.",
        });
        return;
      }
      role = "admin";
    }

    const id = randomUUID();
    const passwordHash = await hashPassword(parsed.data.password);
    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);
    try {
      const user = await db.transaction(async (tx) => {
        const [createdUser] = await tx
          .insert(schoolUsersTable)
          .values({
            id,
            username,
            email,
            name,
            passwordHash,
            role,
          })
          .returning();

        if (!createdUser) {
          throw new Error("O cadastro não retornou uma conta criada.");
        }

        await tx.insert(schoolSessionsTable).values({
          tokenHash: hashSessionToken(token),
          userId: createdUser.id,
          expiresAt,
        });

        return createdUser;
      });

      setSessionCookie(req, res, token);
      res
        .status(201)
        .json(RegisterAccountResponse.parse(publicUser(user)));
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        res.status(409).json({
          error: "Esse nome de usuário ou e-mail já está cadastrado.",
        });
        return;
      }

      req.log.error("Account registration failed");
      res.status(500).json({
        error: "Não foi possível criar sua conta agora. Tente novamente.",
      });
    }
  },
);

router.post(
  "/auth/login",
  requireSameOrigin,
  limitAuthAttempts,
  async (req, res): Promise<void> => {
    const parsed = LoginAccountBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: "Informe seu nome de usuário e senha." });
      return;
    }

    const username = parsed.data.username.trim().toLocaleLowerCase("en-US");
    const [user] = await db
      .select()
      .from(schoolUsersTable)
      .where(eq(schoolUsersTable.username, username))
      .limit(1);

    const validPassword = await verifyPassword(
      parsed.data.password,
      user?.passwordHash,
    );
    if (!user || !validPassword) {
      res.status(401).json({ error: "Nome de usuário ou senha inválidos." });
      return;
    }

    const { token } = await createSession(user.id);
    setSessionCookie(req, res, token);
    res.json(LoginAccountResponse.parse(publicUser(user)));
  },
);

router.post("/auth/logout", requireSameOrigin, async (req, res): Promise<void> => {
  const token = req.cookies?.agenda_escolar_session;
  if (typeof token === "string" && token.length > 0) {
    await db
      .delete(schoolSessionsTable)
      .where(eq(schoolSessionsTable.tokenHash, hashSessionToken(token)));
  }
  clearSessionCookie(req, res);
  res.sendStatus(204);
});

export default router;
