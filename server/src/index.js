import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
dotenv.config();

const app = express();
connectDB();

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
app.use(express.json());

// Import routes
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
