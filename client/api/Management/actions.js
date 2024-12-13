import API from "../server";

// Add a new management entry
export const addManagementEntry = async (userId, promotedBy) => {
  try {
    const response = await API.post("/management/add", { userId, promotedBy });
    return response.data;
  } catch (error) {
    console.error("Error adding management entry:", error);
    throw error; // Re-throw the error for handling by the calling function
  }
};

// Get a management entry by userId
export const getManagementEntry = async (userId) => {
  try {
    const response = await API.get(`/management/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching management entry:", error);
    throw error;
  }
};

// Get all management entries
export const getAllManagementEntries = async () => {
  try {
    const response = await API.get("/management");
    return response.data;
  } catch (error) {
    console.error("Error fetching all management entries:", error);
    throw error;
  }
};

// Delete a management entry by userId
export const deleteManagementEntry = async (userId) => {
  try {
    const response = await API.delete(`/management/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting management entry:", error);
    throw error;
  }
};

export const checkManagement = async (userId) => {
  try {
    const response = await API.get(`/management/${userId}`);
    return { isManagement: true, data: response.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      // User not found in the management collection, suppress console error
      return { isManagement: false };
    }
    // Handle other errors normally
    throw error;
  }
};
