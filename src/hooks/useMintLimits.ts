import { useState, useEffect } from 'react';
import { getMintedTokensCount, getMaxTokensPerUser } from '@/services/getTokenLimits';

interface UseMintLimitsProps {
  isConnected: boolean;
  address?: string;
  ownedNFTsLength: number;
}

interface UseMintLimitsReturn {
  maxNftLimit: number;
  mintedCount: number;
  remainingMintAllowance: number;
  hasReachedMaxLimit: boolean;
  isLimitsLoading: boolean;
  refreshMintedCount: () => Promise<void>;
}

const DEFAULT_MAX_NFT_LIMIT = 50;

export function useMintLimits({ isConnected, address, ownedNFTsLength }: UseMintLimitsProps): UseMintLimitsReturn {
  const [maxNftLimit, setMaxNftLimit] = useState(DEFAULT_MAX_NFT_LIMIT);
  const [mintedCount, setMintedCount] = useState(0);
  const [isLimitsLoading, setIsLimitsLoading] = useState(false);

  useEffect(() => {
    async function fetchContractLimits() {
      if (!isConnected || !address) return;

      setIsLimitsLoading(true);
      try {
        const maxLimit = await getMaxTokensPerUser();
        if (maxLimit > 0) {
          setMaxNftLimit(maxLimit);
        }

        const minted = await getMintedTokensCount(address);
        setMintedCount(minted);
      } catch (error) {
        console.error('Error fetching contract limits:', error);
      } finally {
        setIsLimitsLoading(false);
      }
    }

    fetchContractLimits();
  }, [isConnected, address]);

  const remainingMintAllowance = maxNftLimit - (mintedCount > 0 ? mintedCount : ownedNFTsLength);

  const hasReachedMaxLimit = remainingMintAllowance <= 0;

  const refreshMintedCount = async () => {
    if (address) {
      try {
        const newMintedCount = await getMintedTokensCount(address);
        setMintedCount(newMintedCount);
      } catch (error) {
        console.error('Error refreshing minted count:', error);
      }
    }
  };

  return {
    maxNftLimit,
    mintedCount,
    remainingMintAllowance,
    hasReachedMaxLimit,
    isLimitsLoading,
    refreshMintedCount,
  };
}
