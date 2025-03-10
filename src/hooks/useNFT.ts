'use client';
import { useMemo, useEffect, useState } from 'react';
import { useNFTMetadata } from './useNFTMetadata';
import { useNFTOwnership } from './useNFTOwnership';
import { useMintControls } from './useMintControls';

export function useNFT() {
  const metadata = useNFTMetadata();
  const ownership = useNFTOwnership(metadata.fetchTokenMetadata);
  const mintControls = useMintControls();

  const [showcaseMetadataState, setShowcaseMetadataState] = useState(metadata.getShowcaseMetadata(ownership.nextNftId));

  useEffect(() => {
    if (ownership.nftChangedEvent) {
      metadata.setShowcaseMetadata(ownership.nftChangedEvent.nextNftId);
    }
  }, [ownership.nftChangedEvent, metadata]);

  useEffect(() => {
    setShowcaseMetadataState(metadata.getShowcaseMetadata(ownership.nextNftId));
  }, [metadata.showcaseUpdateCount, ownership.nextNftId, metadata]);

  useEffect(() => {
    setShowcaseMetadataState(metadata.getShowcaseMetadata(ownership.nextNftId));
  }, [metadata.nftMetadata, ownership.nextNftId, metadata]);

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
    tokenId: ownership.nextNftId,
    refetchOwnedNFTs: ownership.fetchOwnedNFTs,
    fetchAllOwnedNFTsMetadata,
  };
}
