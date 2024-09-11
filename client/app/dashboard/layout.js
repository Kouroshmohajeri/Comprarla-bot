"use client";
import React, { useState } from "react";
import SideMenu from "@/components/SideMenu/SideMenu";
import ParticlesBackground from "@/components/ParticlesBackground/ParticlesBackground";
import { useSideMenu } from "@/context/SideMenuContext";
import DashboardPage from "@/components/DashboardPage/DashboardPage"; // Import the dashboard page

const Layout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { selectedPage } = useSideMenu(); // Get the current selected page

  const renderPage = () => {
    if (selectedPage === 0) return <DashboardPage />;
    // Add other pages based on the selectedPage index
    if (selectedPage === 1) return <div>Gifts Page</div>;
    if (selectedPage === 2) return <div>Authorized Users Page</div>;
    if (selectedPage === 3) return <div>Converter Logic Page</div>;
    if (selectedPage === 4) return <div>Settings Page</div>;
    return null;
  };

  return (
    <div>
      <SideMenu isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <div className={`mainContainer ${isMenuOpen ? "menuOpen" : ""}`}>
        {renderPage()}
      </div>
      <ParticlesBackground id="particles" />
    </div>
  );
};

export default Layout;
