import React, { useState } from "react";
import styles from "./BottomMenu.module.css";
import EuroIcon from "@mui/icons-material/Euro";
import StorefrontIcon from "@mui/icons-material/Storefront";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import PermIdentityIcon from "@mui/icons-material/PermIdentity";

const BottomMenu = ({ onPageChange }) => {
  const [selected, setSelected] = useState(0); // Start with index 0 (converter)

  const handleClick = (index) => {
    setSelected(index);
    onPageChange(index);
  };

  return (
    <div className={styles.bottomMenu}>
      <div className={styles.menuItems}>
        <div
          className={`${styles.menuItem} ${
            selected === 0 ? styles.active : ""
          }`}
          onClick={() => handleClick(0)}
        >
          <EuroIcon className={styles.icon} sx={{ fontSize: "35px" }} />
          {selected === 0 && <div className={styles.indicator} />}
        </div>
        <div
          className={`${styles.menuItem} ${
            selected === 1 ? styles.active : ""
          }`}
          onClick={() => handleClick(1)}
        >
          <StorefrontIcon className={styles.icon} sx={{ fontSize: "30px" }} />
          {selected === 1 && <div className={styles.indicator} />}
        </div>
        <div
          className={`${styles.menuItem} ${
            selected === 2 ? styles.active : ""
          }`}
          onClick={() => handleClick(2)}
        >
          <PermIdentityIcon className={styles.icon} sx={{ fontSize: "30px" }} />
          {selected === 2 && <div className={styles.indicator} />}
        </div>
        <div
          className={`${styles.menuItem} ${
            selected === 3 ? styles.active : ""
          }`}
          onClick={() => handleClick(3)}
        >
          <FormatListBulletedIcon
            className={styles.icon}
            sx={{ fontSize: "30px" }}
          />
          {selected === 3 && <div className={styles.indicator} />}
        </div>
        <div
          className={`${styles.menuItem} ${
            selected === 4 ? styles.active : ""
          }`}
          onClick={() => handleClick(4)}
        >
          <LocalOfferIcon className={styles.icon} sx={{ fontSize: "30px" }} />
          {selected === 4 && <div className={styles.indicator} />}
        </div>
      </div>
      <hr className={styles.divider} />
      <p className={styles.footer}>Designed by WebGallery</p>
    </div>
  );
};

export default BottomMenu;
