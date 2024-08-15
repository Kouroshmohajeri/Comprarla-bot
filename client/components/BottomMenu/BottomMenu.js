import React from "react";
import styles from "./BottomMenu.module.css";
import EuroIcon from "@mui/icons-material/Euro";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const BottomMenu = ({ onPageChange }) => {
  return (
    <div className={styles.bottomMenu}>
      <div className={styles.menuItems}>
        <a
          href="#euro"
          className={styles.menuItem}
          onClick={() => onPageChange("converter")}
        >
          <EuroIcon className={styles.icon} />
        </a>
        <a
          href="#store"
          className={styles.menuItem}
          onClick={() => onPageChange("store")}
        >
          <StorefrontIcon className={styles.icon} />
        </a>
        <a
          href="#list"
          className={styles.menuItem}
          onClick={() => onPageChange("list")}
        >
          <FormatListBulletedIcon className={styles.icon} />
        </a>
        <a
          href="#chart"
          className={styles.menuItem}
          onClick={() => onPageChange("chart")}
        >
          <ShowChartIcon className={styles.icon} />
        </a>
        <a
          href="#offer"
          className={styles.menuItem}
          onClick={() => onPageChange("offer")}
        >
          <LocalOfferIcon className={styles.icon} />
        </a>
      </div>
      <hr className={styles.divider} />
      <p className={styles.footer}>Designed by Kourosh Mohajeri</p>
    </div>
  );
};

export default BottomMenu;
