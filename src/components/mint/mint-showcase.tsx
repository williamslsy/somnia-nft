import React from 'react';
import { Logo } from '../logo';
import NFTShowcase from './nft-showcase';
import { NFTMetadata } from '@/services/getNFTMetadata';

interface MintShowcaseProps {
  showcaseMetadata: NFTMetadata | null;
  isImageLoading: boolean;
}

export const MintShowcase = ({ showcaseMetadata, isImageLoading }: MintShowcaseProps) => {
  return (
    <>
      <NFTShowcase showcaseMetadata={showcaseMetadata} isLoading={isImageLoading} />

      <div className="mt-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Somnia Devnet NFT</h1>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-muted-foreground">by</span>
          <Logo width={60} height={60} />
          <span className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary font-medium">on Devnet</span>
        </div>

        <p className="text-foreground text-sm leading-relaxed">
          Come break the devnet. Be one of the first to mint an NFT on Somnia! Join us starting December 18th for a thrilling 72-hour event where you can be among the first to mint your very own
          &quot;Devnet OG Somniac&quot; NFT of Somnia Mascot on Somnia. These unique pixel art NFTs not only symbolize your early participation but also enhance your experience with a 30% boost on
          Somnia Quest.
        </p>
      </div>
    </>
  );
};

export default MintShowcase;
