'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

type InterfaceMode = 'alfred' | 'manual';

interface InterfaceModeContextType {
  interfaceMode: InterfaceMode;
  setInterfaceMode: (mode: InterfaceMode) => void;
  isHydrated: boolean;
}

const InterfaceModeContext = createContext<InterfaceModeContextType | undefined>(undefined);

export function InterfaceModeProvider({ children }: { children: ReactNode }) {
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('alfred');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return (
    <InterfaceModeContext.Provider value={{ interfaceMode, setInterfaceMode, isHydrated }}>
      {children}
    </InterfaceModeContext.Provider>
  );
}

export function useInterfaceMode() {
  const context = useContext(InterfaceModeContext);
  if (context === undefined) {
    throw new Error('useInterfaceMode must be used within an InterfaceModeProvider');
  }
  return context;
}