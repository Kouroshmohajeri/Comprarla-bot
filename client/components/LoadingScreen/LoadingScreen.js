import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./LoadingScreen.module.css";

const LoadingScreen = ({ onLoaded }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    // Simulate loading time and start fading out after the loading is done
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      // Call onLoaded function after fade-out duration
      setTimeout(() => onLoaded(), 1000); // Match duration with CSS animation
    }, 2000); // Simulate loading time

    return () => clearTimeout(timer);
  }, [onLoaded]);

  return (
    <div
      className={`${styles.loadingContainer} ${
        isFadingOut ? styles.fadeOut : ""
      }`}
    >
      <Image
        src="/logo/comprarlaLogo.svg"
        alt="Loading..."
        width={500} // Adjust size as needed
        height={200} // Adjust size as needed
        className={styles.loadingLogo}
      />
    </div>
  );
};

export default LoadingScreen;
