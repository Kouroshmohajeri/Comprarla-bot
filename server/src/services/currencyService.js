import puppeteer from "puppeteer"; // Import full puppeteer package

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

    // Set a common User-Agent to mimic a real browser
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    );

    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });

    // Take a screenshot for debugging (optional)
    await page.screenshot({ path: "currency_debug_screenshot.png" });

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

    const rateInRial = parseInt(rateText, 10);
    const rateInToman = rateInRial / 10;

    return rateInToman;
  } catch (error) {
    console.error("Error fetching Euro to Toman conversion rate:", error);
    throw new Error("Unable to fetch conversion rate.");
  }
};
