import { fetchEuroToToman } from "../services/currencyService.js";

export const getEuroToTomanRate = async (req, res) => {
  try {
    const rate = await fetchEuroToToman();
    res.status(200).json({ success: true, rate });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
