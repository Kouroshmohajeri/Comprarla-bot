import { logoutSession } from "../controllers/sessionController.js";

export async function logout(req, res) {
  try {
    const userId = req.user.userId;

    // Delete the session
    await logoutSession(userId);

    // Clear the JWT cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", "", {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        expires: new Date(0), // Expire immediately
      })
    );

    res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    console.error("Error during logout:", error);
    res.status(500).json({ message: "Server error. Could not log out." });
  }
}
