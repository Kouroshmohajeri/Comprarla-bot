import mongoose from "mongoose";

const giftSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  points: { type: Number, required: true },
  createdById: { type: String, required: true },
  date: { type: Date, default: Date.now },
  expirationDate: { type: Date },
  clicks: { type: Number, default: 0 },
  type: { type: String, required: true },
  link: { type: String, default: null },
});

const Gift = mongoose.model("Gift", giftSchema);

export default Gift;
