// src/api/users/actions.js

import API from "../server.js";

// Function to get user details by user ID
export const getUserDetails = async (userId) => {
  try {
    const response = await API.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

// Function to an invitation code
export const generateInvitationCode = async (userId) => {
  try {
    const response = await API.post(`/users/generate-invitation/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error generating invitation code:", error);
    throw error;
  }
};

// Function to update user details (if needed in the future)
export const updateUserDetails = async (userId, userDetails) => {
  try {
    const response = await API.put(`/users/${userId}`, userDetails);
    return response.data;
  } catch (error) {
    console.error("Error updating user details:", error);
    throw error;
  }
};
