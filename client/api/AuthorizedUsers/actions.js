import API from "../server"; // Assuming this is your configured axios instance

// Add a new authorized user
export const addAuthorizedUser = async (userId, promotedBy) => {
  try {
    const response = await API.post("/authorized-users", {
      userId,
      promotedBy,
    });
    return response.data;
  } catch (error) {
    console.error("Error adding authorized user:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Get a specific authorized user by userId
export const getAuthorizedUser = async (userId) => {
  try {
    const response = await API.get(`/authorized-users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching authorized user:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Get all authorized users
export const getAllAuthorizedUsers = async () => {
  try {
    const response = await API.get("/authorized-users");
    return response.data;
  } catch (error) {
    console.error("Error fetching all authorized users:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};

// Delete an authorized user by userId
export const deleteAuthorizedUser = async (userId) => {
  try {
    await API.delete(`/authorized-users/${userId}`);
  } catch (error) {
    console.error("Error deleting authorized user:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
};
