import crypto from "crypto";
import Otp from "../models/Otp.js";
import axios from "axios";
import jwt from "jsonwebtoken";

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
      console.log(encryptedToken);
      await otpRecord.save();
      console.log("Token saved successfully:", otpRecord);

      const loginUrl = `https://comprarla.es/login?auth=${encryptedToken}`;
      ctx.reply(
        `Welcome ${userData.firstName}!\nYour login link is: ${loginUrl}\nThis link will expire in 5 minutes.\n_______________\nComprarLa`
      );
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

export async function handleTokenVerification(req, res) {
  const { auth } = req.query;

  if (!auth) {
    return res.status(400).json({ message: "Token is required." });
  }

  try {
    // Decrypt the token
    const decryptedToken = decryptToken(auth);

    // Check if the token exists and is valid
    const otpRecord = await Otp.findOne({ otp: auth });

    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

    // Generate a new JWT for session management (2 hours expiry)
    const sessionToken = jwt.sign(
      { userId: otpRecord.userId },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } // Token expires in 2 hours
    );

    // Optionally, delete the OTP record after successful use
    await Otp.deleteOne({ otp: auth });

    // Send the JWT to the user
    res.status(200).json({
      message: "Token is valid. Proceed with login.",
      token: sessionToken,
    });
  } catch (error) {
    console.error("Error validating token:", error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}

//Refresh token
export async function handleTokenRefresh(req, res) {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token is required." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Generate a new JWT token
    const newToken = jwt.sign(
      { userId: decoded.userId },
      process.env.JWT_SECRET,
      { expiresIn: "2h" } // Extend the session for 2 more hours
    );

    res.status(200).json({ token: newToken });
  } catch (error) {
    console.error("Error refreshing token:", error.message || error);
    res.status(500).json({ message: "Server error. Please try again later." });
  }
}
