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
export async function handleStart(ctx) {
  const telegramUserId = ctx.from.id;

  // Check if the user exists in the external system
  const userData = await checkUserExists(telegramUserId);

  if (userData) {
    const otp = generateOTP();

    // Store the OTP in the database
    try {
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
