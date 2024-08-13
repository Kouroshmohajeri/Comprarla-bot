import puppeteer from "puppeteer-core"; // Use puppeteer-core to specify the executablePath
import { fetchEuroToToman } from "../services/currencyService.js";

// Function to determine the additional price based on ranges
const getAdditionalPrice = (price) => {
  if (price > 0 && price <= 100) return 25;
  if (price >= 101 && price <= 200) return 35;
  if (price >= 201 && price <= 500) return 45;
  if (price >= 510) return 50;
  return 0;
};

const scrapeProductData = async (url) => {
  let browser = null;
  try {
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser", // Path to Chromium binary
      headless: false,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Take a screenshot for debugging
    await page.screenshot({ path: "debug_screenshot.png" });

    // Log page content for debugging
    const pageContent = await page.content();
    console.log("Page content:", pageContent);

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

      console.log("Extracted Product Data:", {
        name,
        discountedPrice,
        originalPrice,
        imageUrl,
      });

      return { name, discountedPrice, originalPrice, imageUrl };
    });

    await browser.close();

    if (isNaN(product.discountedPrice) && isNaN(product.originalPrice)) {
      throw new Error("Price extraction failed");
    }

    return product;
  } catch (error) {
    console.error("Error fetching product data:", error);
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
    throw new Error("Error fetching product data");
  }
};

export const getProductData = async (req, res) => {
  const { url } = req.body;

  try {
    const product = await scrapeProductData(url);
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

    res.status(200).json(result);
  } catch (error) {
    console.error("Error in getProductData:", error);
    res
      .status(500)
      .json({ message: "Error fetching product data or currency rates" });
  }
};
