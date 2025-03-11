'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { useNFT } from '@/hooks/useNFT';
import { ConnectWalletPrompt } from './connect-wallet-prompt';
import { EmptyCollectionView } from './empty-collection-view';
import { SearchBar } from './search-bar';
import { NFTGrid } from './nft-grid';
import { useNFTLocalStorage } from '@/hooks/useNFTLocalStorage';
import { NFTCollectionHeader } from './collection-header';
import { NoSearchResults } from './no-search-results';
import { ExpandCollectionCTA } from './expanded-collection';
import { Button } from '@/components/ui/button';

function NFTGallery() {
  const { isConnected, address } = useAccount();
  const { ownedNFTs, nftMetadata, fetchTokenMetadata, isLoading } = useNFT();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'loading' | 'empty' | 'content'>('loading');

  const [displayLimit, setDisplayLimit] = useState(8);
  const INCREMENT_SIZE = 8;

  const { cachedNFTs, isCacheChecked } = useNFTLocalStorage({
    isConnected,
    address,
    ownedNFTs,
  });

  const validNFTs = ownedNFTs.filter((tokenId) => tokenId !== undefined && tokenId !== null);

  const filteredNFTs = validNFTs.filter((tokenId) => {
    const metadata = nftMetadata[Number(tokenId)];
    if (!metadata || !searchQuery) return true;

    return metadata.name?.toLowerCase().includes(searchQuery.toLowerCase()) || metadata.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const effectiveDisplayLimit = Math.min(displayLimit, filteredNFTs.length);
  const limitedNFTs = filteredNFTs.slice(0, effectiveDisplayLimit);
  const remainingCount = filteredNFTs.length - effectiveDisplayLimit;
  const hasMoreToShow = remainingCount > 0;

  const handleSeeMore = useCallback(() => {
    setDisplayLimit((prevLimit) => {
      const newLimit = prevLimit + INCREMENT_SIZE;
      return Math.min(newLimit, filteredNFTs.length);
    });
  }, [filteredNFTs.length]);

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    setDisplayLimit(8);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setDisplayLimit(8);
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setDisplayMode('loading');
      return;
    }

    if (isCacheChecked) {
      if (validNFTs.length > 0) {
        setDisplayMode('content');
        return;
      }

      if (!isLoading) {
        if (cachedNFTs.length > 0 && validNFTs.length > 0) {
          setDisplayMode('content');
        } else {
          setDisplayMode('empty');
        }
      } else {
        setDisplayMode(cachedNFTs.length > 0 && validNFTs.length > 0 ? 'content' : 'loading');
      }
    }
  }, [isLoading, validNFTs.length, isConnected, cachedNFTs.length, isCacheChecked]);

  const isContentLoading = isLoading && validNFTs.length === 0;

  return (
    <>
      {!isConnected ? (
        <ConnectWalletPrompt />
      ) : displayMode === 'empty' && isCacheChecked ? (
        <EmptyCollectionView />
      ) : (
        <section className="w-full py-16 bg-gradient-to-b from-background to-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
              <NFTCollectionHeader isLoading={isContentLoading} totalNFTs={validNFTs.length} filteredNFTs={filteredNFTs.length} />
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>

            <NFTGrid isLoading={isContentLoading} nfts={limitedNFTs} nftMetadata={nftMetadata} cachedNFTCount={Math.min(cachedNFTs.length, validNFTs.length)} onLoadMetadata={fetchTokenMetadata} />

            {!isLoading && hasMoreToShow && (
              <div className="flex justify-center mt-8">
                <Button onClick={handleSeeMore} variant="outline" className="px-6 py-2 rounded-full border border-primary text-primary hover:bg-primary/10">
                  See More NFTs ({remainingCount} remaining)
                </Button>
              </div>
            )}

            {!isLoading && filteredNFTs.length === 0 && searchQuery && <NoSearchResults onClear={handleClearSearch} />}

            <ExpandCollectionCTA />
          </div>
        </section>
      )}
    </>
  );
}

export default NFTGallery;
