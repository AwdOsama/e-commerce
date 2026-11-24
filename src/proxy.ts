import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const userToken = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Allow signed-in users to continue to the cart; send guests to login.
  if (userToken) {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname + request.nextUrl.search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/cart", "/checkout", "/orders", "/wishlist", "/profile/settings", "/profile/addresses"],
};
