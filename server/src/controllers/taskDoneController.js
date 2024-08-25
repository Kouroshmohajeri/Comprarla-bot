import TasksDone from "../models/TasksDone.js";
import Task from "../models/Task.js";

export const markTaskAsDone = async (req, res) => {
  try {
    const { userId, taskId } = req.body;

    // Validate that the task exists
    const taskObjectId = mongoose.Types.ObjectId(taskId); // Convert taskId to ObjectId
    const task = await Task.findById(taskObjectId);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Check if the task has already been marked as done by this user
    const existingTaskDone = await TasksDone.findOne({
      userId: userId,
      taskId: taskObjectId,
    });
    if (existingTaskDone) {
      return res.status(400).json({ message: "Task already marked as done" });
    }

    // Create a new TasksDone document
    const taskDone = new TasksDone({
      userId: userId,
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

export const getTasksDoneByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const tasksDone = await TasksDone.find({
      userId: userId,
    }).populate("taskId");
    res.status(200).json(tasksDone);
  } catch (error) {
    console.error("Error fetching tasks done by user:", error);
    res.status(500).json({ error: error.message });
  }
};
