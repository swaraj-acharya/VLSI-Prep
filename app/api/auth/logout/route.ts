import { NextResponse, type NextRequest } from "next/server";
import { AUTH_COOKIE, LOGIN_PATH } from "@/lib/auth";

export const dynamic = "force-dynamic";

export function POST(request: NextRequest) {
  const url = new URL(LOGIN_PATH, request.url);
  url.searchParams.set("signedout", "1");
  const res = NextResponse.redirect(url, 303);
  res.cookies.delete(AUTH_COOKIE);
  return res;
}
