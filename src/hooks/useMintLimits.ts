// hooks/useMintLimits.ts
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

// Default max limit - will be updated from contract if possible
const DEFAULT_MAX_NFT_LIMIT = 50;

export function useMintLimits({ isConnected, address, ownedNFTsLength }: UseMintLimitsProps): UseMintLimitsReturn {
  const [maxNftLimit, setMaxNftLimit] = useState(DEFAULT_MAX_NFT_LIMIT);
  const [mintedCount, setMintedCount] = useState(0);
  const [isLimitsLoading, setIsLimitsLoading] = useState(false);

  // Fetch contract limits when address changes or component mounts
  useEffect(() => {
    async function fetchContractLimits() {
      if (!isConnected || !address) return;

      setIsLimitsLoading(true);
      try {
        // Get max limit from contract
        const maxLimit = await getMaxTokensPerUser();
        if (maxLimit > 0) {
          setMaxNftLimit(maxLimit);
        }

        // Get already minted count for this user
        const minted = await getMintedTokensCount(address);
        setMintedCount(minted);
      } catch (error) {
        console.error('Error fetching contract limits:', error);
        // Keep using the default if there's an error
      } finally {
        setIsLimitsLoading(false);
      }
    }

    fetchContractLimits();
  }, [isConnected, address]);

  // Calculate the remaining NFTs the user can mint
  // Use contract data if available, otherwise fallback to owned NFTs length
  const remainingMintAllowance = maxNftLimit - (mintedCount > 0 ? mintedCount : ownedNFTsLength);

  // Check if user has reached their maximum limit
  const hasReachedMaxLimit = remainingMintAllowance <= 0;

  // Method to refresh minted count (called after successful mint)
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
