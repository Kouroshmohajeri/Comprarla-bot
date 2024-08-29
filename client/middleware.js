// middleware.js (or middleware.ts for TypeScript)
import { NextResponse } from "next/server";

export function middleware(request) {
  const url = request.nextUrl.clone();
  const hostname = request.headers.get("host");

  if (hostname === "login.comprarla.es") {
    url.pathname = "/login"; // Redirect to the login page
    return NextResponse.redirect(url);
  }

  // Add other subdomain-specific routing logic here if needed

  return NextResponse.next();
}
