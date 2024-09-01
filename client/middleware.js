import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req) {
  const url = new URL(req.url);
  const authToken = url.searchParams.get("auth");

  if (authToken) {
    try {
      const response = await axios.get("https://comprarla.es/api/otp/login", {
        headers: {
          "Content-Type": "application/json",
        },
        params: { auth: authToken },
      });

      const data = response.data;

      if (data.message === "Token is valid. Proceed with login.") {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      } else {
        return NextResponse.redirect(new URL("/error", req.url));
      }
    } catch (error) {
      console.error("Error verifying token:", error.message || error);
      return NextResponse.redirect(new URL("/error2", req.url));
    }
  }

  return NextResponse.next();
}
