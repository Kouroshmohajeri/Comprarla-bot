import express from "express";
import { getEuroToTomanRate } from "../controllers/conversionController.js";

const router = express.Router();

router.get("/euro-to-toman", getEuroToTomanRate);

export default router;
