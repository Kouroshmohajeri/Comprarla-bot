import { getScraperByDomain } from "../scrapers/scraperRegistry.js";

export const scrapeProduct = async (url) => {
  try {
    const parsedUrl = new URL(url);
    const domain = parsedUrl.hostname.replace(/^www\./, ""); // Normalize domain
    console.log(`Extracted Domain: ${domain}`); // Debugging output

    const scraper = getScraperByDomain(domain);

    if (!scraper) {
      throw new Error(`No scraper available for domain: ${domain}`);
    }

    const productData = await scraper(url);
    return productData;
  } catch (error) {
    console.error(`Scraping Error: ${error.message}`);
    throw error;
  }
};
