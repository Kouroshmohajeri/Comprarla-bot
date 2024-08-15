"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header/header.js";
import BottomMenu from "@/components/BottomMenu/BottomMenu.js";
import ParticlesBackground from "@/components/ParticlesBackground/ParticlesBackground.js";
import styles from "./page.module.css";
import Converter from "@/components/Converter/Converter.js";
import BrandsDisplay from "@/components/BrandsDisplay/BrandsDisplay.js";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen.js"; // Import the LoadingScreen component

export default function Home() {
  const [selectedPage, setSelectedPage] = useState(0); // Use index 0 as the default page
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Simulate loading time (e.g., for data fetching)
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Adjust the duration as needed

    return () => clearTimeout(timer);
  }, []);

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <LoadingScreen />
      ) : (
        <>
          <ParticlesBackground id="particles" />
          <Header />
          {selectedPage === 0 && <Converter />} {/* Index 0: Converter */}
          {selectedPage === 1 && <BrandsDisplay />} {/* Index 1: Brands */}
          {/* You can add more conditions here for other pages */}
          <BottomMenu onPageChange={handlePageChange} />
        </>
      )}
    </div>
  );
}
