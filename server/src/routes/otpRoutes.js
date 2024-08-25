// routes/otpRoutes.js
import express from "express";
import { generateOtp, validateOtp } from "../controllers/otpController.js";

const router = express.Router();

// Route to generate OTP
router.post("/generate-otp", generateOtp);

// Route to validate OTP
router.post("/validate-otp", validateOtp);

export default router;
