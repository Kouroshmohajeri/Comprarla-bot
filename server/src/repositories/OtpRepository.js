import Otp from "../models/Otp.js";

export const saveOtp = async (userId, otp) => {
  return await Otp.create({ userId, otp });
};

export const getOtp = async (userId) => {
  return await Otp.findOne({ userId }).sort({ createdAt: -1 });
};

export const deleteOtp = async (userId) => {
  return await Otp.deleteOne({ userId });
};
