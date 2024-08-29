import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req) {
  const { pathname, searchParams } = new URL(req.url);

  // Check if the path is /login and has an auth query parameter
  if (pathname === "/login" && searchParams.has("auth")) {
    const authToken = searchParams.get("auth");

    // Verify the token with your backend using axios
    try {
      const response = await axios.get(
        `https://comprarla.es/api/otp/verifyToken`,
        {
          params: { auth: authToken },
        }
      );

      if (
        response.status === 200 &&
        response.data.message === "Token is valid. Proceed with login."
      ) {
        // Redirect to the dashboard if the token is valid
        return NextResponse.redirect("/dashboard");
      } else {
        // Redirect to an error page or handle the invalid token
        return NextResponse.redirect("/error"); // or any other error handling
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.redirect("/error"); // handle axios errors
    }
  }

  // Continue as normal if the path is not /login or if there's no auth token
  return NextResponse.next();
}
