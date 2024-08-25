import TasksDone from "../models/TasksDone.js"; // Import the TasksDone model
import Task from "../models/Task.js"; // Import the Task model

// Mark a task as done
export const markTaskAsDone = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    const taskDone = new TasksDone({
      userId,
      taskId,
    });

    await taskDone.save();
    task.isTaskDone = true;
    await task.save();

    res.status(201).json({ message: "Task marked as done", taskDone });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all tasks done by a specific user
export const getTasksDoneByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const tasksDone = await TasksDone.find({ userId }).populate("taskId");

    res.status(200).json(tasksDone);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
