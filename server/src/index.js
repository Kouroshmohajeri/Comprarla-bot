import express from "express";
import cors from "cors";
import dotenv from "dotenv";
// import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import { exec } from "child_process";
import telegramRoutes from "./routes/telegramRoutes.js";

dotenv.config();

const app = express();
// connectDB();

const corsOptions = {
  origin: "https://master--comprarlabot.netlify.app",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
app.use("/api/products", productRoutes);
app.use("/api/telegram", telegramRoutes);

exec("which google-chrome", (err, stdout) => {
  if (err) {
    console.error("Error finding Google Chrome:", err);
    return;
  }
  console.log("Google Chrome path:", stdout.trim());
});

exec("which chromium-browser", (err, stdout) => {
  if (err) {
    console.error("Error finding Chromium Browser:", err);
    return;
  }
  console.log("Chromium Browser path:", stdout.trim());
});

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
