import { PuppeteerCrawler } from "crawlee";

const cleanAmazonUrl = (url) => {
  const parsedUrl = new URL(url);
  const allowedParams = ["dp", "qid", "sr", "keywords"];
  for (let param of parsedUrl.searchParams.keys()) {
    if (!allowedParams.includes(param)) {
      parsedUrl.searchParams.delete(param);
    }
  }
  return parsedUrl.origin + parsedUrl.pathname + parsedUrl.search;
};

export const getProductData = async (req, res) => {
  let { url } = req.body;
  console.log("Original URL:", url);

  if (!url || !url.includes("amazon")) {
    return res.status(400).json({ error: "Invalid Amazon URL" });
  }

  url = cleanAmazonUrl(url);
  console.log("Cleaned URL:", url);

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
          await page.setJavaScriptEnabled(true);
          await page.setRequestInterception(true);
          page.on("request", (interceptedRequest) => {
            const type = interceptedRequest.resourceType();
            if (["stylesheet", "font", "image", "media"].includes(type)) {
              interceptedRequest.abort();
            } else {
              interceptedRequest.continue();
            }
          });
        },
      ],
      async requestHandler({ page, request }) {
        try {
          console.log(`Navigating to URL: ${request.url}`);

          // Set realistic user agent
          await page.setUserAgent(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
          );

          await page.goto(request.url, {
            waitUntil: "domcontentloaded",
            timeout: 60000,
          });

          // Debugging: Check page content
          const pageContent = await page.content();
          console.log("Page Content:", pageContent.slice(0, 1000));

          // Debugging: Check if the elements exist
          const titleExists = await page.evaluate(
            () => !!document.querySelector("#productTitle")
          );
          const imageExists = await page.evaluate(
            () => !!document.querySelector("#landingImage")
          );
          console.log("Title Exists:", titleExists);
          console.log("Image Exists:", imageExists);

          const name = await page.evaluate(() => {
            const nameElement = document.querySelector("#productTitle");
            return nameElement ? nameElement.innerText.trim() : null;
          });

          const price = await page.evaluate(() => {
            const priceElement = document.querySelector(
              ".a-price .a-offscreen"
            );
            return priceElement ? priceElement.innerText.trim() : null;
          });

          const image = await page.evaluate(() => {
            const imageElement = document.querySelector("#landingImage");
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

    console.log(`Starting crawler for URL: ${url}`);
    await crawler.run([{ url }]);
    console.log("Crawler run completed");
  } catch (error) {
    console.error(`Crawler error: ${error.message}`);
    res.status(500).json({
      error: "An error occurred while extracting product information",
    });
  }
};
