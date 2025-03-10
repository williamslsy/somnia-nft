'use client';

import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { toast } from '@/components/ui/use-toast';
import { useNFTContext } from '@/contexts/NFTProvider';
import { erc20ContractConfig } from '@/lib/config';

interface UseERC20MinterReturn {
  amount: string;
  setAmount: (amount: string) => void;
  isMinting: boolean;
  isPending: boolean;
  isSuccess: boolean;
  handleMint: () => Promise<void>;
  handleAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSliderChange: (newValue: number[]) => void;
  resetAmount: () => void;
  getButtonText: () => string;
}

export function useERC20Minter(): UseERC20MinterReturn {
  const [amount, setAmount] = useState<string>('10');
  const [isMinting, setIsMinting] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const { fetchERC20Balance } = useNFTContext();
  const { writeContract, data: hash, error, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  useEffect(() => {
    if (isWritePending || isConfirming) {
      setIsPending(true);
    }

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
      setIsPending(false);
    }

    if (hash) {
      toast({
        title: 'Transaction Submitted',
        description: `Your IKOIN minting transaction is processing`,
        variant: 'success',
      });
    }

    if (isConfirming) {
      toast({
        title: 'Pending',
        description: 'Your transaction is being confirmed...',
        variant: 'success',
      });
    }

    if (isSuccess) {
      toast({
        title: 'Success',
        description: 'Transaction confirmed: Your IKOIN tokens have been minted',
        variant: 'success',
      });
      setIsMinting(false);
      setIsPending(false);

      setAmount('10');

      fetchERC20Balance();
    }
  }, [hash, isConfirming, isSuccess, error, fetchERC20Balance, isWritePending]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');

    if (value === '') {
      setAmount('1');
    } else {
      setAmount(value);
    }
  };

  const handleSliderChange = (newValue: number[]) => {
    setAmount(newValue[0].toString());
  };

  const resetAmount = () => {
    setAmount('10');
  };

  const handleMint = async () => {
    try {
      setIsMinting(true);

      const mintAmount = parseInt(amount);
      if (isNaN(mintAmount) || mintAmount <= 0) {
        toast({
          title: 'Error',
          description: 'Please enter a valid amount',
          variant: 'destructive',
        });
        setIsMinting(false);
        return;
      }

      writeContract({
        ...erc20ContractConfig,
        functionName: 'mint',
        args: [mintAmount],
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to mint IKOIN: ${message}`,
        variant: 'destructive',
      });
      setIsMinting(false);
      setIsPending(false);
    }
  };

  const getButtonText = () => {
    if (isMinting && !hash) return 'Submitting...';
    if (hash && isConfirming) return 'Confirming...';
    if (isMinting) return 'Minting...';
    return `Mint ${amount} IKOIN`;
  };

  return {
    amount,
    setAmount,
    isMinting,
    isPending,
    isSuccess,
    handleMint,
    handleAmountChange,
    handleSliderChange,
    resetAmount,
    getButtonText,
  };
}
