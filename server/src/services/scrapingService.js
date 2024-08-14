import createZaraCrawler from "../scrapers/zaraScraper.js";

// Domains to scrape
const scrapers = {
  "zara.com": createZaraCrawler,
  // Add more scrapers here as needed
};

export const scrapeProduct = async (url) => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace(/^www\./, ""); // Normalize domain
    console.log(`Extracted Domain: ${domain}`); // Debugging output

    const scraper = scrapers[domain];

    if (!scraper) {
      throw new Error("No scraper available for this domain");
    }

    const crawler = scraper();
    const result = await crawler.run([{ url }]);
    return result;
  } catch (error) {
    console.error(`Scraping Error: ${error.message}`);
    throw error;
  }
};
