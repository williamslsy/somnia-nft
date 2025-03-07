'use client';
import React from 'react';
import { useAccount } from 'wagmi';
import { NFTCard } from './nft-card';
import { useNFT } from '@/hooks/useNFT';
import { Button } from '../ui/button';
import Link from 'next/link';

function NFTGallery() {
  const { isConnected } = useAccount();
  const { ownedNFTs, nftMetadata, fetchTokenMetadata } = useNFT();

  if (!isConnected) {
    return (
      <section className="w-full py-12 bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-6">Connect your wallet to view your NFT collection</p>
        </div>
      </section>
    );
  }

  if (ownedNFTs.length === 0) {
    return (
      <section className="w-full py-12 bg-muted/10">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-4">No NFTs Found</h3>
          <p className="text-muted-foreground mb-6">You don`t have any Somnia NFTs yet</p>
          <Link href="/mint">
            <Button className="btn-primary">Mint Your First NFT</Button>
          </Link>
        </div>
      </section>
    );
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
