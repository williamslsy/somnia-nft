'use client';

import Image from 'next/image';

export function NFTCard() {
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="relative aspect-square overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10"></div>
        <Image src="/assets/placeholder.svg" alt="Devnet OG Somniac NFT" fill className="object-cover transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm text-xs font-semibold px-3 py-1.5 rounded-full z-20">Limited Edition</div>
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold">Devnet OG Somniac</h3>
          <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">#1</span>
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
              <span className="text-xs text-primary font-bold">S</span>
            </div>
            <span className="text-sm text-muted-foreground">Somnia</span>
          </div>
          <span className="text-sm font-medium">0.1111 STT</span>
        </div>
      </div>
    </div>
  );
}
