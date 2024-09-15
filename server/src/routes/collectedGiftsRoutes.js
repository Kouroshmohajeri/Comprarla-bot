// routes/collectedGiftsRoutes.js
import express from "express";
import {
  addCollectedGift,
  getCollectedGiftsByUser,
  deleteCollectedGift,
} from "../controllers/collectedGiftsControllers.js";

const router = express.Router();

// Route to add a collected gift
router.post("/", addCollectedGift);

// Route to get collected gifts by userId
router.get("/:userId", getCollectedGiftsByUser);

// Route to delete a collected gift by ID
router.delete("/:id", deleteCollectedGift);

export default router;
