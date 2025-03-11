'use client';

import { publicClient } from '@/constants/publicClient';
import { sttContractConfig } from '@/lib/config';

export async function getMaxTokensPerUser(): Promise<number> {
  try {
    const maxTokens = await publicClient.readContract({
      ...sttContractConfig,
      functionName: 'MAX_TOKENS_PER_USER',
    });

    return Number(maxTokens) - 1;
  } catch (error) {
    console.error('Error fetching MAX_TOKENS_PER_USER:', error);
    return 50;
  }
}

export async function getMintedTokensCount(address: string): Promise<number> {
  if (!address) return 0;

  try {
    const mintedCount = await publicClient.readContract({
      ...sttContractConfig,
      functionName: 'mintedTokensPerUser',
      args: [address],
    });

    return Number(mintedCount);
  } catch (error) {
    console.error(`Error fetching minted token count for ${address}:`, error);
    return 0;
  }
}

export async function getRemainingMintAllowance(address: string): Promise<number> {
  if (!address) return 0;

  try {
    const [maxTokens, mintedCount] = await Promise.all([getMaxTokensPerUser(), getMintedTokensCount(address)]);

    return Math.max(0, maxTokens - mintedCount);
  } catch (error) {
    console.error(`Error calculating remaining mint allowance for ${address}:`, error);
    return 0;
  }
}
