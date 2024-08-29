import crypto from "crypto";
import axios from "axios";
import Otp from "../models/Otp.js";

// Function to generate a random OTP
export function generateOTP() {
  return crypto.randomBytes(3).toString("hex").toUpperCase();
}

// Function to check if the user exists in the external system using Axios
export async function checkUserExists(userId) {
  const url = `https://comprarla.es/api/users/${userId}`;
  try {
    const response = await axios.get(url);
    if (response.status === 200 && response.data) {
      return response.data; // Return the entire user object
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error checking user:", error);
    return null;
  }
}

// Controller for handling the /start command
// Controller for handling the /start command
export async function handleStart(ctx) {
  const telegramUserId = ctx.from.id;

  // Check if the user exists in the external system
  const userData = await checkUserExists(telegramUserId);

  if (userData) {
    // Generate a new OTP
    const otp = generateOTP();

    try {
      // Check if there's an existing OTP record for this user and delete it
      await Otp.deleteOne({ userId: telegramUserId });

      // Save the new OTP
      const otpRecord = new Otp({
        userId: telegramUserId,
        otp: otp,
      });

      await otpRecord.save();
      console.log("OTP saved successfully:", otpRecord);

      ctx.reply(
        `Welcome ${userData.firstName}!\nYour OTP is: ${otp}\n_______________\nComprarLa`
      );
    } catch (error) {
      console.error("Error saving OTP:", error.message);
      ctx.reply(
        "An error occurred while generating your OTP. Please try again."
      );
    }
  } else {
    ctx.reply(
      `You need to start the @comprarlabot first to get the code. Please go to https://t.me/comprarlabot and follow the instructions.`
    );
  }
}

// Verification of OTP

export async function handleVerification(req, res) {
  const { userId, otp } = req.body;

  if (!userId || !otp) {
    return res.status(400).json({ message: "User ID and OTP are required." });
  }

  try {
    // Find the OTP record in the database
    const otpRecord = await Otp.findOne({ userId, otp });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP or OTP expired." });
    }

    // Optionally, delete the OTP after successful verification
    await Otp.deleteOne({ _id: otpRecord._id });

    return res.status(200).json({ message: "OTP verified successfully!" });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "Server error. Please try again later." });
  }
}
