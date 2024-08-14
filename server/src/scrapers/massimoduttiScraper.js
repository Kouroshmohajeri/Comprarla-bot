import axios from "axios";
import * as cheerio from "cheerio";

const fetchMassimoDuttiProduct = async (url) => {
  try {
    // Perform a GET request to fetch the product page
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

    // Extract product information using appropriate selectors
    const name = $(
      "#main-content > div.product-detail > div > div.product-detail__title"
    )
      .text()
      .trim();
    const price = $(
      "#main-content > div.product-detail > div > div.product-detail__price > span.price"
    )
      .text()
      .trim();
    const image = $(
      "#main-content > div.product-detail > div > div.product-detail__media > picture > img"
    ).attr("src");

    // Check if all fields were extracted successfully
    if (!name || !price || !image) {
      throw new Error("Failed to extract complete product information");
    }

    return { name, price, image };
  } catch (error) {
    console.error(`Massimo Dutti Scraper Error: ${error.message}`);
    throw error;
  }
};

export default fetchMassimoDuttiProduct;
