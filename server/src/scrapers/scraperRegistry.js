import fetchMassimoDuttiProduct from "./massimoduttiScraper";

// Available domains
const scrapers = {
  "massimodutti.com": fetchMassimoDuttiProduct,
};

export const getScraperByDomain = (domain) => {
  return scrapers[domain] || null;
};
