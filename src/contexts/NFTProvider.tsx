'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback, useContext } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
import { toast } from '@/components/ui/use-toast';
import { contractConfig, erc20ContractConfig } from '@/lib/config';
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

  hasERC20Approval: boolean;
  erc20Balance: bigint;
  approveERC20: () => Promise<void>;
  mintWithERC20: (amount: number) => Promise<void>;
  fetchERC20Balance: () => Promise<void>;
  isApprovingERC20: boolean;
}

const NFT_PRICE = '0.1111' as const;

export const NFTContext = createContext<NFTContextType | undefined>(undefined);

export const NFTProvider = ({ children }: { children: ReactNode }) => {
  const [isMinting, setIsMinting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [successCallback, setSuccessCallback] = useState<(() => void) | null>(null);

  const [hasERC20Approval, setHasERC20Approval] = useState(false);
  const [erc20Balance, setERC20Balance] = useState<bigint>(BigInt(0));
  const [isApprovingERC20, setIsApprovingERC20] = useState(false);

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

  const checkERC20Approval = useCallback(async () => {
    if (!address) return;

    try {
      const allowance = (await publicClient.readContract({
        ...erc20ContractConfig,
        functionName: 'allowance',
        args: [address, contractConfig.address],
      })) as bigint;

      // Assuming price is 0.1111 tokens, check if approval is enough for at least 1 token
      const minimumApproval = parseEther('0.1111');
      setHasERC20Approval(allowance >= minimumApproval);
    } catch (err) {
      console.error('Error checking ERC20 allowance:', err);
    }
  }, [address]);

  // Fetch ERC20 balance
  const fetchERC20Balance = useCallback(async () => {
    if (!address) return;

    try {
      const balance = (await publicClient.readContract({
        ...erc20ContractConfig,
        functionName: 'balanceOf',
        args: [address],
      })) as bigint;

      setERC20Balance(balance);
    } catch (err) {
      console.error('Error fetching ERC20 balance:', err);
    }
  }, [address]);

  // Approve ERC20 tokens for the NFT contract
  const approveERC20 = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsApprovingERC20(true);

      // Approve a large amount (or specific amount based on your needs)
      const approvalAmount = parseEther('100'); // Approve 100 tokens

      writeContract({
        ...erc20ContractConfig,
        functionName: 'approve',
        args: [contractConfig.address, approvalAmount],
      });

      // After approval, the transaction receipt handler will update the state
      // You can extend your existing effect for handling transaction receipts
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to approve ERC20: ${message}`,
        variant: 'destructive',
      });
      setIsApprovingERC20(false);
    }
  }, [address, writeContract]);

  // Mint with ERC20 tokens
  const mintWithERC20 = useCallback(
    async (amount: number) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      if (!hasERC20Approval) {
        throw new Error('ERC20 approval required before minting');
      }

      try {
        setIsMinting(true);

        const tokenAmount = parseInt(String(amount));

        if (isNaN(tokenAmount) || tokenAmount <= 0) {
          throw new Error('Invalid amount specified');
        }

        writeContract({
          ...contractConfig,
          functionName: 'mintWithERC20',
          args: [tokenAmount],
        });

        // Transaction handling is handled in the existing effect
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        toast({
          title: 'Error',
          description: `Failed to mint with ERC20: ${message}`,
          variant: 'destructive',
        });
        setIsMinting(false);
      }
    },
    [address, hasERC20Approval, writeContract]
  );

  // Effect for checking ERC20 approval and balance
  useEffect(() => {
    if (address) {
      checkERC20Approval();
      fetchERC20Balance();
    }
  }, [address, checkERC20Approval, fetchERC20Balance]);

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

    hasERC20Approval,
    erc20Balance,
    approveERC20,
    mintWithERC20,
    fetchERC20Balance,
    isApprovingERC20,
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
