import React, { useState } from "react";
import styles from "./Modal.module.css";
import Image from "next/image";

const Modal = ({ children, onClose }) => {
  const [isClosing, setIsClosing] = useState(false);

  // Trigger the close animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose(); // Close the modal after the animation ends
    }, 300); // The timeout matches the duration of the CSS animation
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div
        className={`${styles.modalContent} ${
          isClosing ? styles.popOut : styles.popIn
        }`}
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
      >
        <Image
          src={"/logo/comprarlaLogo.svg"}
          width={200}
          height={100}
          className={styles.image}
        />
        {children}
      </div>
    </div>
  );
};

export default Modal;
