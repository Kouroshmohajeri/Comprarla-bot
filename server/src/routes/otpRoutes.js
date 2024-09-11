import { Router } from "express";
import {
  handleStart,
  handleTokenVerification,
} from "../controllers/otpController.js";
import { logout } from "../controllers/logoutController.js";
import { sessionMiddleware } from "../middleware/sessionMiddleware.js";

const router = Router();

// Define the /start route
router.get("/start", handleStart);

// Define the /login route for token verification
router.get("/login", handleTokenVerification);

router.get("/protected", sessionMiddleware, (req, res) => {
  res.status(200).json({ message: "You have access to this route." });
});

// Logout route
router.post("/logout", sessionMiddleware, logout);

export default router;
