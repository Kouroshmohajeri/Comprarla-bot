import puppeteer from "puppeteer";

// Function to fetch conversion rate from Euro to Toman
export const fetchEuroToToman = async () => {
  try {
    const url = "https://www.tgju.org/profile/price_eur";
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Extract the conversion rate
    const rateText = await page.evaluate(() => {
      const rateElement = document.querySelector(
        'span[data-col="info.last_trade.PDrCotVal"]'
      );
      return rateElement
        ? rateElement.textContent.replace(/[^0-9]/g, "")
        : null;
    });

    await browser.close();

    if (!rateText) {
      throw new Error("Conversion rate extraction failed");
    }

    // Convert the rate to Toman by eliminating the last digit
    const rateInRial = parseInt(rateText, 10);
    const rateInToman = rateInRial / 10;

    return rateInToman;
  } catch (error) {
    console.error("Error fetching Euro to Toman conversion rate:", error);
    throw new Error("Unable to fetch conversion rate.");
  }
};
