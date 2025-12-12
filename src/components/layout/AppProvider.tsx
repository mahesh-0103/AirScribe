"use client";

import React, { createContext, useContext } from 'react';

interface AppContextType {
  isApiReady: boolean;
}

const AppContext = createContext<AppContextType>({ isApiReady: true });

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  // Health check removed as requested. The app will render children immediately.
  const isApiReady = true;

  return (
    <AppContext.Provider value={{ isApiReady }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
