"use client";
import React, { useState, useEffect } from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import styles from "./login.module.css";
import { useRouter } from "next/navigation";

const Page = () => {
  const [userId, setUserId] = useState(""); // Generate or fetch userId here
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Retrieve userId from query parameters
    const queryUserId = new URLSearchParams(window.location.search).get(
      "userId"
    );
    if (queryUserId) {
      setUserId(queryUserId);
      setIsOtpSent(true); // Show OTP input if userId is present
    }
  }, []);

  const TELEGRAM_LOGIN_URL = `https://t.me/comprarlabot?start=${userId}`;

  const handleOtpSubmit = async () => {
    try {
      // Verify OTP with backend
      await verifyOtp(userId, otp);
      alert("Logged In");
      router.push("/"); // Redirect to the home page or another route upon successful login
    } catch (err) {
      setError("Incorrect OTP. Please try again.");
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.glassBox}>
        <h1 className={styles.heading}>Login</h1>
        <a href={TELEGRAM_LOGIN_URL} target="_blank" rel="noopener noreferrer">
          <button className={styles.connectButton}>
            <TelegramIcon className={styles.icon} />
            Connect with Telegram
          </button>
        </a>
        {isOtpSent && (
          <div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button onClick={handleOtpSubmit}>Submit OTP</button>
          </div>
        )}
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.footerText}>®ComprarLa</div>
      </div>
    </main>
  );
};

export default Page;
