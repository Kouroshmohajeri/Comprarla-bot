import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// Base URL for your backend API
const backendAPIUrl = `${process.env.BACKEND_URL}:${process.env.PORT}/api/users`;
const web_link = "https://comprarla.es/";
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const dateJoined = new Date(); // Current date for demonstration
  try {
    // Send user data to your backend to be saved in MongoDB
    await axios.post(`${backendAPIUrl}`, {
      userId,
      username,
      dateJoined,
      points: 0, // Initial points
      invitations: [], // Initial invitations
      tasksDone: 0, // Initial tasks
      isOG: false, // Initial status
    });
    ctx.reply("Welcome to ComprarLa.", {
      reply_markup: {
        keyboard: [
          [
            {
              text: "Open Mini App",
              web_app: { url: `${web_link}?userId=${userId}` },
            },
          ],
        ],
      },
    });
  } catch (error) {
    console.error("Failed to save user data:", error);
    ctx.reply(
      "An error occurred while processing your data. Please try again."
    );
  }
});

// Launch the bot
bot.launch();
