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
  mintWithERC20: (amount: number) => Promise<void>;
  fetchERC20Balance: () => Promise<void>;
  isApprovingERC20: boolean;

  sttBalance: bigint;
  fetchSTTBalance: () => Promise<void>;
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
  const [isAwaitingApproval, setIsAwaitingApproval] = useState(false);
  const [pendingMintAmount, setPendingMintAmount] = useState<number | null>(null);
  const [sttBalance, setSTTBalance] = useState<bigint>(BigInt(0));

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
    if (!address) return false;

    try {
      const allowance = (await publicClient.readContract({
        ...erc20ContractConfig,
        functionName: 'allowance',
        args: [address, contractConfig.address],
      })) as bigint;

      const minimumApproval = parseEther('0.1111');
      const hasApproval = allowance >= minimumApproval;
      setHasERC20Approval(hasApproval);
      return hasApproval;
    } catch (err) {
      console.error('Error checking ERC20 allowance:', err);
      return false;
    }
  }, [address]);

  const fetchERC20Balance = useCallback(async (): Promise<void> => {
    if (!address) {
      setERC20Balance(BigInt(0));
      return;
    }

    try {
      const balance = (await publicClient.readContract({
        ...erc20ContractConfig,
        functionName: 'balanceOf',
        args: [address],
      })) as bigint;

      setERC20Balance(balance);
    } catch (err) {
      console.error('Error fetching ERC20 balance:', err);
      setERC20Balance(BigInt(0));
    }
  }, [address]);

  const fetchSTTBalance = useCallback(async (): Promise<void> => {
    if (!address) {
      setSTTBalance(BigInt(0));
      return;
    }

    try {
      // Get the balance using the native balanceOf method
      const balance = await publicClient.getBalance({
        address,
      });
      console.log(balance, 'stt balance');
      setSTTBalance(balance);
    } catch (err) {
      console.error('Error fetching STT balance:', err);
      setSTTBalance(BigInt(0));
    }
  }, [address]);

  // Private function to get the current balance (without updating state)
  const getCurrentERC20Balance = useCallback(async (): Promise<bigint> => {
    if (!address) return BigInt(0);

    try {
      return (await publicClient.readContract({
        ...erc20ContractConfig,
        functionName: 'balanceOf',
        args: [address],
      })) as bigint;
    } catch (err) {
      console.error('Error fetching ERC20 balance:', err);
      return BigInt(0);
    }
  }, [address]);

  const approveERC20 = useCallback(async () => {
    if (!address) {
      throw new Error('Wallet not connected');
    }

    try {
      setIsApprovingERC20(true);
      setIsAwaitingApproval(true);

      const approvalAmount = parseEther('100');

      writeContract({
        ...erc20ContractConfig,
        functionName: 'approve',
        args: [contractConfig.address, approvalAmount],
      });

      toast({
        title: 'Approval Required',
        description: 'Please approve IKOIN tokens for spending (1/2)',
        variant: 'default',
      });

      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to approve IKOIN: ${message}`,
        variant: 'destructive',
      });
      setIsApprovingERC20(false);
      setIsAwaitingApproval(false);
      return false;
    }
  }, [address, writeContract]);

  const executeERC20Mint = useCallback(
    async (amount: number) => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      try {
        setIsMinting(true);

        const tokenAmount = parseInt(String(amount));

        if (isNaN(tokenAmount) || tokenAmount <= 0) {
          throw new Error('Invalid amount specified');
        }

        try {
          const estimatedGas = await publicClient.estimateContractGas({
            ...contractConfig,
            functionName: 'mintNative',
            args: [tokenAmount],
            account: address,
          });

          const gasLimit = (estimatedGas * BigInt(130)) / BigInt(100);

          writeContract({
            ...contractConfig,
            functionName: 'mintWithERC20',
            args: [tokenAmount],
            gas: gasLimit,
          });
        } catch (estimationError) {
          console.warn('Gas estimation failed, using fallback gas limit:', estimationError);

          writeContract({
            ...contractConfig,
            functionName: 'mintWithERC20',
            args: [tokenAmount],
            gas: BigInt(100000),
          });
        }

        toast({
          title: 'Minting NFT...',
          description: `Confirm transaction to mint ${amount} NFT(s) with IKOIN (2/2)`,
          variant: 'default',
        });
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
    [address, writeContract]
  );

  const mintWithERC20 = useCallback(
    async (amount: number): Promise<void> => {
      if (!address) {
        throw new Error('Wallet not connected');
      }

      const balance = await getCurrentERC20Balance();
      const requiredAmount = parseEther(NFT_PRICE) * BigInt(amount);

      if (balance < requiredAmount) {
        toast({
          title: 'Insufficient IKOIN',
          description: `You need at least ${parseFloat(NFT_PRICE) * amount} IKOIN to mint ${amount} NFT(s)`,
          variant: 'destructive',
        });
        return;
      }

      const hasApproval = await checkERC20Approval();

      if (!hasApproval) {
        setPendingMintAmount(amount);
        await approveERC20();
      } else {
        await executeERC20Mint(amount);
      }
    },
    [address, getCurrentERC20Balance, checkERC20Approval, approveERC20, executeERC20Mint]
  );

  useEffect(() => {
    if (address) {
      checkERC20Approval();
      fetchERC20Balance();
      fetchSTTBalance();
    }
  }, [address, checkERC20Approval, fetchERC20Balance, fetchSTTBalance]);

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

        try {
          const estimatedGas = await publicClient.estimateContractGas({
            ...contractConfig,
            functionName: 'mintNative',
            args: [tokenAmount],
            value: valueToSend,
            account: address,
          });

          const gasLimit = (estimatedGas * BigInt(130)) / BigInt(100);

          writeContract({
            ...contractConfig,
            functionName: 'mintNative',
            args: [tokenAmount],
            value: valueToSend,
            gas: gasLimit,
          });
        } catch (estimationError) {
          console.warn('Gas estimation failed, using fallback gas limit:', estimationError);

          writeContract({
            ...contractConfig,
            functionName: 'mintNative',
            args: [tokenAmount],
            value: valueToSend,
            gas: BigInt(100000),
          });
        }

        toast({
          title: 'Minting NFT...',
          description: `Confirm to mint ${amount} NFT(s) with STT`,
          variant: 'default',
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
      if (error.message?.includes('rejected') || error.message?.includes('denied') || error.message?.includes('cancelled')) {
        toast({
          title: 'Transaction Cancelled',
          description: 'You rejected the transaction',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: `Transaction failed: ${error.message?.substring(0, 100) || 'Unknown error'}`,
          variant: 'destructive',
        });
      }

      setIsMinting(false);
      setIsApprovingERC20(false);
      setIsAwaitingApproval(false);
      setPendingMintAmount(null);
    }
    if (hash) {
      toast({
        title: 'Transaction Submitted',
        description: `Transaction is processing`,
        variant: 'default',
      });
    }

    if (isConfirming) {
      toast({
        title: 'Pending',
        description: 'Your transaction is being confirmed...',
        variant: 'info',
      });
    }

    if (isSuccess) {
      if (isAwaitingApproval) {
        setIsApprovingERC20(false);
        setIsAwaitingApproval(false);
        setHasERC20Approval(true);

        toast({
          title: 'Approval Successful',
          description: 'IKOIN tokens approved. Starting NFT mint...',
          variant: 'success',
        });

        if (pendingMintAmount !== null) {
          setIsMinting(true);
          setTimeout(() => {
            executeERC20Mint(pendingMintAmount);
            setPendingMintAmount(null);
          }, 1500);
        }
      } else {
        toast({
          title: 'Success',
          description: 'Transaction confirmed: Your NFT has been minted',
          variant: 'success',
        });
        setIsMinting(false);
        setIsConfirmed(true);

        if (successCallback) {
          successCallback();
        }

        fetchERC20Balance();
        fetchSTTBalance();
      }
    }
  }, [hash, isConfirming, isSuccess, error, successCallback, isAwaitingApproval, pendingMintAmount, executeERC20Mint, fetchERC20Balance, fetchSTTBalance]);

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
    fetchERC20Balance,
    mintWithERC20,
    sttBalance,
    fetchSTTBalance,
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
