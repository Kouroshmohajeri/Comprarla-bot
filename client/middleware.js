import { NextResponse } from "next/server";
import axios from "axios";

export async function middleware(req) {
  const url = new URL(req.url);
  const authToken = url.searchParams.get("auth");
  const token = req.cookies.get("token");

  // Skip favicon requests
  if (url.pathname === "/favicon.ico") {
    return NextResponse.next();
  }

  // Handle /login route
  if (url.pathname === "/login") {
    if (authToken) {
      try {
        const response = await axios.get("https://comprarla.es/api/otp/login", {
          headers: {
            "Content-Type": "application/json",
          },
          params: { auth: authToken },
        });

        const data = response.data;
        console.log(data); // Shows { message: 'Token is valid. Proceed with login.', userId: 41949121 }

        if (data.message === "Token is valid. Proceed with login.") {
          // Set both token and userId in cookies
          const res = NextResponse.redirect(new URL("/dashboard", req.url));
          res.cookies.set("token", req.cookies.get("token"), {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60, // 2 hours
            sameSite: "strict",
          });
          res.cookies.set("userId", data.userId, {
            httpOnly: false, // This allows frontend JS to read it
            secure: process.env.NODE_ENV === "production",
            maxAge: 2 * 60 * 60, // 2 hours
          });
          return res;
        } else {
          return NextResponse.redirect(new URL("/error", req.url));
        }
      } catch (error) {
        console.error(
          "Error verifying token:",
          error.response?.data || error.message || error
        );
        return NextResponse.redirect(new URL("/error2", req.url));
      }
    }
  }

  // Handle /dashboard route
  if (url.pathname === "/dashboard") {
    if (token) {
      try {
        return NextResponse.next(); // Allow access to /dashboard if token is valid
      } catch (err) {
        console.error("JWT verification failed:", err.message);
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      return NextResponse.redirect(new URL("/login", req.url)); // Redirect to /login if no token
    }
  }

  // For all other routes, continue without any authentication checks
  return NextResponse.next();
}
