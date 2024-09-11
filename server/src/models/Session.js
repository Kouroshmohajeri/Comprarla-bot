import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sessionToken: { type: String, required: true },
  expiresAt: { type: Date, required: true }, // Expiration time for the session
  createdAt: { type: Date, default: Date.now },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
