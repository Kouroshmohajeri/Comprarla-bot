import { NextResponse } from "next/server";

// Function to verify the token using fetch
async function verifyTokenWithFetch(authToken) {
  try {
    const response = await fetch(
      `https://comprarla.es/api/otp/login?auth=${authToken}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error verifying token with fetch:", error);
    throw error;
  }
}

export async function middleware(req) {
  const url = new URL(req.url);

  // Extract the auth token from the URL query parameters
  const authToken = url.searchParams.get("auth");

  if (authToken) {
    try {
      // Verify the token by making a request to the backend
      const data = await verifyTokenWithFetch(authToken);

      if (data.message === "Token is valid. Proceed with login.") {
        // Redirect to the dashboard if the token is valid
        return NextResponse.redirect("/");
      } else {
        // Redirect to an error page if the token is invalid
        return NextResponse.redirect("/error");
      }
    } catch (error) {
      console.error("Error verifying token:", error);
      return NextResponse.redirect("/error"); // handle fetch errors
    }
  }

  // Continue as normal if there's no auth token
  return NextResponse.next();
}
