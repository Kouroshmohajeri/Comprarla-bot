import { Telegraf, session } from "telegraf";
import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import broadcastMessage from "./services/broadcast.js";

dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// Set the webhook path
const webhookPath = "/comprarla-hook";
const app = express();
const port = process.env.BOT_PORT || 3001;
// Initialize session middleware
bot.use(session());
app.use(express.json());

// Webhook route
app.use("/comprarla-webhook", bot.webhookCallback("/comprarla-webhook"));

// Runnig on port listening to webhook
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Set up the webhook with Telegram
bot.telegram.setWebhook(`https://comprarla.es/comprarla-webhook`);

const backendAPIUrl = `${process.env.BACKEND_URL}/api/users`;
const web_link = "https://comprarla.es/";
const AUTHORIZED_USER_IDS =
  process.env.AUTHORIZED_USER_IDS.split(",").map(Number); // List of authorized user IDs

// Start command
bot.start(async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username;
  const firstName = ctx.from.first_name;
  const lastName = ctx.from.last_name || "";
  const dateJoined = new Date();

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

// Handle callback queries (e.g., button presses)
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

// Set up the webhook and start the bot with it
bot.telegram.setWebhook(`https://23.227.167.112${webhookPath}`);
bot.startWebhook(webhookPath, null, 5000);

console.log(
  `Bot is running and webhook is set to https://23.227.167.112${webhookPath}`
);
