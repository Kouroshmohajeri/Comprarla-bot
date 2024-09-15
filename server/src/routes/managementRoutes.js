import express from "express";
import {
  addManagementEntry,
  getManagementEntry,
  getAllManagementEntries,
  deleteManagementEntry,
} from "../controllers/managementController.js";

const router = express.Router();

// Add a new management entry
router.post("/management", addManagementEntry);

// Get a management entry by userId
router.get("/management/:userId", getManagementEntry);

// Get all management entries
router.get("/management", getAllManagementEntries);

// Delete a management entry by userId
router.delete("/management/:userId", deleteManagementEntry);

export default router;
