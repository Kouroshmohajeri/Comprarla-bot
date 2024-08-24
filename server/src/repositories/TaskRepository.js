import Task from "../models/Task.js";

class TaskRepository {
  async createTask(taskData) {
    const task = new Task(taskData);
    return await task.save();
  }

  async findTaskById(taskId) {
    return await Task.findById(taskId);
  }

  async getAllTasks() {
    return await Task.find();
  }

  async updateTask(taskId, updateData) {
    return await Task.findByIdAndUpdate(taskId, updateData, { new: true });
  }

  async deleteTask(taskId) {
    return await Task.findByIdAndDelete(taskId);
  }

  async findTasksByUserId(userId) {
    return await Task.find({ userId });
  }
}

export default new TaskRepository();
