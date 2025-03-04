import { NFTCard } from '@/components/nft/card';
import MintSection from '@/components/nft/mint-section';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function MintPage() {
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

      <MintSection />

      <section className="w-full bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">My NFTs</h2>
            <Button variant="ghost" className="text-[#1967FF] flex items-center gap-2">
              View all
              <ArrowRight size={16} />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <NFTCard key={item} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
