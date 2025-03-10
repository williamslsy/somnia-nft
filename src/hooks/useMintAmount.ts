// hooks/useMintAmount.ts
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

  // Check if current mintAmount exceeds remaining allowance
  const exceedsRemainingAllowance = mintAmount > remainingMintAllowance;

  // Reset mint amount
  const resetMintAmount = useCallback(() => {
    setMintAmount(1);
    if (onMintComplete) {
      onMintComplete();
    }
  }, [onMintComplete]);

  // Increment handler
  const handleIncrementMint = useCallback(() => {
    setMintAmount((prev) => prev + 1);
  }, []);

  // Decrement handler
  const handleDecrementMint = useCallback(() => {
    setMintAmount((prev) => Math.max(1, prev - 1));
  }, []);

  // Custom increment handler that respects maximum limits
  const handleIncrementWithLimit = useCallback(() => {
    if (mintAmount < remainingMintAllowance) {
      handleIncrementMint();
    }
  }, [mintAmount, remainingMintAllowance, handleIncrementMint]);

  // Effect to adjust mint amount if it exceeds remaining allowance
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
