import TasksDone from "../models/TasksDone.js";

class TasksDoneRepository {
  async createTaskDone({ userId, taskId }) {
    const taskDone = new TasksDone({ userId, taskId });
    return await taskDone.save();
  }

  async findTaskDone({ userId, taskId }) {
    return await TasksDone.findOne({ userId, taskId });
  }
}

export default new TasksDoneRepository();
