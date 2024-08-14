import { PuppeteerCrawler, Dataset } from "crawlee";
import { launchPuppeteer } from "crawlee";

// Create a new instance of PuppeteerCrawler
const crawler = new PuppeteerCrawler({
  // Launch Puppeteer with custom settings
  launchContext: {
    launchOptions: {
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    },
  },
  // Handle the pages that are being crawled
  async requestHandler({ page, request, enqueueLinks, log }) {
    log.info(`Processing: ${request.url}`);

    // Wait for the product title to appear
    await page.waitForSelector("#productTitle", { timeout: 60000 });

    // Extract the data you need
    const name = await page.evaluate(() => {
      const nameElement = document.getElementById("productTitle");
      return nameElement ? nameElement.innerText.trim() : null;
    });

    const price = await page.evaluate(() => {
      const priceElement = document.querySelector(".a-price .a-offscreen");
      return priceElement ? priceElement.innerText.trim() : null;
    });

    const image = await page.evaluate(() => {
      const imageElement = document.getElementById("landingImage");
      return imageElement ? imageElement.src : null;
    });

    // Store the extracted data
    await Dataset.pushData({ name, price, image });
  },

  // Handle any errors
  failedRequestHandler({ request }) {
    log.error(`Request ${request.url} failed too many times.`);
  },
});

// Add the initial URL to the queue
await crawler.run([
  "https://www.amazon.com/LEVOIT-Purifier-Home-Allergies-Pets/dp/B07VVK39F7?ref=dlx_deals_dg_dcl_B07VVK39F7_dt_sl14_d5&th=1",
]);
