import API from "../server";

// Create a new gift
export const createGift = async (giftData) => {
  try {
    const response = await API.post("/gifts/add", giftData);
    return response.data;
  } catch (error) {
    console.error("Error creating gift:", error);
    throw error;
  }
};

// Get all gifts
export const getAllGifts = async () => {
  try {
    const response = await API.get("/gifts");
    return response.data;
  } catch (error) {
    console.error("Error fetching gifts:", error);
    throw error;
  }
};

// Get a gift by ID
export const getGiftById = async (id) => {
  try {
    const response = await API.get(`/gifts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching gift:", error);
    throw error;
  }
};

// Update a gift by ID
export const updateGiftById = async (id, giftData) => {
  try {
    const response = await API.put(`/gifts/${id}`, giftData);
    return response.data;
  } catch (error) {
    console.error("Error updating gift:", error);
    throw error;
  }
};

// Delete a gift by ID
export const deleteGiftById = async (id) => {
  try {
    await API.delete(`/gifts/${id}`);
  } catch (error) {
    console.error("Error deleting gift:", error);
    throw error;
  }
};
