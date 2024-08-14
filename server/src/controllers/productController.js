import { PuppeteerCrawler, Dataset } from "crawlee";

export const getProductData = async (req, res) => {
  const { url } = req.body;
  console.log("url is:", url);

  if (!url || !url.includes("amazon")) {
    return res.status(400).json({ error: "Invalid Amazon URL" });
  }

  try {
    const crawler = new PuppeteerCrawler({
      launchContext: {
        launchOptions: {
          headless: true,
          args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-dev-shm-usage",
            "--disable-gpu", // New: Disable GPU
            "--single-process", // New: Single process to reduce memory overhead
          ],
        },
      },
      preNavigationHooks: [
        async ({ page }) => {
          await page.setRequestInterception(true);
          page.on("request", (interceptedRequest) => {
            if (
              ["stylesheet", "font", "image", "media", "websocket"].includes(
                interceptedRequest.resourceType()
              )
            ) {
              interceptedRequest.abort();
            } else {
              interceptedRequest.continue();
            }
          });
        },
      ],
      async requestHandler({ page, request }) {
        await page.goto(request.url, {
          waitUntil: "networkidle2", // New: Faster page load trigger
          timeout: 30000, // New: Reduced timeout
        });

        await page.waitForSelector("#productTitle", {
          visible: true,
          timeout: 30000,
        });

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

        if (!name || !price || !image) {
          throw new Error("Failed to extract product information");
        }

        res.json({ name, price, image });
      },
      failedRequestHandler({ request, error }) {
        console.error(`Request failed: ${request.url} - ${error.message}`);
        res.status(500).json({
          error: "An error occurred while extracting product information",
        });
      },
    });

    await crawler.run([{ url }]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while extracting product information",
    });
  }
};
