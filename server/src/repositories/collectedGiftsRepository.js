import CollectedGifts from "../models/CollectedGifts.js";

// Create a new collected gift
export const createCollectedGift = async (userId, giftId, quantity) => {
  const collectedGift = new CollectedGifts({ userId, giftId, quantity });
  return await collectedGift.save();
};

// Get collected gifts by userId
export const findCollectedGiftsByUserId = async (userId) => {
  return await CollectedGifts.find({ userId }).populate("giftId");
};

// Delete a collected gift by ID
export const deleteCollectedGiftById = async (id) => {
  return await CollectedGifts.findByIdAndDelete(id);
};
