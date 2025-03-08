'use client';
import React, { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { NFTCard } from './nft-card';
import { useNFT } from '@/hooks/useNFT';
import { Button } from '../ui/button';
import Link from 'next/link';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import { Grid3X3, Loader2, Rows3, Search } from 'lucide-react';
import { Logo } from '../ui/logo';
import Image from 'next/image';
import { NFTMetadata } from '@/lib/metadata';

function NFTGallery() {
  const { isConnected } = useAccount();
  const { ownedNFTs, nftMetadata, fetchTokenMetadata } = useNFT();
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid');

  // Animation variants for cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
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

  // Filter NFTs based on search query
  const filteredNFTs = ownedNFTs.filter((tokenId) => {
    const metadata = nftMetadata[Number(tokenId)];
    if (!metadata || !searchQuery) return true;

    return metadata.name.toLowerCase().includes(searchQuery.toLowerCase()) || metadata.description?.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (!isConnected) {
    return (
      <section className="w-full min-h-[80vh] py-24 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container max-w-lg mx-auto px-4 text-center">
          <div className="mb-8 relative">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="relative z-10">
              {/* <h2 className="text-4xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Your NFT Collection</h2> */}
              <p className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Connect your wallet to explore your exclusive Somnia NFTs</p>
            </div>
          </div>

          <div className="bg-background/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-border">
            <div className="mb-6">
              <Image src="/assets/wallet-illustration.svg" alt="Connect Wallet" width={128} height={128} className="w-32 h-32 mx-auto mb-4" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
            <p className="text-muted-foreground mb-8">Unlock your personal gallery to view, manage, and showcase your NFT collection</p>
            <div className="flex items-center justify-center">
              <ConnectButton />
            </div>
          </div>
        </motion.div>
      </section>
    );
  }

  if (ownedNFTs.length === 0) {
    return (
      <section className="w-full min-h-[80vh] py-24 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container max-w-lg mx-auto px-4 text-center">
          <div className="bg-background/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-border">
            <div className="mb-6">
              <Image src="/assets/empty-collection.svg" alt="No NFTs Found" width={160} height={160} className="w-40 h-40 mx-auto mb-4 opacity-80" />
            </div>
            <h3 className="text-2xl font-bold mb-4">Your Collection is Empty</h3>
            <p className="text-muted-foreground mb-8">Start your journey into the Somnia universe by minting your first NFT</p>
            <Link href="/mint">
              <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2.5 px-4 h-14 shadow-lg text-base transition-all duration-300 hover:scale-105">
                Mint Your First NFT
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold mb-2">Your NFT Collection</h2>
            <p className="text-muted-foreground">
              Displaying {filteredNFTs.length} of {ownedNFTs.length} NFTs
            </p>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none md:min-w-[240px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search your collection..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-background border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              />
            </div>

            <div className="flex items-center border border-border rounded-xl overflow-hidden">
              <Button variant="ghost" size="icon" onClick={() => setViewMode('grid')} className={`rounded-none h-10 w-10 ${viewMode === 'grid' ? 'bg-primary/10 text-primary' : ''}`}>
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => setViewMode('list')} className={`rounded-none h-10 w-10 ${viewMode === 'list' ? 'bg-primary/10 text-primary' : ''}`}>
                <Rows3 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'grid' ? (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNFTs.map((tokenId) => (
              <motion.div key={tokenId.toString()} variants={cardVariants}>
                <NFTCard
                  tokenId={tokenId}
                  metadata={nftMetadata[Number(tokenId)]}
                  onLoad={() => {
                    if (!nftMetadata[Number(tokenId)]) {
                      fetchTokenMetadata(Number(tokenId));
                    }
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-4">
            {filteredNFTs.map((tokenId) => (
              <motion.div key={tokenId.toString()} variants={cardVariants}>
                <NFTCardListView
                  tokenId={tokenId}
                  metadata={nftMetadata[Number(tokenId)]}
                  onLoad={() => {
                    if (!nftMetadata[Number(tokenId)]) {
                      fetchTokenMetadata(Number(tokenId));
                    }
                  }}
                />
              </motion.div>
            ))}
          </motion.div>
        )}

        {filteredNFTs.length === 0 && searchQuery && (
          <div className="text-center py-16">
            <h3 className="text-xl font-semibold mb-2">No matching NFTs found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
            <Button variant="outline" onClick={() => setSearchQuery('')} className="rounded-xl">
              Clear Search
            </Button>
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="inline-block bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-border">
            <h3 className="text-xl font-semibold mb-3">Expand Your Collection</h3>
            <p className="text-muted-foreground mb-4">Discover the latest Somnia NFTs and add to your growing collection</p>
            <Link href="/mint">
              <Button className="bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2.5 px-6 h-12 shadow-lg text-base transition-all duration-300 hover:scale-105">
                Mint New NFTs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

interface NFTCardListViewProps {
  tokenId: bigint;
  metadata?: NFTMetadata;
  onLoad: () => void;
}

function NFTCardListView({ tokenId, metadata, onLoad }: NFTCardListViewProps) {
  useEffect(() => {
    if (tokenId && onLoad && !metadata) {
      onLoad();
    }
  }, [tokenId, metadata, onLoad]);

  const isLoading = tokenId && !metadata;

  return (
    <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex flex-col md:flex-row">
        <div className="relative w-full md:w-48 h-48">
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
          {isLoading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <Image
              src={metadata?.image || '/assets/placeholder.svg'}
              alt={metadata?.name || 'Devnet OG Somniac NFT'}
              width={192}
              height={192}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          )}
          <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full z-20">Limited Edition</div>
        </div>

        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">{metadata?.name || 'Devnet OG Somniac'}</h3>
              <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">#{tokenId ? tokenId.toString() : '0'}</span>
            </div>
            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{metadata?.description || 'A limited edition Somnia NFT from the Devnet OG collection.'}</p>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Logo width={80} height={80} />
              <div>
                <p className="text-sm font-medium">OG Collection</p>
              </div>
            </div>
            <span className="text-sm font-medium">0.1111 STT</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NFTGallery;
