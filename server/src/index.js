import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import conversionRoutes from "./routes/conversionRoutes.js";

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
app.use("/api/conversion", conversionRoutes);

const PORT = process.env.PORT || 8443;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
