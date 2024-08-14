import fetchMassimoDuttiProduct from "./massimoduttiScraper.js";

// Available domains
const scrapers = {
  "massimodutti.com": fetchMassimoDuttiProduct,
};

export const getScraperByDomain = (domain) => {
  return scrapers[domain] || null;
};
