import { PuppeteerCrawler } from "crawlee";

const createZaraCrawler = () => {
  return new PuppeteerCrawler({
    launchContext: {
      launchOptions: {
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      },
    },
    requestHandler: async ({ page, request }) => {
      try {
        await page.setUserAgent(
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
        );
        await page.goto(request.url, { waitUntil: "domcontentloaded" });

        // Adjust selectors as needed based on Zara's page structure
        const name = await page.evaluate(() => {
          const nameElement = document.querySelector("h1.product-detail-title");
          return nameElement ? nameElement.innerText.trim() : null;
        });

        const price = await page.evaluate(() => {
          const priceElement = document.querySelector(
            ".product-detail-price span"
          );
          return priceElement ? priceElement.innerText.trim() : null;
        });

        const image = await page.evaluate(() => {
          const imageElement = document.querySelector(
            ".product-detail-image img"
          );
          return imageElement ? imageElement.src : null;
        });

        if (!name || !price || !image) {
          throw new Error("Failed to extract product information");
        }

        return { name, price, image };
      } catch (error) {
        console.error(`Zara Scraper Error: ${error.message}`);
        throw error;
      }
    },
    failedRequestHandler({ request, error }) {
      console.error(`Request failed: ${request.url} - ${error.message}`);
    },
  });
};

export default createZaraCrawler;
