import crypto from "crypto";
import Session from "../models/Session.js";

// Create a session for the user
export async function createSession(userId) {
  // Generate a unique session token
  const sessionToken = crypto.randomBytes(32).toString("hex");

  // Set session expiration time (e.g., 2 hours)
  const expiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000); // 2 hours

  // Invalidate any previous session by deleting it
  await Session.deleteMany({ userId });

  // Create a new session and save it to the database
  const session = new Session({
    userId,
    sessionToken,
    expiresAt,
  });

  await session.save();

  return sessionToken; // Return the new session token
}

// Function to validate the session during requests
export async function validateSession(userId, sessionToken) {
  const session = await Session.findOne({ userId, sessionToken });

  if (!session) {
    throw new Error("Invalid session or user logged in from another device.");
  }

  // Check if the session is expired
  if (session.expiresAt < Date.now()) {
    await Session.deleteOne({ userId, sessionToken });
    throw new Error("Session expired.");
  }

  return session;
}

// Function to log out (delete session)
export async function logoutSession(userId) {
  await Session.deleteMany({ userId });
}
