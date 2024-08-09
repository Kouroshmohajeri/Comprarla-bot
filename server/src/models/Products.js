import mongoose from "mongoose";

const productSchema = mongoose.Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  images: { type: [String], required: true },
  price: { type: Number, required: true },
});

const Product = mongoose.model("Product", productSchema);

export default Product;
