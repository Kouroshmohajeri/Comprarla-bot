"use client";

import { useEffect, useState } from "react";
import { fetchProductData } from "../api/products/actions.js";
import styles from "./page.module.css";

export default function Home() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if Telegram Web App is loaded and accessible
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const webApp = window.Telegram.WebApp;

      // Example usage: set the background color of the header
      webApp.ready();
      document.body.style.backgroundColor = "#f0f0f0"; // Example modification
    }
  }, []);

  const handleFetchProductData = async () => {
    try {
      setError("");
      setError(url);
      const data = await fetchProductData(url);
      setProduct(data);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setError("");
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat().format(number);
  };

  const getAdditionalPrice = (price) => {
    if (price > 0 && price <= 100) return 25;
    if (price >= 101 && price <= 200) return 35;
    if (price >= 201 && price <= 500) return 45;
    if (price >= 510) return 50;
    return 0;
  };

  return (
    <div className={styles.container}>
      <input
        type="text"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Enter product URL"
        className={styles.input}
      />
      <button onClick={handleFetchProductData} className={styles.button}>
        Fetch Product Data
      </button>

      {error && <p className={styles.error}>{error}</p>}

      {product && (
        <div className={styles.product}>
          <h2>{product["Product Name"]}</h2>
          <div className={styles.images}>
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt="Product Image"
                className={styles.image}
              />
            ))}
          </div>
          <p>Price (USD): ${product["Price (USD)"]}</p>
          <p>
            Converted Price (Toman):{" "}
            {formatNumber(product["Converted Price (Toman)"].toFixed(0))} Toman
          </p>
        </div>
      )}
    </div>
  );
}
