import mongoose from "mongoose";
import TasksDone from "../models/TasksDone.js";
import Task from "../models/Task.js";

export const markTaskAsDone = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    // Convert userId and taskId to ObjectId if necessary
    const userObjectId = mongoose.Types.ObjectId(userId);
    const taskObjectId = mongoose.Types.ObjectId(taskId);

    // Validate that the task exists
    const task = await Task.findById(taskObjectId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task has already been marked as done by this user
    const existingTaskDone = await TasksDone.findOne({
      userId: userObjectId,
      taskId: taskObjectId,
    });
    if (existingTaskDone) {
      return res.status(400).json({ message: "Task already marked as done" });
    }

    // Create a new TasksDone document
    const taskDone = new TasksDone({
      userId: userObjectId,
      taskId: taskObjectId,
    });

    // Save the new taskDone entry and update the task
    await taskDone.save();
    task.isTaskDone = true;
    await task.save();

    res.status(201).json({ message: "Task marked as done", taskDone });
  } catch (error) {
    console.error("Error marking task as done:", error);
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks done by a specific user
export const getTasksDoneByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Check if ObjectId format is valid
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid userId format" });
    }

    const tasksDone = await TasksDone.find({
      userId: mongoose.Types.ObjectId(userId),
    }).populate("taskId");
    res.status(200).json(tasksDone);
  } catch (error) {
    console.error("Error fetching tasks done by user:", error);
    res.status(500).json({ error: error.message });
  }
};
