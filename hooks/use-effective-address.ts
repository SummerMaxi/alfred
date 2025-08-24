'use client';

import { useAccount } from 'wagmi';
import { useManualAddress } from '@/contexts/manual-address-context';

export function useEffectiveAddress() {
  const { address: connectedAddress, isConnected } = useAccount();
  const { getEffectiveAddress, isUsingManualAddress, manualAddress } = useManualAddress();
  
  const effectiveAddress = getEffectiveAddress(connectedAddress);
  const isEffectivelyConnected = isConnected || (isUsingManualAddress && !!manualAddress.trim());
  
  return {
    address: effectiveAddress,
    isConnected: isEffectivelyConnected,
    isUsingManualAddress,
    connectedAddress,
    manualAddress
  };
}