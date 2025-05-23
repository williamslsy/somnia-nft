'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Loader2, Eye, Share2, Heart } from 'lucide-react';
import { NFTMetadata } from '@/services/getNFTMetadata';

import { Button } from '../ui/button';
import { Logo } from '../logo';
import { useNFTRarity } from '@/hooks/useNFTRarity';

interface NFTCardProps {
  tokenId?: bigint;
  metadata?: NFTMetadata;
  onLoad?: () => void;
}

export function NFTCard({ tokenId, metadata, onLoad }: NFTCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    if (tokenId && onLoad && !metadata) {
      onLoad();
    }
  }, [tokenId, metadata, onLoad]);

  const isLoading = tokenId && !metadata;

  const { label: rarityLabel, colorClass: rarityColorClass } = useNFTRarity(Number(tokenId));

  return (
    <div
      className="bg-background border border-border rounded-2xl overflow-hidden shadow-md transition-all duration-300 group hover:shadow-xl hover:border-primary/20"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent z-10"></div>

        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <Image
              src={metadata?.image || '/assets/placeholder.svg'}
              alt={metadata?.name || 'Devnet OG Somniac NFT'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div className={`absolute top-3 left-3 bg-background rounded-full px-3 py-1 shadow-md ${rarityColorClass}`}>
              <span className="text-xs font-bold">{rarityLabel}</span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-4 z-20 flex justify-center gap-2 transition-opacity duration-300" style={{ opacity: isHovered ? 1 : 0 }}>
              <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white">
                <Eye className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white" onClick={() => setIsFavorite(!isFavorite)}>
                <Heart className={`h-4 w-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="icon" variant="secondary" className="w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm hover:bg-primary hover:text-white">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </>
        )}
      </div>

      <div className="p-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold truncate">{metadata?.name || 'Devnet OG Somniac'}</h3>
          <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">#{tokenId ? tokenId.toString() : '0'}</span>
        </div>

        {metadata?.description && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{metadata.description}</p>}

        <div className="flex justify-between items-center pt-2 border-t border-border mt-2">
          <div className="flex items-center gap-2">
            <Logo width={60} height={60} />
          </div>
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">0.1111 STT</span>
          </div>
        </div>
      </div>
    </div>
  );
}
