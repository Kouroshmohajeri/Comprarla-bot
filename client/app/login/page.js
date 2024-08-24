import React from "react";
import TelegramIcon from "@mui/icons-material/Telegram";
import styles from "./login.module.css";
import Header from "@/components/header/header";

// Replace this with the actual URL where your Telegram bot is set up to handle login
const TELEGRAM_LOGIN_URL = "https://t.me/comprarlabot?start=connect_telegram";

const Page = () => {
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
        <div className={styles.footerText}>®ComprarLa</div>
      </div>
    </main>
  );
};

export default Page;
