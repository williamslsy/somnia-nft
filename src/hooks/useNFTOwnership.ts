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

  const prevOwnedNFTsRef = useRef<bigint[]>([]);
  const nextNftIdRef = useRef<number>(0);
  const initialDataLoadedRef = useRef(false);

  const [nftChangedEvent, setNftChangedEvent] = useState<{ timestamp: number; nextNftId: number } | null>(null);

  const areArraysEqual = (arr1: bigint[], arr2: bigint[]) => {
    if (arr1.length !== arr2.length) return false;
    return arr1.every((val, idx) => val === arr2[idx]);
  };

  const fetchOwnedNFTs = useCallback(async () => {
    if (!isConnected || !address) return;

    if (!initialDataLoadedRef.current) {
      setIsLoading(true);
    }

    try {
      const nfts = await getNFTsOwned(address);

      if (!areArraysEqual(nfts, prevOwnedNFTsRef.current)) {
        setOwnedNFTs(nfts);
        prevOwnedNFTsRef.current = nfts;

        let newNextNftId = 0;
        if (nfts.length === 0) {
          newNextNftId = 0;
        } else {
          const maxTokenId = nfts.reduce((max, current) => {
            return Number(current) > Number(max) ? current : max;
          }, nfts[0]);
          newNextNftId = Number(maxTokenId) + 1;
        }

        nextNftIdRef.current = newNextNftId;

        setNftChangedEvent({
          timestamp: Date.now(),
          nextNftId: newNextNftId,
        });

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

  useEffect(() => {
    registerSuccessCallback(fetchOwnedNFTs);

    return () => {
      unregisterSuccessCallback();
    };
  }, [registerSuccessCallback, unregisterSuccessCallback, fetchOwnedNFTs]);

  useEffect(() => {
    fetchOwnedNFTs();
  }, [isConnected, address, fetchOwnedNFTs]);

  return {
    ownedNFTs,
    isLoading,
    error,
    nextNftId: nextNftIdRef.current,
    fetchOwnedNFTs,
    nftChangedEvent,
  };
}
