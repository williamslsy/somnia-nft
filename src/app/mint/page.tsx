'use client';

import React, { useState } from 'react';
import MintSection from '@/components/nft/mint-section';
import NFTGallery from '@/components/nft/nft-gallery';

export default function MintPage() {
  const [paymentMethod, setPaymentMethod] = useState<'native' | 'erc20'>('native');

  const handlePaymentMethodChange = (method: 'native' | 'erc20') => {
    setPaymentMethod(method);
  };

  return (
    <main className="flex flex-col min-h-screen">
      <section className="w-full bg-gradient-to-b from-background to-[#1967FF]/5 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Somnia Devnet NFT</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover, collect, and sell extraordinary NFTs on the Somnia marketplace</p>
          </div>
        </div>
      </section>

      <MintSection paymentMethod={paymentMethod} onPaymentMethodChange={handlePaymentMethodChange} />

      <NFTGallery />
    </main>
  );
}
