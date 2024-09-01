import { Router } from "express";
import {
  handleStart,
  handleTokenVerification,
  handleTokenRefresh,
} from "../controllers/otpController.js";

const router = Router();

// Define the /start route
router.get("/start", handleStart);

// Define the /login route for token verification
router.get("/login", handleTokenVerification);

// Define the /login route for token verification
router.get("/login", handleTokenRefresh);

export default router;
