import React, { useState, useEffect } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { convertPrice } from "@/lib/converter";
import { getEuroToTomanRate } from "@/api/conversion/actions.js";
import styles from "./Converter.module.css";

const Converter = () => {
  const [price, setPrice] = useState("");
  const [convertedPrice, setConvertedPrice] = useState("");
  const [fixedPrice, setFixedPrice] = useState(null);

  useEffect(() => {
    const fetchFixedPrice = async () => {
      try {
        const rate = await getEuroToTomanRate();
        setFixedPrice(rate);
      } catch (error) {
        console.error("Error fetching fixed price:", error);
      }
    };

    fetchFixedPrice();
  }, []);

  const handlePriceChange = (event) => {
    const inputValue = event.target.value;
    setPrice(inputValue);

    if (fixedPrice && inputValue !== "") {
      const finalPrice = convertPrice(parseFloat(inputValue), fixedPrice);
      setConvertedPrice(formatNumber(Math.round(finalPrice)));
    } else {
      setConvertedPrice(""); // Clear the converted price when input is empty
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      event.target.blur();
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4">Price Converter</Typography>
      <TextField
        label="Enter Price (euro €)"
        type="number"
        value={price}
        onChange={handlePriceChange}
        onKeyPress={handleKeyPress}
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{ step: "0.01" }}
        sx={{
          "& .MuiInputBase-input": { color: "white" },
          "& .MuiInputLabel-root": { color: "white" },
          "& .MuiOutlinedInput-root": {
            "& fieldset": { borderColor: "white" },
            "&:hover fieldset": { borderColor: "white" },
            "&.Mui-focused fieldset": { borderColor: "white" },
          },
          "& .MuiInputBase-input::placeholder": { color: "white" },
        }}
      />
      <Typography variant="h6">
        {convertedPrice
          ? `${convertedPrice} Toman`
          : "Enter a price to convert"}
      </Typography>
      {convertedPrice && (
        <Typography
          variant="body1"
          sx={{
            marginTop: "8px",
            textAlign: "center", // Center the Farsi text
            fontFamily: "Arial, sans-serif", // Optional: Set a font that supports Farsi
          }}
        >
          با احتساب هزینه باربری
        </Typography>
      )}
    </Box>
  );
};

export default Converter;
