import axios from "axios";
import cheerio from "cheerio";

const fetchZaraProduct = async (url) => {
  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        "Accept-Encoding": "gzip, deflate, br",
        Connection: "keep-alive",
      },
    });

    const $ = cheerio.load(response.data);

    const name = $("h1.product-detail-title").text().trim();
    const price = $(".product-detail-price span").text().trim();
    const image = $(".product-detail-image img").attr("src");

    if (!name || !price || !image) {
      throw new Error("Failed to extract product information");
    }

    return { name, price, image };
  } catch (error) {
    console.error(`Zara Scraper Error: ${error.message}`);
    throw error;
  }
};

export default fetchZaraProduct;
