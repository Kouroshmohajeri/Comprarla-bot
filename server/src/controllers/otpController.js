import { saveOtp, getOtp, deleteOtp } from "../repositories/OtpRepository.js";

export const generateAndSendOtp = async (req, res) => {
  const { userId, otp } = req.body;

  // Save OTP to the database
  await saveOtp(userId, otp);

  // Send OTP to the user (if necessary, adjust to your method of sending OTP)
  // Example: using a messaging service

  res.status(200).send("OTP generated and sent.");
};

export const verifyOtp = async (req, res) => {
  const { userId, otpEntered } = req.body;

  // Fetch the latest OTP for the user
  const otpRecord = await getOtp(userId);

  if (!otpRecord || otpRecord.otp !== otpEntered) {
    return res.status(400).send("Invalid OTP. Please try again.");
  }

  // OTP is valid; remove OTP record
  await deleteOtp(userId);

  res.send("OTP verified successfully.");
};
