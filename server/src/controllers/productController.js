import puppeteer from "puppeteer";

// Controller function to handle product data extraction
export const getProductData = async (req, res) => {
  const { amazonUrl } = req.body;
  console.log(amazonUrl);
  if (!amazonUrl || !amazonUrl.includes("amazon")) {
    return res.status(400).json({ error: "Invalid Amazon URL" });
  }

  try {
    // Launch Puppeteer
    const browser = await puppeteer.launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    });
    const page = await browser.newPage();

    // Navigate to the Amazon product page
    await page.goto(amazonUrl, { waitUntil: "networkidle2" });

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
