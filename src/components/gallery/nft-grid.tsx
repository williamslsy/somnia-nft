import { motion } from 'framer-motion';
import { NFTCard } from './nft-card';

import { NFTMetadata } from '@/services/getNFTMetadata';
import { NFTCardSkeleton } from './nft-card-skeleton';

interface NFTGridProps {
  isLoading: boolean;
  nfts: bigint[];
  nftMetadata: Record<string, NFTMetadata>;
  cachedNFTCount: number;
  onLoadMetadata: (tokenId: number) => void;
}

export const NFTGrid = ({ isLoading, nfts, nftMetadata, cachedNFTCount, onLoadMetadata }: NFTGridProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {isLoading
        ? Array.from({ length: cachedNFTCount || 4 }).map((_, index) => (
            <motion.div key={`skeleton-${index}`} variants={cardVariants}>
              <NFTCardSkeleton />
            </motion.div>
          ))
        : nfts.map((tokenId) => (
            <motion.div key={tokenId.toString()} variants={cardVariants}>
              <NFTCard
                tokenId={tokenId}
                metadata={nftMetadata[Number(tokenId)]}
                onLoad={() => {
                  if (!nftMetadata[Number(tokenId)]) {
                    onLoadMetadata(Number(tokenId));
                  }
                }}
              />
            </motion.div>
          ))}
    </motion.div>
  );
};
