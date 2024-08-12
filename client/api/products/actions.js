import API from "../server.js";

export const fetchProductData = async (url) => {
  try {
    const response = await API.post("/products/get", { url });
    return response.data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error;
  }
};
