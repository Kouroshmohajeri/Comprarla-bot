import puppeteer from "puppeteer";
import TelegramBot from "node-telegram-bot-api";
import { fetchEuroToToman } from "./services/currencyService.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Replace with your Telegram bot token
const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error(
    "TELEGRAM_BOT_TOKEN is not defined. Please set the environment variable."
  );
  process.exit(1); // Exit the application with an error code
}

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Function to format numbers with thousands separators
const formatNumber = (number) => {
  return new Intl.NumberFormat().format(number);
};

// Function to determine the additional price based on ranges
const getAdditionalPrice = (price) => {
  if (price > 0 && price <= 100) return 25;
  if (price >= 101 && price <= 200) return 35;
  if (price >= 201 && price <= 500) return 45;
  if (price >= 510) return 50;
  return 0;
};

// Function to fetch product data
const getProductData = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    const product = await page.evaluate(() => {
      const getTextContent = (selector) => {
        const element = document.querySelector(selector);
        return element ? element.textContent.trim() : null;
      };

      const getPrice = (selector) => {
        const priceText = getTextContent(selector);
        return priceText ? parseFloat(priceText.replace(/[^0-9.]/g, "")) : null;
      };

      const name =
        getTextContent("#productTitle") ||
        getTextContent(".product-title") ||
        "نامشخص";

      // Extracting both original and discounted prices
      const originalPrice =
        getPrice(".priceBlockStrikePriceString") ||
        getPrice("#priceblock_ourprice");
      const discountedPrice =
        getPrice("#priceblock_dealprice") ||
        getPrice("#priceblock_saleprice") ||
        getPrice(".a-price .a-offscreen");

      const imageUrl =
        document.querySelector("#landingImage")?.src ||
        document.querySelector(".product-image img")?.src ||
        null;

      return { name, discountedPrice, originalPrice, imageUrl };
    });

    await browser.close();

    // Ensure at least one price is available
    if (isNaN(product.discountedPrice) && isNaN(product.originalPrice)) {
      throw new Error("استخراج قیمت شکست خورد");
    }

    const euroToTomanRate = await fetchEuroToToman();

    // Determine the price to use for conversion and additional price
    const priceToUse = product.discountedPrice || product.originalPrice;

    const additionalPrice = getAdditionalPrice(priceToUse);
    const totalPrice = priceToUse + additionalPrice;
    const convertedPrice = priceToUse * euroToTomanRate;
    const convertedAdditionalPrice = additionalPrice * euroToTomanRate;

    const result = {
      name: product.name,
      price: priceToUse,
      additionalPrice,
      totalPrice,
      imageUrl: product.imageUrl,
      convertedPrice,
      convertedAdditionalPrice,
    };

    return result;
  } catch (error) {
    console.error("Error fetching product data or currency rates:", error);
    throw new Error("Error fetching product data or currency rates");
  }
};

// Handle /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
به ربات قیمت محصول خوش آمدید!
لینک محصول را برای من ارسال کنید تا قیمت آن را به یورو بدست آورده و به تومان تبدیل کنم.
  `;
  bot.sendMessage(chatId, welcomeMessage);
});

// Handle incoming messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const url = msg.text;

  // Skip the /start command as it is handled separately
  if (url.startsWith("/start")) {
    return;
  }

  try {
    const waitingMessage = await bot.sendMessage(
      chatId,
      "لینک شما دریافت شد..."
    );

    await bot.editMessageText("در حال پردازش محصول...", {
      chat_id: chatId,
      message_id: waitingMessage.message_id,
    });

    const productData = await getProductData(url);

    await bot.editMessageText("محصول یافت شد...", {
      chat_id: chatId,
      message_id: waitingMessage.message_id,
    });

    await bot.editMessageText("در حال تبدیل قیمت...", {
      chat_id: chatId,
      message_id: waitingMessage.message_id,
    });

    const responseMessage = `
*نام محصول:* ${productData.name}

*قیمت کل (تومان):* ${formatNumber(productData.convertedPrice.toFixed(0))}
ـــــــــــــــــــــــــــــــ
آنلاین شاپ ComprarLa
ـــــــــــــــــــــــــــــــ
قیمت ارائه شده تا ساعت {} اعتبار دارد.
قبل از سفارش قیمت نهایی با شما چک میشود 
و خرید در اسپانیا انجام میشود.
ـــــــــــــــــــــــــــــــ
*باربری:*
زمان و نحوه ارسال به شما در زمان ثبت سفارش اطلاع داده می شود.
باربری های ComprarLa به طور معمول۲ هفته تا ۱ ماه طول می کشد.

🇪🇸

    `;

    if (productData.imageUrl) {
      await bot.sendPhoto(chatId, productData.imageUrl, {
        caption: responseMessage,
        parse_mode: "Markdown",
      });
    } else {
      await bot.sendMessage(chatId, responseMessage, {
        parse_mode: "Markdown",
      });
    }

    // Delete the waiting message after sending the final response
    await bot.deleteMessage(chatId, waitingMessage.message_id);
  } catch (error) {
    await bot.sendMessage(
      chatId,
      "دریافت اطلاعات محصول شکست خورد. لطفاً اطمینان حاصل کنید که لینک صحیح است و دوباره تلاش کنید."
    );
  }
});

console.log("Comprarla bot is running...");
