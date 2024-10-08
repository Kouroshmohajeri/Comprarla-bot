import crypto from "crypto";
import Otp from "../models/Otp.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { createSession } from "./sessionController.js";

// Function to generate an encrypted token
function generateEncryptedToken(userId) {
  const token = crypto.randomBytes(32).toString("hex");
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
    Buffer.from(process.env.ENCRYPTION_IV, "hex")
  );
  let encryptedToken = cipher.update(token, "utf8", "hex");
  encryptedToken += cipher.final("hex");
  return encryptedToken;
}

// Function to decrypt a token
function decryptToken(encryptedToken) {
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(process.env.ENCRYPTION_KEY, "hex"),
    Buffer.from(process.env.ENCRYPTION_IV, "hex")
  );
  let decryptedToken = decipher.update(encryptedToken, "hex", "utf8");
  decryptedToken += decipher.final("utf8");
  return decryptedToken;
}

// Function to check if the user exists in the external system using Axios
async function checkUserExists(userId) {
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
    // Generate a new encrypted token
    const encryptedToken = generateEncryptedToken(telegramUserId);

    try {
      // Remove any existing OTP records for this user
      await Otp.deleteOne({ userId: telegramUserId });

      // Save the new token
      const otpRecord = new Otp({
        userId: telegramUserId,
        otp: encryptedToken,
      });

      await otpRecord.save();
      console.log("Token saved successfully:", otpRecord);

      const loginUrl = `https://comprarla.es/login?auth=${encryptedToken}`;
      const message = await ctx.reply(
        `Welcome ${userData.firstName}!\nYour login link is: ${loginUrl}\nThis link will expire in 2 minutes.\n_______________\nComprarLa`
      );

      // Schedule link expiration after 2 minutes
      scheduleLinkExpiration(ctx, message.message_id, 2 * 60 * 1000);
    } catch (error) {
      console.error("Error saving token:", error.message);
      ctx.reply(
        "An error occurred while generating your login link. Please try again."
      );
    }
  } else {
    ctx.reply(
      `You need to start the @comprarlabot first to get the code. Please go to https://t.me/comprarlabot and follow the instructions.`
    );
  }
}

// Function to schedule link expiration
export function scheduleLinkExpiration(ctx, messageId, delay) {
  setTimeout(() => {
    ctx.telegram.editMessageText(
      ctx.chat.id,
      messageId,
      undefined,
      `Link expired.\nPlease go to https://comprarla.es/login and login to get the code!`
    );
  }, delay);
}

export async function handleTokenVerification(req, res) {
  const { auth } = req.query;

  if (!auth) {
    return res.status(400).json({ message: "Token is required." });
  }

  try {
    // Decrypt the token
    const decryptedToken = decryptToken(auth);

    // Check if the OTP record exists and is valid
    const otpRecord = await Otp.findOne({ otp: auth });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Extract userId from OTP record
    const userId = otpRecord.userId;

    // Create a session for the user and invalidate previous sessions
    const sessionToken = await createSession(userId);

    // Create a JWT token with the userId and sessionToken
    const jwtToken = jwt.sign(
      { userId, sessionToken },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      }
    );

    // Set the JWT token in an HTTP-only cookie
    res.setHeader(
      "Set-Cookie",
      cookie.serialize("token", jwtToken, {
        httpOnly: true,
        sameSite: "strict",
        path: "/",
        maxAge: 2 * 60 * 60 * 1000,
      })
    );

    res
      .status(200)
      .json({ message: "Token is valid. Proceed with login.", userId });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}
