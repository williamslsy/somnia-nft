import { useState, useEffect, useCallback } from 'react';

interface UseMintAmountProps {
  isConnected: boolean;
  remainingMintAllowance: number;
  initialAmount?: number;
  onMintComplete?: () => void;
}

interface UseMintAmountReturn {
  mintAmount: number;
  setMintAmount: (amount: number) => void;
  handleIncrementMint: () => void;
  handleDecrementMint: () => void;
  handleIncrementWithLimit: () => void;
  exceedsRemainingAllowance: boolean;
  resetMintAmount: () => void;
}

export function useMintAmount({ isConnected, remainingMintAllowance, initialAmount = 1, onMintComplete }: UseMintAmountProps): UseMintAmountReturn {
  const [mintAmount, setMintAmount] = useState(initialAmount);

  const exceedsRemainingAllowance = mintAmount > remainingMintAllowance;

  const resetMintAmount = useCallback(() => {
    setMintAmount(1);
    if (onMintComplete) {
      onMintComplete();
    }
  }, [onMintComplete]);

  const handleIncrementMint = useCallback(() => {
    setMintAmount((prev) => prev + 1);
  }, []);

  const handleDecrementMint = useCallback(() => {
    setMintAmount((prev) => Math.max(1, prev - 1));
  }, []);

  const handleIncrementWithLimit = useCallback(() => {
    if (mintAmount < remainingMintAllowance) {
      handleIncrementMint();
    }
  }, [mintAmount, remainingMintAllowance, handleIncrementMint]);

  useEffect(() => {
    if (isConnected && exceedsRemainingAllowance && remainingMintAllowance > 0) {
      setMintAmount(remainingMintAllowance);
    }
  }, [isConnected, exceedsRemainingAllowance, remainingMintAllowance]);

  return {
    mintAmount,
    setMintAmount,
    handleIncrementMint,
    handleDecrementMint,
    handleIncrementWithLimit,
    exceedsRemainingAllowance,
    resetMintAmount,
  };
}
