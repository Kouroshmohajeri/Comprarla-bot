import React, { createContext, useState, useContext } from "react";

const BottomMenuContext = createContext();

export const BottomMenuProvider = ({ children }) => {
  const [selectedPage, setSelectedPage] = useState("home"); // Default page

  return (
    <BottomMenuContext.Provider value={{ selectedPage, setSelectedPage }}>
      {children}
    </BottomMenuContext.Provider>
  );
};

export const useBottomMenu = () => useContext(BottomMenuContext);
