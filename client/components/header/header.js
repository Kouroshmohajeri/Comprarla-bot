import React from "react";
import Image from "next/image";
import styles from "./header.module.css";
import logo from "@/public/logo/comprarlaLogo.png";

const Header = () => {
  return (
    <div className={styles.header}>
      <Image src={logo} alt="Comprarla Logo" className={styles.logo} />
    </div>
  );
};

export default Header;
