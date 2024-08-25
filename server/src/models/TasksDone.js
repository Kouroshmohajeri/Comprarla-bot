import mongoose from "mongoose";

const tasksDoneSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId, ref: "Task", required: true },
  dateCompleted: { type: Date, default: Date.now, required: true },
});

const TasksDone = mongoose.model("TasksDone", tasksDoneSchema);

export default TasksDone;
