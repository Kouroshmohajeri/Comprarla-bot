import { saveOtp, getOtp, deleteOtp } from "../repositories/OtpRepository.js";

export const generateAndSendOtp = async (ctx) => {
  const userId = ctx.from.id;

  // Generate OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Save OTP to the database
  await saveOtp(userId, otp);

  // Send OTP to the user
  await ctx.reply(`Your OTP is: ${otp}`);
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
