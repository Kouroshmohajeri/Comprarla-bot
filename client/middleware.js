import { NextResponse } from "next/server";
import { verifyToken } from "@/api/OTP/actions.js"; // Import the verification function

export async function middleware(req) {
  const url = new URL(req.url);
  const authToken = url.searchParams.get("auth");

  if (authToken) {
    try {
      const data = await verifyToken(authToken);

      if (data.message === "Token is valid. Proceed with login.") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/error", req.url));
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.redirect(new URL("/error", req.url));
    }
  }

  // Continue to the requested page if no auth token is found
  return NextResponse.next();
}
