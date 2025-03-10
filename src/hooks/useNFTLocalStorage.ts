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
  }, [isConnected, address]);

  useEffect(() => {
    if (isConnected && address && ownedNFTs.length > 0) {
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
