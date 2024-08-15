import React from "react";
import Image from "next/image";
import styles from "./header.module.css";

const Header = () => {
  return (
    <div className={styles.header}>
      <Image
        src="/logo/comprarlaLogo.png" // Correct path for images in public directory
        alt="Comprarla Logo"
        width={300} // You can adjust the width as needed
        height={100} // Adjust the height as needed
        className={styles.logo}
      />
    </div>
  );
};

export default Header;
