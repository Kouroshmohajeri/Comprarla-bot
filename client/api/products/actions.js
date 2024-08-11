import API from "../server.js";

export const fetchProductData = async (url) => {
  try {
    const response = await API.post("/products/get", { url });
    alert(response);
    return response.data;
  } catch (error) {
    console.error("Error fetching product data:", error);
    throw error;
  }
};
