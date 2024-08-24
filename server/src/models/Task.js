import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  link: { type: String }, // Optional link for the task
  availableTime: { type: Date, required: true }, // When the task is available until
  userId: { type: String, required: true }, // User who created the task
  isTaskDone: { type: Boolean, default: false }, // Track if the task is completed
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
