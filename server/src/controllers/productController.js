import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";
import { fetchEuroToToman } from "../services/currencyService.js";

const getProductData = async (req, res) => {
  const { url } = req.body;
  console.log(url);

  let browser = null; // Define browser outside the try block

  try {
    browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
      ignoreHTTPSErrors: true,
    });

    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.setRequestInterception(true);
    page.on("request", (req) => {
      if (["image", "stylesheet", "font"].includes(req.resourceType())) {
        req.abort();
      } else {
        req.continue();
      }
    });

    let retries = 3;
    while (retries > 0) {
      try {
        await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 });
        break; // Break if successful
      } catch (err) {
        console.error(`Navigation failed, retries left: ${--retries}`);
        if (retries === 0) throw err;
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }

    const product = await page.evaluate(() => {
      try {
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
      } catch (error) {
        return { error: "Element not found or frame was detached" };
      }
    });

    if (product.error) {
      throw new Error(product.error);
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
  } finally {
    if (browser) {
      try {
        await browser.close();
      } catch (closeError) {
        console.error("Error closing browser:", closeError);
      }
    }
  }
};

export { getProductData };
