import { Router } from "express";
import { handleStart } from "../controllers/otpController.js";

const router = Router();

// Define the /start route
router.get("/start", handleStart);

export default router;
