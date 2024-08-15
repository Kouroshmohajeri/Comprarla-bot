import React from "react";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <img
        src="/logo/comprarlaLogo.svg" // Path to the SVG file
        alt="Comprarla Logo"
        className={styles.logo}
      />
    </div>
  );
};

export default Header;
