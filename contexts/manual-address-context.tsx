'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface ManualAddressContextType {
  manualAddress: string;
  setManualAddress: (address: string) => void;
  isUsingManualAddress: boolean;
  setIsUsingManualAddress: (using: boolean) => void;
  getEffectiveAddress: (connectedAddress?: string) => string | undefined;
  isHydrated: boolean;
}

const ManualAddressContext = createContext<ManualAddressContextType | undefined>(undefined);

export function ManualAddressProvider({ children }: { children: ReactNode }) {
  const [manualAddress, setManualAddress] = useState('');
  const [isUsingManualAddress, setIsUsingManualAddress] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const getEffectiveAddress = (connectedAddress?: string) => {
    if (isUsingManualAddress && manualAddress.trim()) {
      return manualAddress.trim();
    }
    return connectedAddress;
  };

  return (
    <ManualAddressContext.Provider 
      value={{ 
        manualAddress, 
        setManualAddress, 
        isUsingManualAddress, 
        setIsUsingManualAddress,
        getEffectiveAddress,
        isHydrated
      }}
    >
      {children}
    </ManualAddressContext.Provider>
  );
}

export function useManualAddress() {
  const context = useContext(ManualAddressContext);
  if (context === undefined) {
    throw new Error('useManualAddress must be used within a ManualAddressProvider');
  }
  return context;
}