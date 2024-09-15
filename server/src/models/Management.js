import mongoose from "mongoose";

const managementSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  promotedBy: { type: String, required: true },
  dateOfPromotion: { type: Date, default: Date.now },
});

const Management = mongoose.model("Management", managementSchema);
export default Management;
