import Gift from "../models/Gift";

export const createGift = async (giftData) => {
  const newGift = new Gift(giftData);
  return await newGift.save();
};

export const getAllGifts = async () => {
  return await Gift.find();
};

export const getGiftById = async (id) => {
  return await Gift.findById(id);
};

export const updateGiftById = async (id, giftData) => {
  return await Gift.findByIdAndUpdate(id, giftData, { new: true });
};

export const deleteGiftById = async (id) => {
  return await Gift.findByIdAndDelete(id);
};
