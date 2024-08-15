"use client";
import { useEffect, useState } from "react";
import { fetchProductData } from "../api/products/actions.js";
import styles from "./page.module.css";
import Header from "@/components/header/header.js"; // Use PascalCase for the import

export default function Home() {
  const [url, setUrl] = useState("");
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const webApp = window.Telegram.WebApp;
      webApp.ready();
      document.body.style.backgroundColor = "#f0f0f0";
    }
  }, []);

  const handleFetchProductData = async () => {
    try {
      setError("");
      const data = await fetchProductData(url);
      setProduct(data);
    } catch (error) {
      console.error("Error fetching product data:", error);
      setError("Error fetching product data");
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
      <Header /> {/* Render the Header component here */}
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
      {url && !product ? <p>Loading...</p> : null}
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
