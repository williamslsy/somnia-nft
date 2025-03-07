'use client';

import React from 'react';
import NFTGallery from '@/components/nft/nft-gallery';

export default function GalleryPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="w-full bg-gradient-to-b from-background to-[#1967FF]/5 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Your NFT Collection</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">View and manage your Somnia NFTs in one place</p>
          </div>
        </div>
      </section>

      <NFTGallery />
    </main>
  );
}
