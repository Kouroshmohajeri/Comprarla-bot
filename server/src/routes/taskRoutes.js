import express from "express";
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/TaskController.js";

const router = express.Router();

// Create a new task
router.post("/tasks", createTask);

// Get all tasks
router.get("/tasks", getAllTasks);

// Get a single task by ID
router.get("/tasks/:id", getTaskById);

// Update a task by ID
router.put("/tasks/:id", updateTask);

// Delete a task by ID
router.delete("/tasks/:id", deleteTask);

export default router;
