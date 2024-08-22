import React, { useState } from "react";
import { TextField, Typography, Box } from "@mui/material";
import { convertPrice } from "@/lib/converter";
import styles from "./Converter.module.css";

const Converter = () => {
  const [price, setPrice] = useState("");
  const [convertedPrice, setConvertedPrice] = useState("");

  const fixedPrice = 64740; // Example fixed price

  const handlePriceChange = (event) => {
    const inputValue = event.target.value;
    setPrice(inputValue);

    // Perform the conversion
    const finalPrice = convertPrice(parseFloat(inputValue), fixedPrice);

    // Round to the nearest whole number and format with commas
    setConvertedPrice(formatNumber(Math.round(finalPrice)));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      // If the user presses "Enter" or "Go", blur the input field
      event.target.blur();
    }
  };

  // Function to format numbers with commas
  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <Box className={styles.container}>
      <Typography variant="h4">Price Converter</Typography>
      <TextField
        label="Enter Price"
        type="number"
        value={price}
        onChange={handlePriceChange}
        onKeyPress={handleKeyPress} // Add the onKeyPress handler
        fullWidth
        margin="normal"
        variant="outlined"
        inputProps={{ step: "0.01" }}
        sx={{
          "& .MuiInputBase-input": {
            color: "white", // Text color
          },
          "& .MuiInputLabel-root": {
            color: "white", // Label color
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "white", // Border color
            },
            "&:hover fieldset": {
              borderColor: "white", // Border color on hover
            },
            "&.Mui-focused fieldset": {
              borderColor: "white", // Border color when focused
            },
          },
          "& .MuiInputBase-input::placeholder": {
            color: "white", // Placeholder color
          },
        }}
      />
      <Typography variant="h6">
        Converted Price: {convertedPrice} Toman The shipping price will be
        announced
      </Typography>
    </Box>
  );
};

export default Converter;
