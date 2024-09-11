import React, { useState } from "react";
import styles from "./SwitchButton.module.css";

const SwitchButton = () => {
  const [isGiftSelected, setIsGiftSelected] = useState(true);

  const toggleSwitch = () => {
    setIsGiftSelected(!isGiftSelected);
  };

  return (
    <div className={styles.switchContainer} onClick={toggleSwitch}>
      <div className={styles.labels}>
        <span
          className={`${styles.label} ${isGiftSelected ? styles.active : ""}`}
        >
          Gifts
        </span>
        <span
          className={`${styles.label} ${!isGiftSelected ? styles.active : ""}`}
        >
          Products
        </span>
      </div>
      <div
        className={`${styles.switchButton} ${
          isGiftSelected ? styles.giftSelected : styles.productSelected
        }`}
      >
        <span className={styles.text}>
          {isGiftSelected ? "Gifts" : "Products"}
        </span>
      </div>
    </div>
  );
};

export default SwitchButton;
