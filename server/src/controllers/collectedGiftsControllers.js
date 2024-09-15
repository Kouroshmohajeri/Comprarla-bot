// controllers/collectedGiftsController.js
import {
  createCollectedGift,
  findCollectedGiftsByUserId,
  deleteCollectedGiftById,
} from "../repositories/collectedGiftsRepository.js";
import CollectedGifts from "../models/CollectedGifts.js";

// Add a collected gift
export const addCollectedGift = async (req, res) => {
  try {
    const { userId, giftId, quantity } = req.body;
    const collectedGift = await createCollectedGift(userId, giftId, quantity);
    res.status(201).json(collectedGift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get collected gifts by userId
export const getCollectedGiftsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const collectedGifts = await findCollectedGiftsByUserId(userId);
    res.status(200).json(collectedGifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a collected gift by ID
export const deleteCollectedGift = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCollectedGiftById(id);
    if (!result)
      return res.status(404).json({ message: "Collected gift not found." });
    res.status(200).json({ message: "Collected gift deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all collected gifts by Id
export const getAllCollectedGifts = async (req, res) => {
  try {
    const collectedGifts = await CollectedGifts.find().populate("giftId");
    res.status(200).json(collectedGifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
