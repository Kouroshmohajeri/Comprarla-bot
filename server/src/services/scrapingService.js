import { getScraperByDomain } from "../scrapers/scraperRegistry.js";

const normalizeDomain = (hostname) => {
  // Strip 'www.' and any country-specific suffixes
  return hostname.replace(/^www\./, "").replace(/\..+$/, ""); // Remove anything after the first dot
};

export const scrapeProduct = async (url) => {
  try {
    const parsedUrl = new URL(url);
    const domain = normalizeDomain(parsedUrl.hostname);
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
