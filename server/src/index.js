import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import conversionRoutes from "./routes/conversionRoutes.js";
import otpRoutes from "./routes/otpRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskDoneRoutes from "./routes/tasksDoneRoutes.js";
import protectedRoutes from "./routes/protectedRoutes.js";

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
app.use("/api/otp", otpRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/tasks-done", taskDoneRoutes);
app.use("/api", protectedRoutes);

const PORT = process.env.PORT || 8443;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
