import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// Base URL for your backend API
const backendAPIUrl = `${process.env.BACKEND_URL}:${process.env.PORT}/api/users`;

bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const dateJoined = new Date(); // Current date for demonstration
  console.log("user Id :", userId);
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

    // Reply with a welcome message and a link to open the app
    ctx.reply("Welcome to ComprarLa.", {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "Open Mini App",
              web_app: {
                url: `${process.env.FRONTEND_URL}`, // Pass userId as a query parameter
              },
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
