import React from "react";
import styles from "./header.module.css";
import Image from "next/image";

const Header = () => {
  return (
    <div className={styles.header}>
      <Image
        src="/logo/comprarlaLogo.svg"
        alt="Comprarla Logo"
        width={300}
        height={100}
      />
    </div>
  );
};

export default Header;
