import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface MintStatusHeaderProps {
  isConnected: boolean;
  isLoading: boolean;
  ownedNFTsLength: number;
  maxNftLimit: number;
}

export const MintStatusHeader = ({ isConnected, isLoading, ownedNFTsLength, maxNftLimit }: MintStatusHeaderProps) => {
  return (
    <div className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 relative px-4 md:px-6 flex items-center">
      <div className="flex space-x-2">
        <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
          <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
          <span className="text-white text-xs font-medium">Minting Now</span>
        </div>

        {isConnected && (
          <Link href="/gallery" className="group">
            <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 transition-colors cursor-pointer">
              {isLoading ? (
                <Skeleton className="h-5 w-24 bg-white/30 rounded-full" />
              ) : (
                <div className="flex items-center space-x-1 h-5">
                  <span className="text-white text-xs font-bold group-hover:pr-0.5 transition-padding duration-300">
                    {ownedNFTsLength === 0 ? 'No NFTs minted' : ownedNFTsLength === 1 ? '1 NFT minted' : `${ownedNFTsLength} / ${maxNftLimit} NFTs minted`}
                  </span>
                  <ArrowRight className="h-3 w-3 text-white opacity-70 group-hover:translate-x-0.5 transition-transform" />
                </div>
              )}
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};

export default MintStatusHeader;
