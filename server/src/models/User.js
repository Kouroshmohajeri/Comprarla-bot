import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String },
  points: { type: Number, default: 0 },
  dateJoined: { type: Date, default: Date.now },
  invitations: [{ type: String }], // Array of invited user IDs
  tasksDone: { type: Number, default: 0 },
  isOG: { type: Boolean, default: false },
});

const User = mongoose.model("User", userSchema);

export default User;
