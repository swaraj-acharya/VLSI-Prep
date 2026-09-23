import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, LOGIN_PATH, authConfig, checkCredentials, cookieOptions, createSession, safeNext } from "@/lib/auth";

export const dynamic = "force-dynamic";

function backToLogin(request: NextRequest, error: string, next: string) {
  const url = new URL(LOGIN_PATH, request.url);
  url.searchParams.set("error", error);
  if (next !== "/") url.searchParams.set("next", next);
  return NextResponse.redirect(url, 303);
}

export async function POST(request: NextRequest) {
  let form: FormData;
  try { form = await request.formData(); } catch { return backToLogin(request, "invalid", "/"); }
  const id = String(form.get("id") ?? "").trim();
  const password = String(form.get("password") ?? "");
  const next = safeNext(String(form.get("next") ?? "/"));

  const cfg = authConfig();
  if (!cfg) return backToLogin(request, "config", next);

  if (!(await checkCredentials(cfg, id, password))) {
    // Small fixed delay to slow down password guessing.
    await new Promise((r) => setTimeout(r, 800));
    return backToLogin(request, "invalid", next);
  }

  const res = NextResponse.redirect(new URL(next, request.url), 303);
  res.cookies.set(AUTH_COOKIE, await createSession(cfg), cookieOptions(request.nextUrl.protocol === "https:"));
  return res;
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
}
