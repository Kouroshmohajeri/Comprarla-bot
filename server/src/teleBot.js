import { Telegraf, session } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import broadcastMessage from "./services/broadcast.js";
import crypto from "crypto"; // For generating OTPs

dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// Initialize session middleware
bot.use(session());

const backendAPIUrl = `${process.env.BACKEND_URL}/api/users`;
const web_link = "https://comprarla.es/";
const AUTHORIZED_USER_IDS =
  process.env.AUTHORIZED_USER_IDS.split(",").map(Number); // List of authorized user IDs

// Store OTPs in memory (you might want to use a persistent store)
const otpStore = {};

// Generate OTP
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
}

// Start command
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const firstName = ctx.from.first_name;
  const lastName = ctx.from.last_name || "";
  const dateJoined = new Date();

  // Extract the invitation code from the command if available
  const messageText = ctx.message.text;
  const invitationCode = messageText.split(" ")[1]; // Extract the payload after /start

  try {
    // Retrieve user's profile photo
    const userPhotos = await bot.telegram.getUserProfilePhotos(userId);
    let profilePhotoUrl = "";

    if (userPhotos.total_count > 0) {
      const fileId = userPhotos.photos[0][0].file_id;
      const fileLink = await bot.telegram.getFileLink(fileId);
      profilePhotoUrl = fileLink;
    }

    // Send user data to your backend to be saved or updated in MongoDB
    await axios.post(`${backendAPIUrl}/add`, {
      userId,
      username,
      firstName,
      lastName,
      dateJoined,
      points: 0,
      invitations: [],
      tasksDone: 0,
      isOG: false,
      profilePhotoUrl,
      invitationCode, // Include the invitation code
    });

    // Prepare the keyboard options
    const keyboardOptions = [
      [
        {
          text: "Open Mini App",
          web_app: { url: `${web_link}?userId=${userId}` },
        },
      ],
    ];

    // Conditionally add the "Broadcast Message" button if the user is authorized
    if (AUTHORIZED_USER_IDS.includes(userId)) {
      keyboardOptions.push([
        {
          text: "Broadcast Message",
          callback_data: "broadcast_message",
        },
      ]);
    }

    // Send the welcome message with the appropriate keyboard
    ctx.reply("Welcome to ComprarLa.", {
      reply_markup: {
        inline_keyboard: keyboardOptions,
      },
    });
  } catch (error) {
    console.error("Failed to save user data:", error);
    ctx.reply(
      "An error occurred while processing your data. Please try again."
    );
  }
});

// Handle OTP request from frontend
bot.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  // If the callback data indicates a connect action, generate and send OTP
  if (callbackData === "connect_telegram") {
    const userId = ctx.from.id;
    const otp = generateOTP();

    // Store OTP with expiration (e.g., 5 minutes)
    otpStore[userId] = { otp, expiresAt: Date.now() + 300000 }; // 5 minutes expiration

    // Send OTP to the user
    await ctx.reply(`Your OTP is: ${otp}`);
  }
});

// Verify OTP
bot.on("text", async (ctx) => {
  const userId = ctx.from.id;
  const userOTP = ctx.message.text;

  if (otpStore[userId]) {
    if (otpStore[userId].otp === userOTP) {
      if (Date.now() > otpStore[userId].expiresAt) {
        await ctx.reply("OTP has expired. Please request a new one.");
      } else {
        await ctx.reply("OTP verified successfully. You are now logged in.");
        delete otpStore[userId]; // Clear the OTP after successful verification
        // Proceed with login logic, e.g., update user status in your backend
      }
    } else {
      await ctx.reply("Invalid OTP. Please try again.");
    }
  } else {
    await ctx.reply("No OTP request found. Please request an OTP first.");
  }
});

// Handle other callback queries (e.g., button presses)
bot.on("callback_query", async (ctx) => {
  const callbackData = ctx.callbackQuery.data;

  if (callbackData === "broadcast_message") {
    if (AUTHORIZED_USER_IDS.includes(ctx.from.id)) {
      await ctx.answerCbQuery();

      // Initialize the session if not done already
      if (!ctx.session) ctx.session = {};

      ctx.session.isBroadcasting = true;
      await ctx.reply(
        `The bot is ready, ${ctx.from.first_name}. Let's broadcast your message!`
      );
    } else {
      await ctx.answerCbQuery();
      await ctx.reply("You are not authorized to broadcast messages.");
    }
  }
});

// Handle incoming text messages for broadcasting
bot.on("text", async (ctx) => {
  // Ensure session is initialized before checking
  if (ctx.session && ctx.session.isBroadcasting) {
    if (!AUTHORIZED_USER_IDS.includes(ctx.from.id)) {
      await ctx.reply("You are not authorized to broadcast messages.");
      return;
    }

    const message = ctx.message.text;
    try {
      await broadcastMessage(bot, message);
      await ctx.reply("Broadcast message sent to all users.");
      ctx.session.isBroadcasting = false;
    } catch (error) {
      await ctx.reply("Failed to send broadcast message.");
      console.error("Error broadcasting message:", error);
    }
  }
});

// Launch the bot
bot.launch();
