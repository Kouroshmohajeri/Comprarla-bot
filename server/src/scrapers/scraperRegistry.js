import fetchMassimoDuttiProduct from "./massimoduttiScraper.js";

// Available domains
const scrapers = {
  massimodutti: fetchMassimoDuttiProduct,
};

export const getScraperByDomain = (domain) => {
  return scrapers[domain] || null;
};
