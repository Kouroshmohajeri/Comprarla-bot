import puppeteer from "puppeteer"; // Ensure this line is correct
import { fetchEuroToToman } from "../services/currencyService.js";

const getProductData = async (req, res) => {
  const { url } = req.body;

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

    // Extract product details
    const product = await page.evaluate(() => {
      const nameElement = document.querySelector("#productTitle");
      const name = nameElement ? nameElement.textContent.trim() : "No Name";

      let priceText =
        document.querySelector("#priceblock_dealprice")?.textContent.trim() ||
        document.querySelector("#priceblock_saleprice")?.textContent.trim() ||
        document.querySelector("#priceblock_ourprice")?.textContent.trim() ||
        "";

      if (!priceText) {
        const priceElement = document.querySelector(".a-price .a-offscreen");
        if (priceElement) {
          priceText = priceElement.textContent.trim();
        }
      }

      const cleanedPriceText = priceText.replace(/[^0-9.]/g, "");
      const price = parseFloat(cleanedPriceText);

      const images = Array.from(
        document.querySelectorAll("#altImages img")
      ).map((img) => img.src);

      return { name, price, images };
    });

    await browser.close();

    if (isNaN(product.price) || product.price <= 0) {
      throw new Error("Price extraction failed");
    }

    const euroToTomanRate = await fetchEuroToToman();
    const convertedPrice = product.price * euroToTomanRate;

    const result = {
      "Product Name": product.name,
      "Price (USD)": product.price,
      "Converted Price (Toman)": convertedPrice,
      images: product.images,
    };

    res.json(result);
  } catch (error) {
    console.error("Error fetching product data or currency rates:", error);
    res
      .status(500)
      .json({ message: "Error fetching product data or currency rates" });
  }
};

export { getProductData };
