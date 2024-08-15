import React, { useState } from "react";
import styles from "./BottomMenu.module.css";
import EuroIcon from "@mui/icons-material/Euro";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const BottomMenu = ({ onPageChange }) => {
  const [selected, setSelected] = useState("converter");

  const handleClick = (page) => {
    setSelected(page);
    onPageChange(page);
  };

  return (
    <div className={styles.bottomMenu}>
      <div className={styles.menuItems}>
        <a
          href="#euro"
          className={styles.menuItem}
          onClick={() => handleClick("converter")}
        >
          <EuroIcon className={styles.icon} />
          {selected === "converter" && <div className={styles.indicator} />}
        </a>
        <a
          href="#store"
          className={styles.menuItem}
          onClick={() => handleClick("store")}
        >
          <StorefrontIcon className={styles.icon} />
          {selected === "store" && <div className={styles.indicator} />}
        </a>
        <a
          href="#list"
          className={styles.menuItem}
          onClick={() => handleClick("list")}
        >
          <FormatListBulletedIcon className={styles.icon} />
          {selected === "list" && <div className={styles.indicator} />}
        </a>
        <a
          href="#chart"
          className={styles.menuItem}
          onClick={() => handleClick("chart")}
        >
          <ShowChartIcon className={styles.icon} />
          {selected === "chart" && <div className={styles.indicator} />}
        </a>
        <a
          href="#offer"
          className={styles.menuItem}
          onClick={() => handleClick("offer")}
        >
          <LocalOfferIcon className={styles.icon} />
          {selected === "offer" && <div className={styles.indicator} />}
        </a>
      </div>
      <hr className={styles.divider} />
      <p className={styles.footer}>Designed by Kourosh Mohajeri</p>
    </div>
  );
};

export default BottomMenu;
