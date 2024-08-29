import mongoose from "mongoose";

const OtpSchema = new mongoose.Schema({
  userId: {
    type: Number,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: "5m", // Optional: Automatically delete the document after 5 minutes
  },
});

const Otp = mongoose.model("Otp", OtpSchema);

export default Otp;
