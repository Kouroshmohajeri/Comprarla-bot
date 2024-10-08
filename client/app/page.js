"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header/header.js";
import BottomMenu from "@/components/BottomMenu/BottomMenu.js";
import ParticlesBackground from "@/components/ParticlesBackground/ParticlesBackground.js";
import styles from "./page.module.css";
import Converter from "@/components/Converter/Converter.js";
import BrandsDisplay from "@/components/BrandsDisplay/BrandsDisplay.js";
import LoadingScreen from "@/components/LoadingScreen/LoadingScreen.js"; // Import the LoadingScreen component
import UserProfile from "@/components/UserProfile/UserProfile";
import Tasks from "@/components/Tasks/Tasks";
import Specials from "@/components/Specials/Specials";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState(0); // Use index 0 as the default page
  const [loading, setLoading] = useState(true);
  const [contentLoaded, setContentLoaded] = useState(false);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.Telegram &&
      window.Telegram.WebApp
    ) {
      const webApp = window.Telegram.WebApp;
      webApp.expand();
      webApp.ready();
      document.body.style.backgroundColor = "#f0f0f0";
    }
  }, []);

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  const handleLoaded = () => {
    setLoading(false);
    setTimeout(() => setContentLoaded(true), 100); // Small delay to allow content to appear after loading screen
  };

  return (
    <div className={styles.container}>
      {loading ? (
        <LoadingScreen onLoaded={handleLoaded} />
      ) : (
        <div
          className={`${styles.mainContent} ${
            contentLoaded ? styles.fadeIn : ""
          }`}
        >
          <ParticlesBackground id="particles" />
          <Header />
          {selectedPage === 0 && <Converter />}
          {selectedPage === 1 && <BrandsDisplay />}
          {selectedPage === 2 && <UserProfile />}
          {selectedPage === 3 && <Tasks />}
          {selectedPage === 4 && <Specials />}
          {/* You can add more conditions here for other pages */}
          <BottomMenu onPageChange={handlePageChange} />
        </div>
      )}
    </div>
  );
}
