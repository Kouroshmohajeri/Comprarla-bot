import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

// Import routes
import productRoutes from "./routes/productRoutes.js";
import telegramRoutes from "./routes/telegramRoutes.js";

app.use("/api/products", productRoutes);
app.use("/api/telegram", telegramRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
