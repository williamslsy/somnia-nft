import { NFTMetadata } from '@/services/getNFTMetadata';

const CACHE_EXPIRY = 3600000;
const BASE_URI_KEY = 'nft_base_uri';
const METADATA_PREFIX = 'nft_metadata_';

interface CachedItem<T> {
  data: T;
  timestamp: number;
}

export function cacheBaseURI(baseURI: string): void {
  const cacheItem: CachedItem<string> = {
    data: baseURI,
    timestamp: Date.now(),
  };
  localStorage.setItem(BASE_URI_KEY, JSON.stringify(cacheItem));
}

export function getCachedBaseURI(): string | null {
  try {
    const cached = localStorage.getItem(BASE_URI_KEY);
    if (!cached) return null;

    const cachedItem: CachedItem<string> = JSON.parse(cached);

    if (Date.now() - cachedItem.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(BASE_URI_KEY);
      return null;
    }

    return cachedItem.data;
  } catch (error) {
    console.error('Error reading baseURI from cache:', error);
    return null;
  }
}

export function cacheNFTMetadata(tokenId: number, metadata: NFTMetadata): void {
  const cacheItem: CachedItem<NFTMetadata> = {
    data: metadata,
    timestamp: Date.now(),
  };
  localStorage.setItem(`${METADATA_PREFIX}${tokenId}`, JSON.stringify(cacheItem));
}

export function getCachedNFTMetadata(tokenId: number): NFTMetadata | null {
  try {
    const cached = localStorage.getItem(`${METADATA_PREFIX}${tokenId}`);
    if (!cached) return null;

    const cachedItem: CachedItem<NFTMetadata> = JSON.parse(cached);

    if (Date.now() - cachedItem.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${METADATA_PREFIX}${tokenId}`);
      return null;
    }

    return cachedItem.data;
  } catch (error) {
    console.error(`Error reading metadata for token ${tokenId} from cache:`, error);
    return null;
  }
}

export function cleanupExpiredCache(): void {
  try {
    const baseURICache = localStorage.getItem(BASE_URI_KEY);
    if (baseURICache) {
      const cachedItem: CachedItem<unknown> = JSON.parse(baseURICache);
      if (Date.now() - cachedItem.timestamp > CACHE_EXPIRY) {
        localStorage.removeItem(BASE_URI_KEY);
      }
    }

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(METADATA_PREFIX)) {
        try {
          const cachedItem: CachedItem<unknown> = JSON.parse(localStorage.getItem(key) || '');
          if (Date.now() - cachedItem.timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(key);
          }
        } catch {
          localStorage.removeItem(key || '');
        }
      }
    }
  } catch (error) {
    console.error('Error cleaning up cache:', error);
  }
}

export function clearAllMetadataCache(): void {
  try {
    localStorage.removeItem(BASE_URI_KEY);

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(METADATA_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
  } catch (error) {
    console.error('Error clearing metadata cache:', error);
  }
}
