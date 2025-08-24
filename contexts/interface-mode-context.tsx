'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type InterfaceMode = 'autonomous' | 'manual';

interface InterfaceModeContextType {
  interfaceMode: InterfaceMode;
  setInterfaceMode: (mode: InterfaceMode) => void;
}

const InterfaceModeContext = createContext<InterfaceModeContextType | undefined>(undefined);

export function InterfaceModeProvider({ children }: { children: ReactNode }) {
  const [interfaceMode, setInterfaceMode] = useState<InterfaceMode>('manual');

  return (
    <InterfaceModeContext.Provider value={{ interfaceMode, setInterfaceMode }}>
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