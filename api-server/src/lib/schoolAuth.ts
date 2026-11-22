import { db, schoolSessionsTable, schoolUsersTable, type SchoolUser } from "@workspace/db";
import { and, eq, gt } from "drizzle-orm";
import type { Request, Response } from "express";
import { hashSessionToken, readSessionToken } from "./authSecurity";

export async function requireSchoolUser(
  req: Request,
  res: Response,
): Promise<SchoolUser | null> {
  const token = readSessionToken(req);
  if (!token) {
    res.status(401).json({ error: "Faça login para continuar." });
    return null;
  }

  const [session] = await db
    .select({ user: schoolUsersTable })
    .from(schoolSessionsTable)
    .innerJoin(
      schoolUsersTable,
      eq(schoolSessionsTable.userId, schoolUsersTable.id),
    )
    .where(
      and(
        eq(schoolSessionsTable.tokenHash, hashSessionToken(token)),
        gt(schoolSessionsTable.expiresAt, new Date()),
      ),
    )
    .limit(1);

  if (!session) {
    res.status(401).json({ error: "Sua sessão expirou. Entre novamente." });
    return null;
  }

  const user = session.user;
  if (!user.username || !user.name || !user.passwordHash) {
    res.status(403).json({
      error: "Esta conta precisa ser cadastrada novamente para acessar a agenda.",
    });
    return null;
  }

  return user;
}

export async function requireSchoolAdmin(
  req: Request,
  res: Response,
): Promise<SchoolUser | null> {
  const user = await requireSchoolUser(req, res);
  if (!user) return null;
  if (user.role !== "admin") {
    res.status(403).json({ error: "Apenas administradores podem publicar conteúdos." });
    return null;
  }
  return user;
}
