import axios from "axios";
import * as cheerio from "cheerio";

const fetchZaraProduct = async (url) => {
  try {
    // Perform a GET request to fetch the webpage
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    });

    // Check if the response status is 200 (OK)
    if (response.status !== 200) {
      throw new Error(`Failed to fetch page, status code: ${response.status}`);
    }

    // Load the response data into cheerio for parsing
    const $ = cheerio.load(response.data);

    // Extract product information using the provided selectors
    const name = $(
      "#main > article > div.product-detail-view__content > div.product-detail-view__main > div.product-detail-view__side-bar > div > div.product-detail-info__info > div.product-detail-info__header > div.product-detail-info__header-content > h1"
    )
      .text()
      .trim();
    const price = $(
      "#main > article > div.product-detail-view__content > div.product-detail-view__main > div.product-detail-view__side-bar > div > div.product-detail-info__info > div.product-detail-info__price > div > span > span > span > div > span"
    )
      .text()
      .trim();
    const image = $(
      "#main > article > div.product-detail-view__content > div.product-detail-view__main > div.product-detail-view__main-content > section > div.product-detail-images__frame > ul > li:nth-child(1) > button > div > div > picture > img"
    ).attr("src");

    // Check if all fields were extracted successfully
    if (!name || !price || !image) {
      throw new Error("Failed to extract complete product information");
    }

    return { name, price, image };
  } catch (error) {
    console.error(`Zara Scraper Error: ${error.message}`);
    throw error;
  }
};

export default fetchZaraProduct;
