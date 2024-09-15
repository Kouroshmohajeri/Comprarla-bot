import express from "express";
import {
  addManagementEntry,
  getManagementEntry,
  getAllManagementEntries,
  deleteManagementEntry,
} from "../controllers/managementController.js";

const router = express.Router();

// Add a new management entry
router.post("/add", addManagementEntry);

// Get a management entry by userId
router.get("/:userId", getManagementEntry);

// Get all management entries
router.get("/", getAllManagementEntries);

// Delete a management entry by userId
router.delete("/:userId", deleteManagementEntry);

export default router;
