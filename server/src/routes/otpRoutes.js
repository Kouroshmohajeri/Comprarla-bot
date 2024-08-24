import express from "express";
import { generateAndSendOtp, verifyOtp } from "../controllers/otpController.js";

const router = express.Router();

// Route to generate and send OTP
router.post("/generate", generateAndSendOtp);

// Route to verify OTP
router.post("/verify", verifyOtp);

export default router;
