"use client";
import { useEffect, useState } from "react";
import Header from "@/components/header/header.js";
import BottomMenu from "@/components/BottomMenu/BottomMenu.js";
import ParticlesBackground from "@/components/ParticlesBackground/ParticlesBackground.js";
import styles from "./page.module.css";
import Converter from "@/components/Converter/Converter.js";

export default function Home() {
  const [selectedPage, setSelectedPage] = useState("converter");

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

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className={styles.container}>
      <ParticlesBackground id="particles" />{" "}
      {/* Add the particles background */}
      <Header />
      {selectedPage === "converter" && <Converter />}
      <BottomMenu onPageChange={handlePageChange} />
    </div>
  );
}
