// routes/tasksRoute.js
import express from "express";
import TaskController from "../controllers/TaskController.js";

const router = express.Router();

// POST request to create a new task
router.post("/create", TaskController.createTask);

// GET request to fetch task details by ID
router.get("/:id", TaskController.getTask);

// POST request to complete a task
router.post("/complete/:id", TaskController.completeTask);

// GET request to fetch all tasks
router.get("/", TaskController.getAllTasks);

// PUT request to update task details
router.put("/:id", TaskController.updateTask);

// DELETE request to delete a task by ID
router.delete("/:id", TaskController.deleteTask);

export default router;
