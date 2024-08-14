import fetchZaraProduct from "./zaraScraper.js";

const scrapers = {
  "zara.com": fetchZaraProduct,
  // Add more scrapers here as needed, e.g., 'amazon.com': fetchAmazonProduct,
};

export const getScraperByDomain = (domain) => {
  return scrapers[domain] || null;
};
