import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  username: { type: String },
  firstName: { type: String },
  lastName: { type: String },
  points: { type: Number, default: 0 },
  dateJoined: { type: Date, default: Date.now },
  invitations: [{ type: String }], // Array of invited user IDs
  invitationCode: { type: String, unique: true }, // Unique invitation code
  invitedBy: { type: String }, // ID of the user who invited this user
  tasksDone: { type: Number, default: 0 },
  isOG: { type: Boolean, default: false },
  profilePhotoUrl: { type: String },
});

const User = mongoose.model("User", userSchema);

export default User;
