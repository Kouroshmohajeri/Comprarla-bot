import { PuppeteerCrawler, Dataset } from "crawlee";

// Controller function to handle product data extraction
export const getProductData = async (req, res) => {
  const { url } = req.body;
  console.log("url is:", url);
  if (!url || !url.includes("amazon")) {
    return res.status(400).json({ error: "Invalid Amazon URL" });
  }

  try {
    // Create a new instance of PuppeteerCrawler
    const crawler = new PuppeteerCrawler({
      // Configure Puppeteer launch options
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
      // Request interception to block CSS, fonts, and images
      preNavigationHooks: [
        async ({ page, request }) => {
          await page.setRequestInterception(true);
          page.on("request", (interceptedRequest) => {
            if (
              ["stylesheet", "font", "image"].includes(
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
      // Handle the request
      async requestHandler({ page, request }) {
        // Navigate to the Amazon product page
        await page.goto(request.url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        // Wait for the product title to be visible
        await page.waitForSelector("#productTitle", {
          visible: true,
          timeout: 60000,
        });

        // Take a screenshot for debugging (optional)
        await page.screenshot({
          path: "amazon_product_page.png",
          fullPage: true,
        });

        // Extract the product name
        const name = await page.evaluate(() => {
          const nameElement = document.getElementById("productTitle");
          return nameElement ? nameElement.innerText.trim() : null;
        });

        // Extract the product price
        const price = await page.evaluate(() => {
          const priceElement = document.querySelector(".a-price .a-offscreen");
          return priceElement ? priceElement.innerText.trim() : null;
        });

        // Extract the first product image
        const image = await page.evaluate(() => {
          const imageElement = document.getElementById("landingImage");
          return imageElement ? imageElement.src : null;
        });

        if (!name || !price || !image) {
          throw new Error("Failed to extract product information");
        }

        // Store the extracted data
        await Dataset.pushData({ name, price, image });

        // Send the extracted information as JSON
        res.json({ name, price, image });
      },
      // Handle any errors
      failedRequestHandler({ request, error }) {
        console.error(`Request failed: ${request.url} - ${error.message}`);
        res.status(500).json({
          error: "An error occurred while extracting product information",
        });
      },
    });

    // Run the crawler with the provided URL
    await crawler.run([{ url }]);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while extracting product information",
    });
  }
};
