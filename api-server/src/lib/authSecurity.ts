import {
  createHash,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
} from "node:crypto";
import type { NextFunction, Request, Response } from "express";

export const SESSION_COOKIE_NAME = "agenda_escolar_session";
export const SESSION_DURATION_MS = 30 * 24 * 60 * 60 * 1000;

const SCRYPT_COST = 32_768;
const SCRYPT_BLOCK_SIZE = 8;
const SCRYPT_PARALLELIZATION = 1;
const SCRYPT_KEY_LENGTH = 64;
const SCRYPT_MAX_MEMORY = 64 * 1024 * 1024;
const ADMIN_CODE_MIN_LENGTH = 16;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_ATTEMPTS = 30;

type RateLimitEntry = { count: number; expiresAt: number };
const authAttempts = new Map<string, RateLimitEntry>();

function deriveKey(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scryptCallback(
      password,
      salt,
      SCRYPT_KEY_LENGTH,
      {
        N: SCRYPT_COST,
        r: SCRYPT_BLOCK_SIZE,
        p: SCRYPT_PARALLELIZATION,
        maxmem: SCRYPT_MAX_MEMORY,
      },
      (error, derivedKey) => {
        if (error) {
          reject(error);
          return;
        }
        resolve(derivedKey as Buffer);
      },
    );
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(32);
  const key = await deriveKey(password, salt);
  return [
    "scrypt",
    SCRYPT_COST,
    SCRYPT_BLOCK_SIZE,
    SCRYPT_PARALLELIZATION,
    salt.toString("base64url"),
    key.toString("base64url"),
  ].join("$");
}

export async function verifyPassword(
  password: string,
  storedHash: string | null | undefined,
): Promise<boolean> {
  if (!storedHash) {
    await deriveKey(password, Buffer.alloc(32, 0x5a));
    return false;
  }

  const [algorithm, cost, blockSize, parallelization, saltValue, keyValue] =
    storedHash.split("$");
  const n = Number(cost);
  const r = Number(blockSize);
  const p = Number(parallelization);
  const salt = Buffer.from(saltValue ?? "", "base64url");
  const expected = Buffer.from(keyValue ?? "", "base64url");

  if (
    algorithm !== "scrypt" ||
    !Number.isInteger(n) ||
    n < 16_384 ||
    n > 65_536 ||
    r !== SCRYPT_BLOCK_SIZE ||
    p !== SCRYPT_PARALLELIZATION ||
    salt.length !== 32 ||
    expected.length !== SCRYPT_KEY_LENGTH
  ) {
    await deriveKey(password, Buffer.alloc(32, 0x5a));
    return false;
  }

  const actual = await deriveKey(password, salt);
  return timingSafeEqual(actual, expected);
}

export function hashSessionToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function readSessionToken(req: Request): string | null {
  const token = req.cookies?.[SESSION_COOKIE_NAME];
  return typeof token === "string" && token.length > 0 ? token : null;
}

export function setSessionCookie(
  req: Request,
  res: Response,
  token: string,
): void {
  const maxAgeSeconds = Math.floor(SESSION_DURATION_MS / 1000);
  const secure = req.secure || process.env.NODE_ENV === "production";
  res.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secure ? "; Secure" : ""}`,
  );
}

export function clearSessionCookie(req: Request, res: Response): void {
  const secure = req.secure || process.env.NODE_ENV === "production";
  res.append(
    "Set-Cookie",
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${secure ? "; Secure" : ""}`,
  );
}

export function isAdminSignupCodeConfigured(): boolean {
  const code = process.env.ADMIN_SIGNUP_CODE ?? "";
  return code.length >= ADMIN_CODE_MIN_LENGTH;
}

export function matchesAdminSignupCode(candidate: string): boolean {
  const configured = process.env.ADMIN_SIGNUP_CODE ?? "";
  if (configured.length < ADMIN_CODE_MIN_LENGTH) return false;

  const expectedBytes = Buffer.from(configured, "utf8");
  const candidateBytes = Buffer.from(candidate, "utf8");
  return (
    candidateBytes.length === expectedBytes.length &&
    timingSafeEqual(candidateBytes, expectedBytes)
  );
}

export function requireSameOrigin(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const origin = req.get("origin");
  const forwardedHost = req.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || req.get("host");

  if (!origin || !host) {
    res.status(403).json({ error: "Origem da solicitação não permitida." });
    return;
  }

  try {
    const originUrl = new URL(origin);
    const requestUrl = new URL(`${req.protocol}://${host}`);
    if (originUrl.origin !== requestUrl.origin) {
      res.status(403).json({ error: "Origem da solicitação não permitida." });
      return;
    }
  } catch {
    res.status(403).json({ error: "Origem da solicitação não permitida." });
    return;
  }

  next();
}

export function requireSameOriginMutations(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (["GET", "HEAD", "OPTIONS"].includes(req.method)) {
    next();
    return;
  }
  requireSameOrigin(req, res, next);
}

export function limitAuthAttempts(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const now = Date.now();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  if (authAttempts.size > 5_000) {
    for (const [key, entry] of authAttempts) {
      if (entry.expiresAt <= now) authAttempts.delete(key);
    }
  }

  let entry = authAttempts.get(ip);
  if (!entry || entry.expiresAt <= now) {
    entry = { count: 0, expiresAt: now + RATE_LIMIT_WINDOW_MS };
    authAttempts.set(ip, entry);
  }

  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    res.setHeader(
      "Retry-After",
      Math.max(1, Math.ceil((entry.expiresAt - now) / 1000)),
    );
    res.status(429).json({
      error: "Muitas tentativas. Aguarde alguns minutos e tente novamente.",
    });
    return;
  }

  entry.count += 1;
  next();
}
