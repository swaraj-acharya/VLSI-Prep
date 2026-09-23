/**
 * Password gate for the whole site.
 *
 * Credentials come from environment variables set on the host (Vercel project settings):
 *   AUTH_ID        the login id
 *   AUTH_PASSWORD  the password
 *   AUTH_SECRET    optional extra signing secret (any long random string)
 *
 * After a correct login the browser gets an httpOnly cookie that is valid for 7 days.
 * The cookie never contains the password: it holds an expiry time and an HMAC signature
 * of that time, keyed by the credentials. Changing AUTH_ID, AUTH_PASSWORD or AUTH_SECRET
 * therefore logs every browser out at once.
 *
 * Runs in the proxy (Node runtime), route handlers and server components, so it only
 * uses Web Crypto, which all three have.
 */

export const AUTH_COOKIE = "signoff_auth";
export const SESSION_DAYS = 7;
export const SESSION_SECONDS = SESSION_DAYS * 24 * 60 * 60;
export const LOGIN_PATH = "/login";

export interface AuthConfig { id: string; password: string; secret: string }

/** Returns null when the credentials are not configured, so callers can fail closed. */
export function authConfig(): AuthConfig | null {
  const id = process.env.AUTH_ID ?? "";
  const password = process.env.AUTH_PASSWORD ?? "";
  if (!id || !password) return null;
  return { id, password, secret: process.env.AUTH_SECRET ?? "" };
}

const enc = new TextEncoder();

async function hmacHex(cfg: AuthConfig, message: string): Promise<string> {
  const keyMaterial = enc.encode(`signoff-v1\0${cfg.secret}\0${cfg.id}\0${cfg.password}`);
  const key = await crypto.subtle.importKey("raw", keyMaterial, { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const sig = new Uint8Array(await crypto.subtle.sign("HMAC", key, enc.encode(message)));
  return Array.from(sig, (b) => b.toString(16).padStart(2, "0")).join("");
}

async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", enc.encode(text)));
}

/** Constant-time comparison of two strings (hashed first so lengths never leak). */
export async function safeEqual(a: string, b: string): Promise<boolean> {
  const [x, y] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export async function checkCredentials(cfg: AuthConfig, id: string, password: string): Promise<boolean> {
  // Evaluate both so timing does not reveal which one was wrong.
  const [idOk, pwOk] = await Promise.all([safeEqual(id, cfg.id), safeEqual(password, cfg.password)]);
  return idOk && pwOk;
}

/** Creates the cookie value: "<expiry unix seconds>.<signature>". */
export async function createSession(cfg: AuthConfig, now = Date.now()): Promise<string> {
  const exp = Math.floor(now / 1000) + SESSION_SECONDS;
  return `${exp}.${await hmacHex(cfg, `session.${exp}`)}`;
}

export async function verifySession(cfg: AuthConfig | null, value: string | undefined, now = Date.now()): Promise<boolean> {
  if (!cfg || !value) return false;
  const dot = value.indexOf(".");
  if (dot <= 0) return false;
  const expText = value.slice(0, dot);
  if (!/^\d{1,12}$/.test(expText)) return false;
  const exp = Number(expText);
  if (exp * 1000 <= now) return false;
  // A token claiming to last longer than one session was not issued by us.
  if (exp - Math.floor(now / 1000) > SESSION_SECONDS + 60) return false;
  return safeEqual(value.slice(dot + 1), await hmacHex(cfg, `session.${exp}`));
}

/** Only allow same-site paths as a post-login destination (blocks open redirects). */
export function safeNext(raw: string | null | undefined): string {
  if (!raw || typeof raw !== "string") return "/";
  if (!raw.startsWith("/") || raw.startsWith("//") || raw.startsWith("/\\")) return "/";
  if (raw === LOGIN_PATH || raw.startsWith(LOGIN_PATH + "?") || raw.startsWith("/api/auth")) return "/";
  return raw;
}

export function cookieOptions(secure: boolean) {
  return { httpOnly: true, secure, sameSite: "lax" as const, path: "/", maxAge: SESSION_SECONDS };
}
