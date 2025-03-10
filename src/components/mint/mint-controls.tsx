import React from 'react';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Loader2 } from 'lucide-react';

interface MintControlsProps {
  isConnected: boolean;
  mintAmount: number;
  hasReachedMaxLimit: boolean;
  remainingMintAllowance: number;
  isMinting: boolean;
  isApprovingERC20: boolean;
  isERC20Minting: boolean;
  onIncrement: () => void;
  onDecrement: () => void;
  onMint: () => void;
  hasEnoughTokens: boolean;
  paymentMethod: 'native' | 'erc20';
  maxNftLimit: number;
  mintPrice: number;
  getERC20ButtonText?: () => string;
}

export const MintControls = ({
  isConnected,
  mintAmount,
  hasReachedMaxLimit,
  remainingMintAllowance,
  isMinting,
  isApprovingERC20,
  isERC20Minting,
  onIncrement,
  onDecrement,
  onMint,
  hasEnoughTokens,
  paymentMethod,
  maxNftLimit,
  mintPrice,
  getERC20ButtonText,
}: MintControlsProps) => {
  const getNativeButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Mint';
    if (isMinting) return 'Minting...';
    if (!hasEnoughTokens) return 'Insufficient STT Balance';
    if (hasReachedMaxLimit) return `Maximum Limit (${maxNftLimit}) Reached`;
    return `Mint ${mintAmount} for ${mintPrice.toFixed(4)} STT`;
  };

  return (
    <div className="flex items-stretch gap-3 gap-x-1 sm:gap-3 mb-5">
      <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 h-12 sm:h-14">
        <Button
          variant="ghost"
          size="icon"
          onClick={onDecrement}
          disabled={!isConnected || mintAmount <= 1 || isMinting || isApprovingERC20 || isERC20Minting}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
        >
          <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
        <div className="w-10 sm:w-14 flex items-center justify-center text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{mintAmount}</div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onIncrement}
          disabled={!isConnected || isMinting || isApprovingERC20 || isERC20Minting || hasReachedMaxLimit || mintAmount >= remainingMintAllowance}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
        </Button>
      </div>

      {paymentMethod === 'native' ? (
        <Button
          disabled={!isConnected || isMinting || isERC20Minting || (isConnected && (!hasEnoughTokens || hasReachedMaxLimit))}
          onClick={onMint}
          className="flex-1 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2 px-2 sm:px-4 h-12 sm:h-14 shadow-lg text-sm sm:text-base truncate"
        >
          {isMinting ? (
            <>
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              <span className="truncate">Minting...</span>
            </>
          ) : (
            <span className="truncate">{getNativeButtonText()}</span>
          )}
        </Button>
      ) : (
        <Button
          disabled={!isConnected || isMinting || isERC20Minting || (isConnected && (isApprovingERC20 || !hasEnoughTokens || hasReachedMaxLimit))}
          onClick={onMint}
          className="flex-1 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2 px-2 sm:px-4 h-12 sm:h-14 shadow-lg text-sm sm:text-base truncate"
        >
          {isMinting ? (
            <>
              <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              <span className="truncate">{getERC20ButtonText ? getERC20ButtonText() : ''}</span>
            </>
          ) : (
            <span className="truncate">{getERC20ButtonText ? getERC20ButtonText() : ''}</span>
          )}
        </Button>
      )}
    </div>
  );
};

export default MintControls;
