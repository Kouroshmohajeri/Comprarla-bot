import puppeteer from "puppeteer";

// Controller function to handle product data extraction
export const getProductData = async (req, res) => {
  const { url } = req.body;
  console.log("url is:", url);
  if (!url || !url.includes("amazon")) {
    return res.status(400).json({ error: "Invalid Amazon URL" });
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--remote-debugging-port=9222", // Optional: for debugging
      ],
    });
    const page = await browser.newPage();

    // Navigate to the Amazon product page
    await page.goto(url, { waitUntil: "networkidle2", timeout: 60000 }); // Increase timeout to 60 seconds

    // Wait for the product title to be visible with an increased timeout
    await page.waitForSelector("#productTitle", {
      visible: true,
      timeout: 60000,
    });

    // Wait for the product title and price to be loaded
    await page.waitForFunction(
      'document.querySelector("#productTitle") && document.querySelector(".a-price .a-offscreen")'
    );

    // Take a screenshot for debugging
    await page.screenshot({ path: "amazon_product_page.png", fullPage: true });

    // Save the HTML content to inspect it
    const content = await page.content();
    console.log(content);

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

    await browser.close();

    if (!name || !price || !image) {
      return res
        .status(500)
        .json({ error: "Failed to extract product information" });
    }

    // Send the extracted information as JSON
    res.json({ name, price, image });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: "An error occurred while extracting product information",
    });
  }
};
