import Gift from "../models/Gift";

// Create a new gift
export const createGift = async (req, res) => {
  try {
    const {
      title,
      description,
      points,
      createdById,
      date,
      expirationDate,
      clicks,
      type,
    } = req.body;
    const newGift = new Gift({
      title,
      description,
      points,
      createdById,
      date,
      expirationDate,
      clicks,
      type,
    });
    await newGift.save();
    res.status(201).json(newGift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all gifts
export const getAllGifts = async (req, res) => {
  try {
    const gifts = await Gift.find();
    res.status(200).json(gifts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a gift by ID
export const getGiftById = async (req, res) => {
  try {
    const gift = await Gift.findById(req.params.id);
    if (!gift) return res.status(404).json({ message: "Gift not found" });
    res.status(200).json(gift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a gift by ID
export const updateGiftById = async (req, res) => {
  try {
    const updatedGift = await Gift.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedGift)
      return res.status(404).json({ message: "Gift not found" });
    res.status(200).json(updatedGift);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a gift by ID
export const deleteGiftById = async (req, res) => {
  try {
    const deletedGift = await Gift.findByIdAndDelete(req.params.id);
    if (!deletedGift)
      return res.status(404).json({ message: "Gift not found" });
    res.status(200).json({ message: "Gift deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
