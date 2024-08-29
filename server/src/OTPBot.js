import { Telegraf } from "telegraf";
import { handleStart } from "./controllers/otpController.js";
import connectDB from "./config/db.js";

// Replace with your actual Telegram bot token
const token = "7253261804:AAG844nfGGTUEXeMtDxZk2NpSoGIKrZpZlg";
connectDB();

// Initialize the bot
const bot = new Telegraf(token);

// Handle /start command
bot.start(async (ctx) => {
  // Check if the start command includes the parameter `auth`
  if (ctx.startPayload === "auth") {
    console.log("Starting fresh for user:", ctx.from.id);
    await handleStart(ctx);
  } else {
    // Handle other cases or default behavior if needed
    console.log("User started bot without 'auth' payload:", ctx.from.id);
    ctx.reply("Please use https://comprarla.es/login to login.");
  }
});

// Launch the bot
bot.launch();

console.log("Bot is running...");
