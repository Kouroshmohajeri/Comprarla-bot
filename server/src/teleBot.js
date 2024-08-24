import { Telegraf, session } from "telegraf";
import axios from "axios";
import dotenv from "dotenv";
import broadcastMessage from "./services/broadcast.js";

dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const bot = new Telegraf(TOKEN);

// Initialize session middleware
bot.use(session());

const backendAPIUrl = `${process.env.BACKEND_URL}/api/users`;
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
          web_app: { url: `https://comprarla.es/?userId=${userId}` },
        },
      ],
    ];

    // Conditionally add the "Broadcast Message" button if the user is authorized
    if (AUTHORIZED_USER_IDS.includes(userId)) {
      keyboardOptions.push([
        {
          text: "Generate Invitation Code",
          callback_data: "generate_invitation_code",
        },
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

  if (callbackData === "generate_invitation_code") {
    if (AUTHORIZED_USER_IDS.includes(ctx.from.id)) {
      await ctx.answerCbQuery();

      try {
        const response = await axios.post(
          `${backendAPIUrl}/generate-invitation/${ctx.from.id}`
        );
        const { invitationCode } = response.data;

        // Send the invitation code to the user
        await ctx.reply(
          `Here is your invitation code: ${invitationCode}. Please forward this message to others.`
        );
        await ctx.reply(
          'To forward this message, press and hold the message, then select "Forward".'
        );
      } catch (error) {
        await ctx.reply("Failed to generate invitation code.");
        console.error("Error generating invitation code:", error);
      }
    } else {
      await ctx.answerCbQuery();
      await ctx.reply("You are not authorized to generate invitation codes.");
    }
  } else if (callbackData === "broadcast_message") {
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
  if (ctx.session && ctx.session.isBroadcasting) {
    if (!AUTHORIZED_USER_IDS.includes(ctx.from.id)) {
      await ctx.reply("You are not authorized to broadcast messages.");
      return;
    }

    const message = ctx.message.text;
    try {
      // Add your broadcasting logic here
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
