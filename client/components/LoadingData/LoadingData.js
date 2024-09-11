import React from "react";
import styles from "./LoadingData.module.css"; // Import the CSS module

const LoadingData = () => {
  const loadingText = "Loading user data...";

  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingText}>
        {loadingText.split("").map((char, index) => (
          <span
            key={index}
            style={{ animationDelay: `${index * 0.1}s` }} // Delay each character's animation
            className={styles.loadingChar}
          >
            {char === " " ? "\u00A0" : char} {/* Replaces space with &nbsp; */}
          </span>
        ))}
      </div>
    </div>
  );
};

export default LoadingData;
