'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAccount } from 'wagmi';
import { toast } from '@/components/ui/use-toast';

interface AccountContextType {
  address: `0x${string}` | undefined;
  isConnected: boolean;
  chainId: number | undefined;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { address, isConnected, chainId } = useAccount();

  const [previousAddress, setPreviousAddress] = useState<`0x${string}` | undefined>(undefined);

  useEffect(() => {
    if (address && previousAddress && address !== previousAddress) {
      toast({
        title: 'Account Changed',
        description: `Switched to ${address.slice(0, 6)}...${address.slice(-4)}`,
      });
    }

    setPreviousAddress(address);
  }, [address, previousAddress]);

  const value = {
    address,
    isConnected,
    chainId,
  };

  return <AccountContext.Provider value={value}>{children}</AccountContext.Provider>;
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (context === undefined) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
}
