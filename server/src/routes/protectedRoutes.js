// src/routes/protectedRoutes.js
import express from "express";
import { verifyToken } from "../middleware/verifyToken.js"; // Import the verifyToken middleware

const router = express.Router();

// Apply the middleware to protect this route
router.get("/protected-route", verifyToken, (req, res) => {
  res
    .status(200)
    .json({ message: "You have access to this route!", user: req.user });
});

export default router;
