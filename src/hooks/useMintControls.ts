'use client';
import { useState, useCallback, useMemo } from 'react';
import { useNFTContext } from '@/contexts/NFTProvider';
import { formatEther } from 'viem';

export function useMintControls() {
  const { mintNativeToken, mintWithERC20, erc20Balance, sttBalance, hasERC20Approval, isApprovingERC20 } = useNFTContext();

  const [mintAmount, setMintAmount] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'native' | 'erc20'>('native');

  // Calculate mint price
  const mintPrice = useMemo(() => {
    return 0.1111 * mintAmount;
  }, [mintAmount]);

  // Format balances
  const formattedERC20Balance = useMemo(() => {
    return Number(formatEther(erc20Balance)).toFixed(4);
  }, [erc20Balance]);

  const formattedSTTBalance = useMemo(() => {
    return Number(formatEther(sttBalance)).toFixed(4);
  }, [sttBalance]);

  // Check if user has enough tokens
  const hasEnoughERC20 = useMemo(() => {
    const requiredAmount = 0.1111 * mintAmount;
    return Number(formatEther(erc20Balance)) >= requiredAmount;
  }, [erc20Balance, mintAmount]);

  const hasEnoughSTT = useMemo(() => {
    const requiredAmount = 0.1111 * mintAmount;
    return Number(formatEther(sttBalance)) >= requiredAmount;
  }, [sttBalance, mintAmount]);

  // Increment and decrement handlers
  const handleIncrementMint = useCallback(() => {
    setMintAmount((prev) => prev + 1);
  }, []);

  const handleDecrementMint = useCallback(() => {
    setMintAmount((prev) => Math.max(1, prev - 1));
  }, []);

  // Toggle payment method
  const togglePaymentMethod = useCallback(() => {
    setPaymentMethod((prev) => (prev === 'native' ? 'erc20' : 'native'));
  }, []);

  return {
    mintAmount,
    setMintAmount,
    paymentMethod,
    setPaymentMethod,
    mintPrice,
    handleIncrementMint,
    handleDecrementMint,
    togglePaymentMethod,
    mintNativeToken,
    mintWithERC20,
    hasERC20Approval,
    isApprovingERC20,
    erc20Balance: formattedERC20Balance,
    hasEnoughERC20,
    sttBalance: formattedSTTBalance,
    hasEnoughSTT,
  };
}
