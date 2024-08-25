import express from "express";
import {
  markTaskAsDone,
  getTasksDoneByUser,
} from "../controllers/taskDoneController.js";

const router = express.Router();

// Mark a task as done
router.post("/tasks-done", markTaskAsDone);

// Get all tasks done by a specific user
router.get("/tasks-done/:userId", getTasksDoneByUser);

export default router;
