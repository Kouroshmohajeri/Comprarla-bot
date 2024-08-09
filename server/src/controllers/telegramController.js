import axios from "axios";

const TELEGRAM_API_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`;

export const sendMessage = async (chatId, text) => {
  try {
    await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
      chat_id: chatId,
      text: text,
    });
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

// Handle incoming updates
export const handleUpdate = (req, res) => {
  const { message } = req.body;
  if (message && message.text) {
    const chatId = message.chat.id;
    const responseText = `You said: ${message.text}`;
    sendMessage(chatId, responseText);
  }
  res.sendStatus(200);
};
