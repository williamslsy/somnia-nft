'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { NFTCard } from './nft-card';
import { useNFT } from '@/hooks/useNFT';

function NFTGallery() {
  const { isConnected } = useAccount();
  const { ownedNFTs, nftMetadata, fetchTokenMetadata } = useNFT();

  if (!isConnected || ownedNFTs.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 bg-muted/10">
      <div className="container mx-auto px-4">
        <h3 className="text-2xl font-bold mb-6">Your Owned NFTs</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ownedNFTs.map((tokenId) => (
            <NFTCard
              key={tokenId.toString()}
              tokenId={tokenId}
              metadata={nftMetadata[Number(tokenId)]}
              onLoad={() => {
                if (!nftMetadata[Number(tokenId)]) {
                  fetchTokenMetadata(Number(tokenId));
                }
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default NFTGallery;
