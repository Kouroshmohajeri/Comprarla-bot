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
  await handleStart(ctx);
});

// Launch the bot
bot.launch();

console.log("Bot is running...");
