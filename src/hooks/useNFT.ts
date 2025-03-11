'use client';
import { useMemo, useEffect, useState } from 'react';
import { useNFTMetadata } from './useNFTMetadata';
import { useNFTOwnership } from './useNFTOwnership';
import { useMintControls } from './useMintControls';

export function useNFT() {
  const metadata = useNFTMetadata();
  const ownership = useNFTOwnership(metadata.fetchTokenMetadata);
  const mintControls = useMintControls();

  const effectiveTokenId = useMemo(() => {
    if (ownership.nextNftId !== undefined) {
      return ownership.nextNftId;
    }

    return 0;
  }, [ownership.nextNftId]);

  const [showcaseMetadataState, setShowcaseMetadataState] = useState(metadata.getShowcaseMetadata(effectiveTokenId));

  useEffect(() => {
    if (ownership.nftChangedEvent) {
      metadata.setShowcaseMetadata(ownership.nftChangedEvent.nextNftId);
    }
  }, [ownership.nftChangedEvent, metadata]);

  useEffect(() => {
    setShowcaseMetadataState(metadata.getShowcaseMetadata(effectiveTokenId));
  }, [metadata.showcaseUpdateCount, effectiveTokenId, metadata]);

  useEffect(() => {
    setShowcaseMetadataState(metadata.getShowcaseMetadata(effectiveTokenId));
  }, [metadata.nftMetadata, effectiveTokenId, metadata]);

  useEffect(() => {
    if (ownership.ownedNFTs.length === 0) {
      metadata.fetchTokenMetadata(0);
    }
  }, [ownership.ownedNFTs, metadata]);

  const fetchAllOwnedNFTsMetadata = useMemo(() => {
    return async () => {
      if (ownership.ownedNFTs.length === 0) return;

      const promises = ownership.ownedNFTs.map((tokenId) => metadata.fetchTokenMetadata(Number(tokenId)));

      try {
        await Promise.all(promises);
      } catch (err) {
        console.error('Error fetching NFT metadata:', err);
      }
    };
  }, [ownership.ownedNFTs, metadata]);

  useEffect(() => {
    fetchAllOwnedNFTsMetadata();
  }, [ownership.ownedNFTs, fetchAllOwnedNFTsMetadata]);

  return {
    ...metadata,
    ...ownership,
    ...mintControls,

    showcaseMetadata: showcaseMetadataState,
    tokenId: effectiveTokenId,
    refetchOwnedNFTs: ownership.fetchOwnedNFTs,
    fetchAllOwnedNFTsMetadata,
  };
}
