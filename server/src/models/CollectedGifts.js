import mongoose from "mongoose";

const collectedGiftsSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  giftId: { type: mongoose.Schema.Types.ObjectId, ref: "Gift", required: true },
  quantity: { type: Number, required: true },
  dateCollected: { type: Date, default: Date.now },
});

const CollectedGifts = mongoose.model("CollectedGifts", collectedGiftsSchema);

export default CollectedGifts;
