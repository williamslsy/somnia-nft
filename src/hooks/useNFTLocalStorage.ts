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

  // Initial loading of cache
  useEffect(() => {
    if (isConnected && address) {
      const addressKey = `nft_cache_${address}`;
      const cached = localStorage.getItem(addressKey);

      try {
        // If we already know the user has NFTs from contract data, no need to check cache
        if (ownedNFTs.length > 0) {
          setIsCacheChecked(true);
          return;
        }

        if (cached) {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed)) {
            console.log('Found cached NFTs:', parsed.length);
            setCachedNFTs(parsed);
          }
        } else {
          console.log('No cached NFTs found');
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

  // Update cache when NFTs change
  useEffect(() => {
    if (isConnected && address) {
      const stringIds = ownedNFTs.map((id) => id.toString());
      const addressKey = `nft_cache_${address}`;

      localStorage.setItem(addressKey, JSON.stringify(stringIds));
      setCachedNFTs(stringIds);
      console.log('Updated NFT cache with', stringIds.length, 'NFTs');
    }
  }, [ownedNFTs, isConnected, address]);

  return {
    cachedNFTs,
    isCacheChecked,
  };
}
