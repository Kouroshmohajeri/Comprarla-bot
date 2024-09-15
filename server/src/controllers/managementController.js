import {
  addManagement,
  getManagementByUserId,
  getAllManagement,
  deleteManagementByUserId,
} from "../repositories/managementRepository.js";

// Controller to add a new management entry
export const addManagementEntry = async (req, res) => {
  const { userId, promotedBy } = req.body;
  try {
    const newManagement = await addManagement(userId, promotedBy);
    res.status(201).json(newManagement);
  } catch (error) {
    console.error("Error adding management entry:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not add management entry." });
  }
};

// Controller to get a management entry by userId
export const getManagementEntry = async (req, res) => {
  const { userId } = req.params;
  try {
    const management = await getManagementByUserId(userId);
    if (!management) {
      return res.status(404).json({ message: "Management entry not found." });
    }
    res.status(200).json(management);
  } catch (error) {
    console.error("Error fetching management entry:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch management entry." });
  }
};

// Controller to get all management entries
export const getAllManagementEntries = async (req, res) => {
  try {
    const managementEntries = await getAllManagement();
    res.status(200).json(managementEntries);
  } catch (error) {
    console.error("Error fetching management entries:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch management entries." });
  }
};

// Controller to delete a management entry by userId
export const deleteManagementEntry = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await deleteManagementByUserId(userId);
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Management entry not found." });
    }
    res.status(200).json({ message: "Management entry deleted successfully." });
  } catch (error) {
    console.error("Error deleting management entry:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not delete management entry." });
  }
};
