import { fetchEuroToToman } from "../services/currencyService.js";

const getEuroToToman = async (req, res) => {
  try {
    const rate = await fetchEuroToToman();
    res.json({ euroToToman: rate });
  } catch (error) {
    console.error("Error fetching Euro to Toman conversion rate:", error);
    res.status(500).json({ message: "Error fetching conversion rate" });
  }
};

export { getEuroToToman };
