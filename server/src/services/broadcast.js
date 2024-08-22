import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const broadcastMessage = async (bot, message) => {
  try {
    // Fetch all user IDs from the database
    const { data } = await axios.get(`${process.env.BACKEND_URL}/api/users`);
    const userIds = data.map((user) => user.userId);

    // Send the message to each user
    for (const userId of userIds) {
      try {
        await bot.telegram.sendMessage(userId, message);
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
