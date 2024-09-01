"use client";
import React from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import styles from "./login.module.css";

const TELEGRAM_BOT_URL = "https://t.me/comprarlaAuthBot?start=auth"; // Updated URL with /start command

const Login = () => {
  return (
    <main className={styles.container}>
      <div className={styles.glassBox}>
        <h1 className={styles.heading}>Login</h1>
        <a
          href={TELEGRAM_BOT_URL}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          <button className={styles.connectButton}>
            <TelegramIcon className={styles.icon} />
            Connect with Telegram
          </button>
        </a>
        <div className={styles.footerText}>®ComprarLa</div>
      </div>
    </main>
  );
};

export default Login;
