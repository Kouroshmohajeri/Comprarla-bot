import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const broadcastMessage = async (bot, message) => {
  try {
    // Fetch all user IDs from the database
    const { data } = await axios.get(`${process.env.BACKEND_URL}/api/users`);
    const userIds = data.map((user) => user.userId);

    // Send the message with the button to each user
    for (const userId of userIds) {
      try {
        await bot.telegram.sendMessage(userId, message, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Open Mini App",
                  web_app: { url: `${process.env.WEB_LINK}?userId=${userId}` },
                },
              ],
            ],
          },
        });
      } catch (error) {
        console.error(`Failed to send message to ${userId}:`, error);
      }
    }

    console.log(
      `Broadcast message successfully sent to ${userIds.length} users.`
    );
  } catch (error) {
    console.error("Error broadcasting message:", error);
  }
};

export default broadcastMessage;
