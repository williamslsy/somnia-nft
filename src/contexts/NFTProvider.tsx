'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from '@/components/ui/use-toast';
import { contractConfig } from '@/lib/config';
import { publicClient } from '@/constants/publicClient';
import { useAccount } from 'wagmi';

interface NFTContextType {
  isPending: boolean;
  isMinting: boolean;
  isConfirmed: boolean;
  setIsConfirmed: React.Dispatch<React.SetStateAction<boolean>>;
  mintNativeToken: (amount: number) => Promise<void>;
  getNFTsOwned: (userAddress: `0x${string}`) => Promise<bigint[]>;
  registerSuccessCallback: (callback: () => void) => void;
  unregisterSuccessCallback: () => void;
}

const NFT_PRICE = '0.1111' as const;

export const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider = ({ children }: { children: ReactNode }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(null);

  const { address } = useAccount();

  const { data: hash, error, isPending, writeContract } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  const registerSuccessCallback = useCallback((callback: () => void) => {
    setSuccessCallback(() => callback);
  }, []);

  const unregisterSuccessCallback = useCallback(() => {
    setSuccessCallback(null);
  }, []);

  const getNFTsOwned = useCallback(async (userAddress: `0x${string}`) => {
    try {
      if (!userAddress) {
        throw new Error('User address is required');
      }

      const result = (await publicClient.readContract({
        ...contractConfig,
        functionName: 'tokensOf',
        args: [userAddress],
      })) as bigint[];

      return result;
    } catch (err) {
      console.error('Error fetching NFTs:', err);
      throw err;
    }
  }, []);

  const mintNativeToken = useCallback(
    async (amount: number) => {
      try {
        if (!address) {
          throw new Error('Wallet not connected');
        }

        setIsMinting(true);

        const tokenAmount = parseInt(String(amount));

        if (isNaN(tokenAmount) || tokenAmount <= 0) {
          throw new Error('Invalid amount specified');
        }

        const valueToSend = parseEther(NFT_PRICE) * BigInt(tokenAmount);

        writeContract({
          ...contractConfig,
          functionName: 'mintNative',
          args: [tokenAmount],
          value: valueToSend,
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast({
          title: 'Error',
          description: `Failed to mint NFT: ${message}`,
          variant: 'destructive',
        });
        setIsMinting(false);
      }
    },
    [address, writeContract]
  );

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: `Failed to mint NFT: ${error.message || 'Unknown error'}`,
        variant: 'destructive',
      });
      setIsMinting(false);
    }

    if (hash) {
      toast({
        title: 'Success',
        description: `Tx hash: ${hash}`,
        variant: 'success',
      });
    }

    if (isConfirming) {
      toast({
        title: 'Pending',
        description: 'Your transaction is processing. Please wait for confirmation...',
        variant: 'info',
      });
    }

    if (isSuccess) {
      toast({
        title: 'Confirmed',
        description: 'Transaction confirmed: Your NFT has been minted',
        variant: 'success',
      });
      setIsMinting(false);
      setIsConfirmed(true);

      // Execute the success callback if registered
      if (successCallback) {
        successCallback();
      }
    }
  }, [hash, isConfirming, isSuccess, error, successCallback]);

  const contextValue: NFTContextType = {
    isPending,
    isMinting,
    isConfirmed,
    setIsConfirmed,
    mintNativeToken,
    getNFTsOwned,
    registerSuccessCallback,
    unregisterSuccessCallback,
  };

  return <NFTContext.Provider value={contextValue}>{children}</NFTContext.Provider>;
};

export const useNFTContext = () => {
  const context = useContext(NFTContext);
  if (context === undefined) {
    throw new Error('useNFTContext must be used within an NFTProvider');
  }
  return context;
};
