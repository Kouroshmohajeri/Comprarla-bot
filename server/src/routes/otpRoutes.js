import { Router } from "express";
import {
  handleStart,
  handleVerification,
} from "../controllers/otpController.js";

const router = Router();

// Define the /start route
router.get("/start", handleStart);
router.post("/verify", handleVerification);

export default router;
