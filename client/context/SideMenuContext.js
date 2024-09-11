"use client";
import React, { createContext, useState, useContext } from "react";

const SideMenuContext = createContext();

export const SideMenuProvider = ({ children }) => {
  const [selectedPage, setSelectedPage] = useState(0); // Default page

  return (
    <SideMenuContext.Provider value={{ selectedPage, setSelectedPage }}>
      {children}
    </SideMenuContext.Provider>
  );
};

export const useSideMenu = () => useContext(SideMenuContext);
