// controllers/otpController.js
import Otp from "../models/Otp.js";
import crypto from "crypto";

// Generate OTP and send it to the user via Telegram bot
export const generateOtp = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    // Generate a random 6-digit OTP
    const otpCode = crypto.randomInt(100000, 999999).toString();

    // Save the OTP to the database
    const otp = new Otp({ userId, otp: otpCode });
    await otp.save();

    // Send the OTP to the user via Telegram bot
    // Make sure you have the Telegram bot configured to send this message
    // We'll assume the bot can access an endpoint to trigger this
    await axios.post(`${process.env.TELEGRAM_BOT_URL}/send-otp`, {
      userId,
      otp: otpCode,
    });

    return res
      .status(200)
      .json({ otpCode, message: "OTP generated successfully." });
  } catch (error) {
    console.error("Error generating OTP:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};

// Validate OTP entered by the user
export const validateOtp = async (req, res) => {
  const { userId, otp } = req.body;

  try {
    const otpEntry = await Otp.findOne({ userId, otp });

    if (!otpEntry) {
      return res.status(400).json({ message: "Invalid OTP." });
    }

    // If OTP is valid, consider user logged in (implement further logic as needed)
    return res.status(200).json({ message: "Logged in successfully." });
  } catch (error) {
    console.error("Error validating OTP:", error);
    return res.status(500).json({ message: "Internal server error." });
  }
};
