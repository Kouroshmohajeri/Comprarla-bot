import fetchZaraProduct from "./zaraScraper.js";

// Available domains
const scrapers = {
  zara: fetchZaraProduct,
};

export const getScraperByDomain = (domain) => {
  return scrapers[domain] || null;
};
