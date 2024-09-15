import express from "express";
import {
  createGift,
  getAllGifts,
  getGiftById,
  updateGiftById,
  deleteGiftById,
} from "../controllers/giftController.js";

const router = express.Router();

router.post("/add", createGift);
router.get("/", getAllGifts);
router.get("/:id", getGiftById);
router.put("/:id", updateGiftById);
router.delete("/:id", deleteGiftById);

export default router;
