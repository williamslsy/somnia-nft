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

function NFTGallery() {
  const { isConnected, address } = useAccount();
  const { ownedNFTs, nftMetadata, fetchTokenMetadata, isLoading } = useNFT();
  const [searchQuery, setSearchQuery] = useState('');
  const [displayMode, setDisplayMode] = useState<'loading' | 'empty' | 'content'>('loading');

  const { cachedNFTs, isCacheChecked } = useNFTLocalStorage({
    isConnected,
    address,
    ownedNFTs,
  });

  const filteredNFTs = ownedNFTs.filter((tokenId) => {
    const metadata = nftMetadata[Number(tokenId)];
    if (!metadata || !searchQuery) return true;

    return metadata.name?.toLowerCase().includes(searchQuery.toLowerCase()) || metadata.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
  }, []);

  useEffect(() => {
    if (!isConnected) {
      setDisplayMode('loading');
      return;
    }

    if (isCacheChecked) {
      if (ownedNFTs.length > 0) {
        setDisplayMode('content');
        return;
      }

      if (!isLoading) {
        if (cachedNFTs.length > 0) {
          setDisplayMode('content');
        } else {
          setDisplayMode('empty');
        }
      } else {
        setDisplayMode(cachedNFTs.length > 0 ? 'content' : 'loading');
      }
    }
  }, [isLoading, ownedNFTs.length, isConnected, cachedNFTs.length, isCacheChecked]);

  const isContentLoading = isLoading || (ownedNFTs.length === 0 && cachedNFTs.length > 0);

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
              <NFTCollectionHeader isLoading={isContentLoading} totalNFTs={ownedNFTs.length} filteredNFTs={filteredNFTs.length} />
              <SearchBar value={searchQuery} onChange={handleSearchChange} />
            </div>

            <NFTGrid isLoading={isContentLoading} nfts={filteredNFTs} nftMetadata={nftMetadata} cachedNFTCount={cachedNFTs.length} onLoadMetadata={fetchTokenMetadata} />

            {!isLoading && filteredNFTs.length === 0 && searchQuery && <NoSearchResults onClear={handleClearSearch} />}

            <ExpandCollectionCTA />
          </div>
        </section>
      )}
    </>
  );
}

export default NFTGallery;
