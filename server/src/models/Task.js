import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  points: { type: Number, required: true },
  link: { type: String },
  availableTime: { type: Date, required: true },
  userId: { type: String, required: true },
  isTaskDone: { type: Boolean, default: false },
  icon: {
    type: String,
    enum: [
      "discord",
      "instagram",
      "channel",
      "youtube",
      "website",
      "twitter",
      "pinterest",
    ], // Only allow these values
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
