import jwt from "jsonwebtoken";
import { validateSession } from "../controllers/sessionController.js";

export async function sessionMiddleware(req, res, next) {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token provided. Unauthorized." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { userId, sessionToken } = decoded;

    // Validate session
    await validateSession(userId, sessionToken);

    // Attach user information to the request
    req.user = { userId };

    next();
  } catch (error) {
    console.error("Session validation error:", error);
    res
      .status(401)
      .json({ message: "Session invalid or expired. Please log in again." });
  }
}
