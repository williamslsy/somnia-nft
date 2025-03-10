'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getNFTMetadata, getTokenBaseURI, getBatchNFTMetadata, NFTMetadata } from '@/services/getNFTMetadata';
import { cleanupExpiredCache } from '@/lib/nftMetadataCache';

export function useNFTMetadata() {
  const [nftMetadata, setNFTMetadata] = useState<Record<string, NFTMetadata>>({});
  const [baseURI, setBaseURI] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  const showcaseMetadataRef = useRef<NFTMetadata | null>(null);
  const showcaseUpdatedRef = useRef<number>(0);

  const [isBatchLoading, setIsBatchLoading] = useState(false);

  useEffect(() => {
    cleanupExpiredCache();
  }, []);

  const fetchBaseURI = useCallback(async () => {
    try {
      const uri = await getTokenBaseURI();
      setBaseURI(uri);
    } catch (err) {
      console.error('Error fetching base URI:', err);
      setError('Failed to fetch base URI');
    }
  }, []);

  const fetchTokenMetadata = useCallback(async (tokenId: number, forceShowcaseUpdate = false) => {
    try {
      const metadata = await getNFTMetadata(tokenId);

      setNFTMetadata((prev) => {
        if (!prev[tokenId] || JSON.stringify(prev[tokenId]) !== JSON.stringify(metadata)) {
          return {
            ...prev,
            [tokenId]: metadata,
          };
        }
        return prev;
      });

      if (forceShowcaseUpdate) {
        showcaseMetadataRef.current = metadata;
        showcaseUpdatedRef.current += 1;
      }

      return metadata;
    } catch (err) {
      console.error(`Error fetching metadata for token ${tokenId}:`, err);
      return null;
    }
  }, []);

  const fetchBatchMetadata = useCallback(async (tokenIds: number[]) => {
    if (!tokenIds.length) return;

    setIsBatchLoading(true);

    try {
      const batchResults = await getBatchNFTMetadata(tokenIds);

      setNFTMetadata((prev) => {
        const newMetadata = { ...prev };

        Object.entries(batchResults).forEach(([id, metadata]) => {
          const tokenId = id;
          newMetadata[tokenId] = metadata;
        });

        return newMetadata;
      });
    } catch (error) {
      console.error('Error fetching batch metadata:', error);
    } finally {
      setIsBatchLoading(false);
    }
  }, []);

  const setShowcaseMetadata = useCallback(
    (tokenId: number) => {
      if (nftMetadata[tokenId]) {
        showcaseMetadataRef.current = nftMetadata[tokenId];
        showcaseUpdatedRef.current += 1;
        return true;
      }
      return false;
    },
    [nftMetadata]
  );

  const getShowcaseMetadata = useCallback(
    (nextNftId?: number) => {
      if (nextNftId !== undefined && nftMetadata[nextNftId]) {
        if (JSON.stringify(showcaseMetadataRef.current) !== JSON.stringify(nftMetadata[nextNftId])) {
          showcaseMetadataRef.current = nftMetadata[nextNftId];
          showcaseUpdatedRef.current += 1;
        }
      }

      if (!showcaseMetadataRef.current) {
        showcaseMetadataRef.current = {
          name: 'Somnia NFT',
          description: 'A Somnia Devnet NFT',
          image: '/assets/placeholder.svg',
        };
      }

      return showcaseMetadataRef.current;
    },
    [nftMetadata]
  );

  const refreshTokenMetadata = useCallback(
    async (tokenId: number) => {
      return fetchTokenMetadata(tokenId, true);
    },
    [fetchTokenMetadata]
  );

  useEffect(() => {
    const loadShowcaseImage = async () => {
      setIsImageLoading(true);
      try {
        if (!showcaseMetadataRef.current) {
          showcaseMetadataRef.current = {
            name: 'Somnia NFT',
            description: 'A Somnia Devnet NFT',
            image: '/assets/placeholder.svg',
          };
        }
      } catch (error) {
        console.error('Failed to load showcase image:', error);
      } finally {
        setIsImageLoading(false);
      }
    };

    loadShowcaseImage();
    fetchBaseURI();
  }, [fetchBaseURI]);

  return {
    nftMetadata,
    baseURI,
    error,
    isImageLoading,
    isBatchLoading,
    fetchTokenMetadata,
    fetchBatchMetadata,
    refreshTokenMetadata,
    setShowcaseMetadata,
    getShowcaseMetadata,
    showcaseUpdateCount: showcaseUpdatedRef.current,
  };
}
