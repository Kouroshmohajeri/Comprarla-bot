import express from "express";
import { getProductData } from "../controllers/productController.js";
import { getEuroToToman } from "../controllers/currencyController.js";

const router = express.Router();

// Existing routes
router.post("/get", getProductData);

// New route for currency conversion
router.get("/currency/euro-to-toman", getEuroToToman);

export default router;
