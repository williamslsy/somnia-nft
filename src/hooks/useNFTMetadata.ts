'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { getNFTMetadata, getTokenBaseURI, NFTMetadata } from '@/lib/metadata';

export function useNFTMetadata() {
  const [nftMetadata, setNFTMetadata] = useState<Record<string, NFTMetadata>>({});
  const [baseURI, setBaseURI] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Use ref for showcase metadata to prevent unnecessary re-renders
  const showcaseMetadataRef = useRef<NFTMetadata | null>(null);
  // Add a ref to track when the showcase metadata has been updated
  const showcaseUpdatedRef = useRef<number>(0);

  // Fetch base URI - only needs to run once
  const fetchBaseURI = useCallback(async () => {
    try {
      const uri = await getTokenBaseURI();
      setBaseURI(uri);
    } catch (err) {
      console.error('Error fetching base URI:', err);
      setError('Failed to fetch base URI');
    }
  }, []);

  // Fetch metadata for a specific token with optional force refresh flag
  const fetchTokenMetadata = useCallback(async (tokenId: number, forceShowcaseUpdate = false) => {
    try {
      const metadata = await getNFTMetadata(tokenId);

      setNFTMetadata((prev) => {
        // Only update if metadata has changed or doesn't exist
        if (!prev[tokenId] || JSON.stringify(prev[tokenId]) !== JSON.stringify(metadata)) {
          return {
            ...prev,
            [tokenId]: metadata,
          };
        }
        return prev;
      });

      // Update showcase if requested or if this is the current showcase NFT
      if (forceShowcaseUpdate) {
        showcaseMetadataRef.current = metadata;
        // Increment the update counter to trigger a re-render in useNFT
        showcaseUpdatedRef.current += 1;
      }

      return metadata;
    } catch (err) {
      console.error(`Error fetching metadata for token ${tokenId}:`, err);
      return null;
    }
  }, []);

  // Set the showcase metadata for a specific token ID
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

  // Get showcase metadata without causing re-renders
  const getShowcaseMetadata = useCallback(
    (nextNftId?: number) => {
      // If we have metadata for the next NFT, use it
      if (nextNftId !== undefined && nftMetadata[nextNftId]) {
        // Only update the ref if it's different
        if (JSON.stringify(showcaseMetadataRef.current) !== JSON.stringify(nftMetadata[nextNftId])) {
          showcaseMetadataRef.current = nftMetadata[nextNftId];
          showcaseUpdatedRef.current += 1;
        }
      }

      // If we don't have a showcase metadata yet, use a default
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

  // Initialize showcase metadata
  useEffect(() => {
    const loadShowcaseImage = async () => {
      setIsImageLoading(true);
      try {
        // Initialize default showcase metadata if needed
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
  }, [fetchBaseURI]); // Empty dependency array means this runs once on mount

  return {
    nftMetadata,
    baseURI,
    error,
    isImageLoading,
    fetchTokenMetadata,
    setShowcaseMetadata,
    getShowcaseMetadata,
    showcaseUpdateCount: showcaseUpdatedRef.current, // Expose update count to trigger re-renders
  };
}
