import { Telegraf } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config(); // Load environment variables from .env file

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// Base URL for your backend API
const backendAPIUrl = `${process.env.BACKEND_URL}/api/users`;
const web_link = "https://comprarla.es/";
const AUTHORIZED_USER_ID = parseInt(process.env.AUTHORIZED_USER_ID);

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
      points: 0, // Initial points
      invitations: [], // Initial invitations
      tasksDone: 0, // Initial tasks
      isOG: false, // Initial status
      profilePhotoUrl, // Include the profile photo URL
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
          [
            {
              text: "Broadcast Message",
              callback_data: "broadcast_message",
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
// Handle /broadcast command
bot.command("broadcast", (ctx) => {
  if (ctx.from.id === AUTHORIZED_USER_ID) {
    ctx.reply("Please send the message you want to broadcast.");
    ctx.session = { isBroadcasting: true };
  } else {
    ctx.reply("You are not authorized to broadcast messages.");
  }
});

// Handle incoming messages for broadcasting
bot.on("text", async (ctx) => {
  if (ctx.session && ctx.session.isBroadcasting) {
    if (ctx.from.id !== AUTHORIZED_USER_ID) {
      ctx.reply("You are not authorized to broadcast messages.");
      return;
    }

    const message = ctx.message.text;
    try {
      // Fetch all user IDs from the database
      const { data } = await axios.get(`${backendAPIUrl}`);
      const userIds = data.map((user) => user.userId);

      // Broadcast the message to all users
      for (const userId of userIds) {
        try {
          await bot.telegram.sendMessage(userId, message);
        } catch (error) {
          console.error(`Failed to send message to ${userId}:`, error);
        }
      }

      ctx.reply("Broadcast message sent to all users.");
      ctx.session.isBroadcasting = false; // End broadcasting mode
    } catch (error) {
      ctx.reply("Failed to send broadcast message.");
      console.error("Error broadcasting message:", error);
    }
  }
});
// Launch the bot
bot.launch();
