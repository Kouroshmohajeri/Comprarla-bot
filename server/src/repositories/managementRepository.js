import Management from "../models/Management.js";

// Add a new management entry
export const addManagement = async (userId, promotedBy) => {
  const management = new Management({ userId, promotedBy });
  return await management.save();
};

// Get a management entry by userId
export const getManagementByUserId = async (userId) => {
  return await Management.findOne({ userId });
};

// Get all management entries
export const getAllManagement = async () => {
  return await Management.find();
};

// Delete a management entry by userId
export const deleteManagementByUserId = async (userId) => {
  return await Management.deleteOne({ userId });
};
