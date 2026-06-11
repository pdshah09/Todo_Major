// proxy.ts (root)
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function proxy(req: NextRequest) {
  const session = getSessionCookie(req); // no config — uses default cookie name
  if (!session) return NextResponse.redirect(new URL("/signin", req.url));
  return NextResponse.next();
}

export const config = { 
  matcher: ["/dashboard/:path*", "/tasks/:path*", "/team/:path*"] 
};

// proxy.ts — when you need user.isAdmin without DB hit
// import { NextRequest, NextResponse } from "next/server";
// import { getCookieCache } from "better-auth/cookies";

// export async function proxy(req: NextRequest) {
//   const session = await getCookieCache(req); // reads signed session_data cookie
//   const { pathname } = req.nextUrl;

//   if (!session) return NextResponse.redirect(new URL("/signin", req.url));
//   if (pathname.startsWith("/team") && !session.user.isAdmin)
//     return NextResponse.redirect(new URL("/dashboard", req.url));

//   return NextResponse.next();
// }
// export const config = { matcher: ["/dashboard/:path*", "/tasks/:path*", "/team/:path*"] };