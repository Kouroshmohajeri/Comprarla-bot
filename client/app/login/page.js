"use client";
import React, { useState } from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import axios from "axios";
import styles from "./login.module.css";

const TELEGRAM_LOGIN_URL = "https://t.me/comprarlabot?start=connect_telegram";

const Page = () => {
  const [otp, setOtp] = useState("");
  const [userId, setUserId] = useState(""); // This could be set based on user session or Telegram login info
  const [loginMessage, setLoginMessage] = useState("");

  const handleRequestOtp = async () => {
    try {
      const response = await axios.post("/api/otp/generate-otp", { userId });
      alert(`Your OTP is: ${response.data.otpCode}`);
    } catch (error) {
      console.error("Error generating OTP:", error);
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post("/api/otp/validate-otp", {
        userId,
        otp,
      });
      setLoginMessage(response.data.message);
    } catch (error) {
      console.error("Error validating OTP:", error);
      setLoginMessage("Incorrect OTP.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.glassBox}>
        <h1 className={styles.heading}>Login</h1>
        <a href={TELEGRAM_LOGIN_URL} target="_blank" rel="noopener noreferrer">
          <button className={styles.connectButton} onClick={handleRequestOtp}>
            <TelegramIcon className={styles.icon} />
            Connect with Telegram
          </button>
        </a>
        <div className={styles.otpSection}>
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className={styles.otpInput}
          />
          <button onClick={handleLogin} className={styles.loginButton}>
            Login
          </button>
        </div>
        {loginMessage && (
          <div className={styles.loginMessage}>{loginMessage}</div>
        )}
        <div className={styles.footerText}>®ComprarLa</div>
      </div>
    </main>
  );
};

export default Page;
