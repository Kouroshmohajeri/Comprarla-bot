// controllers/TaskController.js
import TaskRepository from "../repositories/TaskRepository.js";
import UserRepository from "../repositories/UserRepository.js";
import TasksDoneRepository from "../repositories/tasksDoneRepository.js"; // Import TasksDone repository

class TaskController {
  async createTask(req, res) {
    try {
      const task = await TaskRepository.createTask(req.body);
      res.status(201).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error creating task", error });
    }
  }

  async getTask(req, res) {
    const { id } = req.params;
    try {
      const task = await TaskRepository.findTaskById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });
      res.status(200).json(task);
    } catch (error) {
      res.status(500).json({ message: "Error fetching task", error });
    }
  }

  async completeTask(req, res) {
    const { id } = req.params;
    const { userId } = req.body;

    try {
      const task = await TaskRepository.findTaskById(id);
      if (!task) return res.status(404).json({ message: "Task not found" });

      // Check if the task is still available
      if (task.availableTime < new Date()) {
        return res.status(400).json({ message: "Task is no longer available" });
      }

      // Check if the task has already been completed by the user
      const existingTaskDone = await TasksDoneRepository.findTaskDone({
        userId,
        taskId: id,
      });
      if (existingTaskDone) {
        return res.status(400).json({ message: "Task already completed" });
      }

      // Update task status to completed
      task.isTaskDone = true;
      await TaskRepository.updateTask(id, task);

      // Create a record in the TasksDone collection
      await TasksDoneRepository.createTaskDone({ userId, taskId: id });

      // Update user points and tasksDone
      const user = await UserRepository.getUserById(userId);
      if (!user) return res.status(404).json({ message: "User not found" });

      user.tasksDone += 1;
      user.points += task.points;
      await user.save();

      res.status(200).json({ message: "Task completed successfully", user });
    } catch (error) {
      res.status(500).json({ message: "Error completing task", error });
    }
  }

  async getAllTasks(req, res) {
    try {
      const tasks = await TaskRepository.getAllTasks();
      res.status(200).json(tasks);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tasks", error });
    }
  }

  async updateTask(req, res) {
    const { id } = req.params;
    const updateData = req.body;

    try {
      const updatedTask = await TaskRepository.updateTask(id, updateData);
      if (!updatedTask)
        return res.status(404).json({ message: "Task not found" });
      res.status(200).json(updatedTask);
    } catch (error) {
      res.status(500).json({ message: "Error updating task", error });
    }
  }

  async deleteTask(req, res) {
    const { id } = req.params;

    try {
      const deletedTask = await TaskRepository.deleteTask(id);
      if (!deletedTask)
        return res.status(404).json({ message: "Task not found" });
      res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting task", error });
    }
  }
}

export default new TaskController();
