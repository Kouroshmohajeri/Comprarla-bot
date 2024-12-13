"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./SideMenu.module.css";
import {
  FaGift,
  FaUserShield,
  FaCogs,
  FaRegUser,
  FaSignOutAlt,
  FaAd,
  FaProductHunt,
} from "react-icons/fa";
import { RiAdvertisementLine } from "react-icons/ri";
import { MdAttachMoney, MdSettings, MdAnnouncement } from "react-icons/md";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoClose } from "react-icons/io5";
import { useSideMenu } from "@/context/SideMenuContext"; // Import context
import { checkManagement } from "@/api/Management/actions"; // Import management endpoint action
import Cookies from "js-cookie"; // For accessing cookies

const SideMenu = ({ isOpen, setIsOpen }) => {
  const { selectedPage, setSelectedPage } = useSideMenu(); // Use context
  const [isManagement, setIsManagement] = useState(false); // State to track if the user is management

  useEffect(() => {
    const fetchUserRole = async () => {
      const userId = Cookies.get("userId"); // Retrieve userId from cookies
      if (!userId) return;

      try {
        const response = await checkManagement(userId); // Check if the user is in the management collection
        setIsManagement(response?.isManagement); // Update state based on response
      } catch (error) {
        return;
      }
    };

    fetchUserRole();
  }, []);

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
        {/* Option available for all users */}
        <li className={styles.menuItem} onClick={() => handleMenuClick(2)}>
          <RiAdvertisementLine className={styles.icon} />
          {isOpen && <span>Advertisement</span>}
        </li>
        {/* Conditional rendering based on management role */}
        {isManagement && (
          <>
            <li className={styles.menuItem} onClick={() => handleMenuClick(3)}>
              <FaUserShield className={styles.icon} />
              {isOpen && <span>Authorized Users</span>}
            </li>
            <li className={styles.menuItem} onClick={() => handleMenuClick(4)}>
              <MdAttachMoney className={styles.icon} />
              {isOpen && <span>Converter Logic</span>}
            </li>
            <li className={styles.menuItem} onClick={() => handleMenuClick(5)}>
              <FaCogs className={styles.icon} />
              {isOpen && <span>Promote User</span>}
            </li>
            <li className={styles.menuItem} onClick={() => handleMenuClick(6)}>
              <FaAd className={styles.icon} />
              {isOpen && <span>Manage Ads</span>}
            </li>
            <li className={styles.menuItem} onClick={() => handleMenuClick(7)}>
              <FaProductHunt className={styles.icon} />
              {isOpen && <span>Products</span>}
            </li>
          </>
        )}
        <li className={styles.menuItem} onClick={() => handleMenuClick(8)}>
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
