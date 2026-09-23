import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, LOGIN_PATH, authConfig, safeNext, verifySession } from "@/lib/auth";

/**
 * Runs on the server before every page (Next.js 16 "proxy", formerly middleware).
 * No valid session cookie -> redirect to /login?next=<the page you wanted>.
 * Already signed in and opening /login -> straight back to the app.
 */
export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const authed = await verifySession(authConfig(), request.cookies.get(AUTH_COOKIE)?.value);

  if (pathname === LOGIN_PATH) {
    if (!authed) return NextResponse.next();
    return NextResponse.redirect(new URL(safeNext(request.nextUrl.searchParams.get("next")), request.url));
  }

  if (authed) return NextResponse.next();

  const login = new URL(LOGIN_PATH, request.url);
  const wanted = pathname + search;
  if (wanted !== "/") login.searchParams.set("next", wanted);
  const res = NextResponse.redirect(login);
  // Drop an expired or tampered cookie so the browser stops sending it.
  if (request.cookies.has(AUTH_COOKIE)) res.cookies.delete(AUTH_COOKIE);
  return res;
}

export const config = {
  // Everything except the login API, Next.js build assets and the files the login page needs.
  matcher: ["/((?!api/auth/|_next/static/|_next/image|fonts/|icon\\.svg$|favicon\\.ico$).*)"],
};
