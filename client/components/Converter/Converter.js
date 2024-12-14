import React, { useState, useEffect } from "react";
import {
  TextField,
  Typography,
  Box,
  MenuItem,
  Select,
  ListSubheader,
} from "@mui/material";
import { convertPrice } from "@/lib/converter";
import { getEuroToTomanRate } from "@/api/conversion/actions.js";
import styles from "./Converter.module.css";
import categories from "@/lib/objects/categories";
import createCache from "@emotion/cache";
import rtlPlugin from "stylis-plugin-rtl";
import { prefixer } from "stylis";
import { CacheProvider } from "@emotion/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";

// Create a cache with RTL support
const cacheRtl = createCache({
  key: "muirtl",
  stylisPlugins: [prefixer, rtlPlugin],
});

// Create a theme with RTL direction
const theme = createTheme({
  direction: "rtl",
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInputBase-input": {
            color: "white",
            textAlign: "right", // Ensure text aligns right
          },
          "& .MuiInputBase-input::placeholder": {
            color: "white",
            opacity: 1,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          color: "white",
          textAlign: "center", // Ensure the select text aligns right
        },
        icon: {
          color: "white",
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          backgroundColor: "#333333",
          color: "white",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          textAlign: "right",
          justifyContent: "end",
          display: "flex",
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: "white",
        },
      },
    },
  },
});

const Converter = () => {
  const [price, setPrice] = useState("");
  const [convertedPrice, setConvertedPrice] = useState("");
  const [fixedPrice, setFixedPrice] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [shippingPrice, setShippingPrice] = useState(0);
  const [isCategorySelected, setIsCategorySelected] = useState(false);

  useEffect(() => {
    const fetchFixedPrice = async () => {
      try {
        const rate = await getEuroToTomanRate();
        console.log(rate);
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

    if (fixedPrice && inputValue !== "" && shippingPrice >= 0) {
      const finalPrice = convertPrice(
        parseFloat(inputValue),
        fixedPrice,
        shippingPrice
      );
      setConvertedPrice(formatNumber(Math.round(finalPrice)));
    } else {
      setConvertedPrice(""); // Clear the converted price when input is empty
    }
  };

  const handleSubcategoryChange = (event) => {
    const selectedKey = parseInt(event.target.value, 10);

    for (const [category, subcategories] of Object.entries(categories)) {
      const subcategory = subcategories.find(
        (item) => item.key === selectedKey
      );
      if (subcategory) {
        setSelectedSubcategory(subcategory.key); // Store key instead of name
        setShippingPrice(subcategory.value || 0);
        setIsCategorySelected(true);
        break;
      }
    }
  };

  const formatNumber = (number) => {
    return number.toLocaleString();
  };

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Box
          className={styles.container}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            padding: "20px",
          }}
        >
          <Typography
            variant="h4"
            className={`${styles.title} ${styles.font}`}
            sx={{ textAlign: "center", marginBottom: "2%" }}
          >
            تبدیل قیمت
          </Typography>

          {/* Grouped Dropdown */}
          <Select
            value={selectedSubcategory}
            onChange={handleSubcategoryChange}
            displayEmpty
            fullWidth
            className={styles.font}
            sx={{
              textAlign: "center",
              marginBottom: "16px",
              color: "white",
              width: "100%",
              ".MuiOutlinedInput-notchedOutline": { borderColor: "white" },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: "white",
              },
            }}
          >
            <MenuItem value="" disabled sx={{ textAlign: "center" }}>
              انتخاب دسته‌ بندی
            </MenuItem>
            {Object.entries(categories).map(([categoryName, subcategories]) => [
              // If the category has a subcategory with value null, treat it as the category title
              subcategories
                .filter((subcategory) => subcategory.value === null)
                .map((subcategory) => (
                  <ListSubheader
                    key={subcategory.key}
                    className={styles.font}
                    sx={{
                      textAlign: "center",
                      backgroundColor: "#333",
                      color: "#ccc",
                      fontWeight: "bold",
                      fontSize: "16px",
                      lineHeight: "2",
                    }}
                  >
                    {subcategory.name} {/* This is the main category */}
                  </ListSubheader>
                )),
              ...subcategories
                .filter((subcategory) => subcategory.value !== null) // Exclude the category itself (value: null)
                .map((subcategory) => (
                  <MenuItem
                    key={subcategory.key}
                    value={subcategory.key}
                    className={styles.font}
                    sx={{ textAlign: "center" }}
                  >
                    {subcategory.name} {/* These are the subcategories */}
                  </MenuItem>
                )),
            ])}
          </Select>

          {/* Category text fade out and price text fade in */}
          <Typography
            variant="h6"
            className={styles.font}
            sx={{
              textAlign: "center",
              display: isCategorySelected ? "none" : "block",
              transition: "opacity 0.5s ease-out",
              fontSize: "0.9rem",
            }}
          >
            دسته بندی را انتخاب کنید
          </Typography>

          {/* Input for price */}
          {isCategorySelected && (
            <TextField
              label={
                fixedPrice
                  ? `قیمت را وارد کنید... (€ یورو)`
                  : "...در حال بارگذاری قیمت"
              }
              type="number"
              value={price}
              onChange={handlePriceChange}
              fullWidth
              margin="normal"
              variant="outlined"
              className={styles.font}
              inputProps={{ step: "0.01" }}
              disabled={!selectedSubcategory}
              sx={{
                "& .MuiInputBase-input": {
                  color: "white",
                  textAlign: "center",
                },
                "& .MuiInputLabel-root": { color: "white" },
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "white" },
                  "&:hover fieldset": { borderColor: "white" },
                  "&.Mui-focused fieldset": { borderColor: "white" },
                },
              }}
            />
          )}

          {/* Converted Price Display */}
          <Typography
            variant="h6"
            className={styles.font}
            sx={{
              textAlign: "center",
              opacity: convertedPrice ? 1 : 0,
              transition: "opacity 0.5s ease-in-out",
              fontSize: "1.2rem",
            }}
          >
            {convertedPrice ? `${convertedPrice} تومان` : null}
          </Typography>

          {/* Show "قیمت را وارد کنید" when no converted price */}
          <Typography
            variant="h6"
            className={styles.font}
            sx={{
              textAlign: "center",
              display: isCategorySelected && !convertedPrice ? "block" : "none",
              transition: "opacity 0.5s ease-in",
              fontSize: "0.9rem",
            }}
          >
            قیمت را وارد کنید
          </Typography>
          {convertedPrice && (
            <Typography
              variant="body1"
              sx={{
                textAlign: "center",
                fontFamily: "Arial, sans-serif",
              }}
            >
              با احتساب هزینه باربری
            </Typography>
          )}
        </Box>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default Converter;
