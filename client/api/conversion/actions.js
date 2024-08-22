import API from "../server.js"; // Adjust the import path based on your directory structure

// Function to fetch the Euro to Toman conversion rate
export const getEuroToTomanRate = async () => {
  try {
    const response = await API.get("/conversion/euro-to-toman");
    if (response.data.success) {
      return response.data.rate;
    } else {
      throw new Error("Failed to fetch conversion rate");
    }
  } catch (error) {
    console.error("Error in getEuroToTomanRate:", error);
    throw error;
  }
};
