import express from "express";
import { handleUpdate } from "../controllers/telegramController.js";

const router = express.Router();

router.post("/webhook", handleUpdate);

export default router;
