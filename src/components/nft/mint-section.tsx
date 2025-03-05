'use client';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { NFTCard } from './card';
import { useNFT } from '@/hooks/useNFT';
import { Loader2 } from 'lucide-react';
import { useNFTContext } from '@/contexts/NFTProvider';

function MintSection() {
  const { isConnected } = useAccount();
  const { isMinting } = useNFTContext();
  const { mintAmount, mintNativeToken, handleIncrementMint, handleDecrementMint, mintPrice, ownedNFTs, nftMetadata, isLoading, fetchTokenMetadata, showcaseMetadata } = useNFT();

  const handleMint = useCallback(() => {
    if (isConnected) {
      mintNativeToken(mintAmount);
    }
  }, [isConnected, mintNativeToken, mintAmount]);

  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-card rounded-[32px] p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="rounded-[24px] bg-primary/5 aspect-square flex items-center justify-center overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <Image src={showcaseMetadata.image} alt={showcaseMetadata.name || 'Somnia Mascot Pixel Art'} width={400} height={400} className="object-contain w-4/5 h-4/5" />
                )}
              </div>
            </div>

            <div className="flex flex-col items-start mb-16">
              <div className="inline-flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 px-4 py-1.5 rounded-full mb-5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                Minting Now
              </div>

              <h2 className="text-3xl md:text-4xl font-bold mb-2">Somnia Devnet NFT</h2>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-muted-foreground">by</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs text-primary font-bold">S</span>
                  </div>
                  <span className="font-medium">somnia</span>
                </div>
                <span className="text-muted-foreground">on Devnet</span>
              </div>

              <p className="text-foreground mb-8 leading-relaxed">
                Come break the devnet. Be one of the first to mint an NFT on Somnia! Join us starting December 18th for a thrilling 72-hour event where you can be among the first to mint your very own
                &quot;Devnet OG Somniac&quot; NFT of Somnia Mascot on Somnia. These unique pixel art NFTs not only symbolize your early participation but also enhance your experience with a 30% boost
                on Somnia Quest.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={handleDecrementMint} disabled={!isConnected || mintAmount <= 1}>
                    -
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">{mintAmount}</div>
                  <Button variant="outline" size="icon" onClick={handleIncrementMint} disabled={!isConnected}>
                    +
                  </Button>
                </div>

                <Button disabled={!isConnected || isMinting} onClick={handleMint} className="btn-primary w-full py-2 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all">
                  {isMinting ? <>Minting...</> : isConnected ? `Mint ${mintAmount} for ${mintPrice.toFixed(4)} STT` : 'Connect Wallet to Mint'}
                </Button>
              </div>

              {isConnected && <div className="mt-6 text-muted-foreground">{ownedNFTs.length} NFTs minted</div>}
            </div>
          </div>
        </div>
      </div>

      {isConnected && ownedNFTs.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
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
      )}
    </section>
  );
}

export default MintSection;
