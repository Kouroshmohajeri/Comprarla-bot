import { PuppeteerCrawler } from "crawlee";

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
            "--disable-gpu",
            "--single-process",
          ],
        },
      },
      preNavigationHooks: [
        async ({ page }) => {
          await page.setJavaScriptEnabled(true); // Re-enable JavaScript
          await page.setRequestInterception(true);
          page.on("request", (interceptedRequest) => {
            if (
              ["stylesheet", "font", "image", "media"].includes(
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
        try {
          await page.goto(request.url, {
            waitUntil: "domcontentloaded", // Wait for DOM content to load
            timeout: 30000, // Increase timeout
          });

          const name = await page.evaluate(() => {
            const nameElement = document.getElementById("productTitle");
            return nameElement ? nameElement.innerText.trim() : null;
          });

          const price = await page.evaluate(() => {
            const priceElement = document.querySelector(
              ".a-price .a-offscreen"
            );
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
        } catch (error) {
          console.error(
            `Error extracting product information: ${error.message}`
          );
          res.status(500).json({
            error: "An error occurred while extracting product information",
          });
        }
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
    console.error(`Crawler error: ${error.message}`);
    res.status(500).json({
      error: "An error occurred while extracting product information",
    });
  }
};
