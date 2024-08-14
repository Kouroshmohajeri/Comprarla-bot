import createZaraCrawler from "../scrapers/zaraScraper";

// Domains to scrape
const scrapers = {
  "zara.com": createZaraCrawler,
};

export const scrapeProduct = async (url) => {
  const domain = new URL(url).hostname;
  const scraper = scrapers[domain];

  if (!scraper) {
    throw new Error("No scraper available for this domain");
  }

  const crawler = scraper();
  const result = await crawler.run([{ url }]);
  return result;
};
