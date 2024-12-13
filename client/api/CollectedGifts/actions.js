import API from "../server";

// Add a collected gift
export const addCollectedGift = async (userId, giftId, quantity) => {
  try {
    const response = await API.post("/collected-gifts", {
      userId,
      giftId,
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding collected gift:", error);
    throw error;
  }
};

// Get collected gifts by userId
export const getCollectedGiftsByUser = async (userId) => {
  try {
    const response = await API.get(`/collected-gifts/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error getting collected gifts:", error);
    throw error;
  }
};

// Delete a collected gift by ID
export const deleteCollectedGift = async (id) => {
  try {
    const response = await API.delete(`/collected-gifts/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting collected gift:", error);
    throw error;
  }
};
