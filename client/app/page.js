"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header/header.js";
import BottomMenu from "@/components/BottomMenu/BottomMenu.js";
import styles from "./page.module.css";
import Converter from "@/components/Converter/Converter.js";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState("converter"); // Default to converter page

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

  // Function to handle page selection from the BottomMenu
  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className={styles.container}>
      <Header /> {/* Render the Header component here */}
      {selectedPage === "converter" && <Converter />}{" "}
      {/* Render the Converter component based on selectedPage */}
      <BottomMenu onPageChange={handlePageChange} />{" "}
      {/* Pass page change handler to BottomMenu */}
    </div>
  );
}
