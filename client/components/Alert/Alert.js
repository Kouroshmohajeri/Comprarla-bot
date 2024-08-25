import React, { useEffect, useState } from "react";
import styles from "./Alert.module.css"; // Import the updated CSS module

const Alert = ({ message, type, onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (message) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300); // Delay to ensure animation completes before calling onClose
      }, 500); // Duration to show the alert

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      className={`${styles.alert} ${show ? styles.show : styles.hide} ${
        styles[`alert-${type}`]
      }`}
      role="alert"
    >
      {message}
    </div>
  );
};

export default Alert;
