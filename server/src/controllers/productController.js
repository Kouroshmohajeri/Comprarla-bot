import { scrapeProduct } from "../services/scrapingService";

export const getProductData = async (req, res) => {
  const { url } = req.body;

  try {
    const productData = await scrapeProduct(url);
    res.json(productData);
  } catch (error) {
    console.error(`Controller Error: ${error.message}`);
    res
      .status(500)
      .json({
        error: "An error occurred while extracting product information",
      });
  }
};
