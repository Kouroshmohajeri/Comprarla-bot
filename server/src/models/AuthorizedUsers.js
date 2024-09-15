import mongoose from "mongoose";

const authorizedUserSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true, ref: "User" },
  promotedBy: { type: String, required: true, ref: "User" },
  dateOfPromotion: { type: Date, default: Date.now },
});

const AuthorizedUser = mongoose.model("AuthorizedUser", authorizedUserSchema);
export default AuthorizedUser;
