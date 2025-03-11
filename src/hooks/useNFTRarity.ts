import { useMemo } from 'react';

const isPrime = (num: number): boolean => {
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

interface RarityInfo {
  label: string;
  colorClass: string;
}

export const useNFTRarity = (tokenId?: number): RarityInfo => {
  return useMemo(() => {
    if (tokenId === undefined || tokenId === null)
      return {
        label: 'Limited Edition',
        colorClass: 'bg-blue-500/50 text-blue-500',
      };

    const id = Number(tokenId);

    if (id < 10)
      return {
        label: 'Limited Edition',
        colorClass: 'bg-blue-500/50 text-blue-500',
      };

    if (isPrime(id))
      return {
        label: 'Rare',
        colorClass: 'bg-purple-500/50 text-purple-500',
      };

    if (id % 2 === 0)
      return {
        label: 'Legendary',
        colorClass: 'bg-yellow-500/50 text-yellow-500',
      };

    return {
      label: 'Exclusive',
      colorClass: 'bg-blue-500/50 text-blue-500',
    };
  }, [tokenId]);
};
