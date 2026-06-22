// src/proxy.ts — single edge guard (Next.js proxy file, replaces middleware.ts)
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// Pages only guests may see — redirect to /dashboard when logged in
const GUEST_ONLY = new Set(["/", "/signin", "/signup"]);

// Pages that require a session — redirect to /signin when logged out
const PROTECTED_PREFIXES = ["/dashboard", "/tasks", "/team", "/analytics"];

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const session = getSessionCookie(req);
  const loggedIn = Boolean(session);

  // 1. Logged-in user hits a guest-only page → send to dashboard
  if (loggedIn && GUEST_ONLY.has(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 2. Guest hits a protected page → send to sign-in with callbackUrl
  if (!loggedIn && PROTECTED_PREFIXES.some(p => pathname.startsWith(p))) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on all app routes; skip API, static assets, Next internals
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
