import React, { memo } from 'react';
import Image from 'next/image';
import { NFTMetadata } from '@/services/getNFTMetadata';
import { Loader2 } from 'lucide-react';
import { useNFTRarity } from '@/hooks/useNFTRarity';

interface NFTShowcaseProps {
  showcaseMetadata: NFTMetadata | null;
  isLoading: boolean;
  tokenId?: number;
}

const NFTShowcase = memo(({ showcaseMetadata, isLoading, tokenId }: NFTShowcaseProps) => {
  const { label: rarityLabel, colorClass: rarityColorClass } = useNFTRarity(tokenId);

  return (
    <div className="aspect-square rounded-2xl overflow-hidden bg-primary/5 relative flex items-center justify-center group shadow-lg">
      {isLoading || !showcaseMetadata ? (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="w-4/5 h-4/5 rounded-lg overflow-hidden transition duration-300 group-hover:scale-105">
            <Image src={showcaseMetadata.image} alt={showcaseMetadata.name} className="w-full h-full object-contain" width={400} height={400} priority />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>
        </>
      )}

      {showcaseMetadata && (
        <div className={`absolute top-3 left-3 bg-background rounded-full px-3 py-1 shadow-md ${rarityColorClass}`}>
          <span className="text-xs font-bold">{rarityLabel}</span>
        </div>
      )}
    </div>
  );
});

NFTShowcase.displayName = 'NFTShowcase';

export default NFTShowcase;
