import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import telegramRoutes from "./routes/telegramRoutes.js";

dotenv.config();

const app = express();
// connectDB();

const corsOptions = {
  origin: "https://23.227.167.112:3000/",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
app.use("/api/products", productRoutes);
app.use("/api/telegram", telegramRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
