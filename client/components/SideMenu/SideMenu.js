"use client";
import React from "react";
import Image from "next/image";
import styles from "./SideMenu.module.css";
import {
  FaGift,
  FaUserShield,
  FaCogs,
  FaRegUser,
  FaSignOutAlt,
} from "react-icons/fa";
import {
  MdProductionQuantityLimits,
  MdAttachMoney,
  MdAddShoppingCart,
  MdSettings,
} from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { useSideMenu } from "@/context/SideMenuContext"; // Import context

const SideMenu = ({ isOpen, setIsOpen }) => {
  const { selectedPage, setSelectedPage } = useSideMenu(); // Use context

  const toggleMenu = () => setIsOpen(!isOpen);

  const handleMenuClick = (index) => {
    setSelectedPage(index); // Set selected page based on click
    setIsOpen(false); // Close the menu after a selection
  };

  return (
    <div
      className={`${styles.sideMenu} ${
        isOpen ? styles.openMenu : styles.closedMenu
      }`}
    >
      <div className={styles.topContainer}>
        <div className={styles.hamburgerIcon} onClick={toggleMenu}>
          {isOpen ? (
            <IoClose className={styles.menuIcon} />
          ) : (
            <GiHamburgerMenu className={styles.menuIcon} />
          )}
        </div>
        {isOpen && (
          <div className={styles.logoContainer}>
            <Image
              src="/logo/comprarlaLogo.svg"
              alt="Logo"
              className={styles.logo}
              width={200}
              height={100}
            />
          </div>
        )}
      </div>

      <ul className={styles.menuList}>
        <li className={styles.menuItem} onClick={() => handleMenuClick(0)}>
          <FaRegUser className={styles.icon} />
          {isOpen && <span>Dashboard</span>}
        </li>
        <li className={styles.menuItem} onClick={() => handleMenuClick(1)}>
          <FaGift className={styles.icon} />
          {isOpen && <span>Gifts</span>}
        </li>
        <li className={styles.menuItem} onClick={() => handleMenuClick(2)}>
          <FaUserShield className={styles.icon} />
          {isOpen && <span>Authorized Users</span>}
        </li>
        <li className={styles.menuItem} onClick={() => handleMenuClick(3)}>
          <MdAttachMoney className={styles.icon} />
          {isOpen && <span>Converter Logic</span>}
        </li>
        <li className={styles.menuItem} onClick={() => handleMenuClick(4)}>
          <MdSettings className={styles.icon} />
          {isOpen && <span>Settings</span>}
        </li>
      </ul>

      <ul className={styles.bottomMenuList}>
        <li className={styles.menuItem}>
          <FaSignOutAlt className={styles.icon} />
          {isOpen && <span>Log out</span>}
        </li>
      </ul>
    </div>
  );
};

export default SideMenu;
