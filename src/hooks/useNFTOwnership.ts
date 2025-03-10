'use client';
import { useState, useCallback, useRef, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { useNFTContext } from '@/contexts/NFTProvider';

export function useNFTOwnership(fetchTokenMetadataFn?: (tokenId: number, forceShowcaseUpdate?: boolean) => Promise<unknown>) {
  const { address, isConnected } = useAccount();
  const { getNFTsOwned, registerSuccessCallback, unregisterSuccessCallback } = useNFTContext();

  const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use refs to track values without causing re-renders
  const prevOwnedNFTsRef = useRef<bigint[]>([]);
  const nextNftIdRef = useRef<number>(0);
  const initialDataLoadedRef = useRef(false);

  // Event emitter for NFT changes
  const [nftChangedEvent, setNftChangedEvent] = useState<{ timestamp: number; nextNftId: number } | null>(null);

  // Helper function to check if two arrays of bigints are equal
  const areArraysEqual = (arr1: bigint[], arr2: bigint[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, idx) => val === arr2[idx]);
  };

  // Updated fetchOwnedNFTs to avoid unnecessary re-renders
  const fetchOwnedNFTs = useCallback(async () => {
    if (!isConnected || !address) return;

    // Only show loading state on initial load
    if (!initialDataLoadedRef.current) {
      setIsLoading(true);
    }

    try {
      const nfts = await getNFTsOwned(address);

      // Only update state if NFTs have actually changed to prevent re-renders
      if (!areArraysEqual(nfts, prevOwnedNFTsRef.current)) {
        setOwnedNFTs(nfts);
        prevOwnedNFTsRef.current = nfts;

        // Update the nextNftId ref when ownedNFTs change
        let newNextNftId = 0;
        if (nfts.length === 0) {
          newNextNftId = 0;
        } else {
          // Find the maximum token ID and add 1
          const maxTokenId = nfts.reduce((max, current) => {
            return Number(current) > Number(max) ? current : max;
          }, nfts[0]);
          newNextNftId = Number(maxTokenId) + 1;
        }

        nextNftIdRef.current = newNextNftId;

        // Notify about NFT changes with the new next NFT ID
        setNftChangedEvent({
          timestamp: Date.now(),
          nextNftId: newNextNftId,
        });

        // This is a real change, we need to fetch the showcase metadata if fetchTokenMetadataFn is provided
        if (fetchTokenMetadataFn && newNextNftId !== undefined) {
          fetchTokenMetadataFn(newNextNftId, true);
        }
      }
    } catch (err) {
      console.error('Error fetching owned NFTs:', err);
      setError('Failed to fetch owned NFTs');
    } finally {
      if (!initialDataLoadedRef.current) {
        setIsLoading(false);
        initialDataLoadedRef.current = true;
      }
    }
  }, [isConnected, address, getNFTsOwned, fetchTokenMetadataFn]);

  // Register the refetch callback when the component mounts
  useEffect(() => {
    registerSuccessCallback(fetchOwnedNFTs);

    // Clean up when the component unmounts
    return () => {
      unregisterSuccessCallback();
    };
  }, [registerSuccessCallback, unregisterSuccessCallback, fetchOwnedNFTs]);

  // Initial data fetching
  useEffect(() => {
    fetchOwnedNFTs();
  }, [isConnected, address, fetchOwnedNFTs]);

  return {
    ownedNFTs,
    isLoading,
    error,
    nextNftId: nextNftIdRef.current,
    fetchOwnedNFTs,
    nftChangedEvent, // Export the event so other hooks can react to it
  };
}
