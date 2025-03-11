import { useEffect, useState } from 'react';
interface UseNFTLocalStorageProps {
  isConnected: boolean;
  address?: string;
  ownedNFTs: bigint[];
}
interface UseNFTLocalStorageReturn {
  cachedNFTs: string[];
  isCacheChecked: boolean;
}

export function useNFTLocalStorage({ isConnected, address, ownedNFTs }: UseNFTLocalStorageProps): UseNFTLocalStorageReturn {
  const [cachedNFTs, setCachedNFTs] = useState<string[]>([]);
  const [isCacheChecked, setIsCacheChecked] = useState(false);

  useEffect(() => {
    if (isConnected && address) {
      const addressKey = `nft_cache_${address}`;
      const cached = localStorage.getItem(addressKey);

      try {
        if (ownedNFTs.length > 0) {
          setIsCacheChecked(true);
          return;
        }

        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            setCachedNFTs(parsed);
          }
        } else {
          setCachedNFTs([]);
        }
      } catch (e) {
        console.error('Failed to parse cached NFTs:', e);
        setCachedNFTs([]);
      } finally {
        setIsCacheChecked(true);
      }
    }
  }, [isConnected, address, ownedNFTs.length]);

  useEffect(() => {
    if (isConnected && address) {
      const stringIds = ownedNFTs.map((id) => id.toString());
      const addressKey = `nft_cache_${address}`;

      localStorage.setItem(addressKey, JSON.stringify(stringIds));
      setCachedNFTs(stringIds);
    }
  }, [ownedNFTs, isConnected, address]);

  return {
    cachedNFTs,
    isCacheChecked,
  };
}
