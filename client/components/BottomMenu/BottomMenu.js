import React from "react";
import styles from "./BottomMenu.module.css";
import EuroIcon from "@mui/icons-material/Euro";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import ShowChartIcon from "@mui/icons-material/ShowChart";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";

const BottomMenu = () => {
  return (
    <div className={styles.bottomMenu}>
      <div className={styles.menuItems}>
        <a href="#euro" className={styles.menuItem}>
          <EuroIcon className={styles.icon} />
        </a>
        <a href="#store" className={styles.menuItem}>
          <StorefrontIcon className={styles.icon} />
        </a>
        <a href="#list" className={styles.menuItem}>
          <FormatListBulletedIcon className={styles.icon} />
        </a>
        <a href="#chart" className={styles.menuItem}>
          <ShowChartIcon className={styles.icon} />
        </a>
        <a href="#offer" className={styles.menuItem}>
          <LocalOfferIcon className={styles.icon} />
        </a>
      </div>
      <hr className={styles.divider} />
      <div className={styles.credit}>Designed by Web Gallery</div>
    </div>
  );
};

export default BottomMenu;
