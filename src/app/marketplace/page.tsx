import { Button } from '@/components/ui/button';
import { ArrowRight, Clock, Info } from 'lucide-react';
import Image from 'next/image';

export default function MarketplacePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <section className="w-full bg-gradient-to-b from-background to-primary/5 py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center text-center mb-16">
            <div className="inline-flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 px-4 py-1.5 rounded-full mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Minting Now
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">Somnia Devnet NFT</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">Discover, collect, and sell extraordinary NFTs on the Somnia marketplace</p>
          </div>

          <div className="flex flex-col lg:flex-row items-center lg:items-start justify-center gap-12 lg:gap-20 max-w-6xl mx-auto">
            <div className="w-full max-w-md">
              <NFTCard />
            </div>

            <div className="flex flex-col justify-center lg:justify-start max-w-md lg:pt-8">
              <div className="space-y-6">
                <h2 className="text-3xl font-bold text-foreground">Come break the devnet!</h2>

                <div className="flex items-center gap-2 text-sm font-medium text-primary/90 bg-primary/5 px-3 py-1.5 rounded-full w-fit">
                  <Clock size={14} />
                  <span>Event starts December 18th • 72 hours only</span>
                </div>

                <p className="text-foreground text-lg leading-relaxed">
                  Be one of the first to mint an NFT on Somnia! Join us for a thrilling event where you can mint your very own &ldquo;Devnet OG Somniac&rdquo; NFT of Somnia Mascot.
                </p>

                <div className="bg-secondary/5 border border-secondary/10 rounded-xl p-4 flex items-start gap-3">
                  <Info size={20} className="text-secondary mt-0.5" />
                  <p className="text-foreground">
                    These unique pixel art NFTs symbolize your early participation and enhance your experience with a <span className="text-primary font-semibold">30% boost on Somnia Quest</span>.
                  </p>
                </div>

                <Button variant="outline" className="rounded-full group w-fit mt-2 flex items-center gap-2">
                  Learn more about Somnia Quest
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full bg-background py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-2xl font-bold">My NFTs</h2>
            <Button variant="ghost" className="text-primary flex items-center gap-2">
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

function NFTCard() {
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
        <Button className="w-full rounded-full py-6 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all">Mint for 0.1111 STT</Button>
      </div>
    </div>
  );
}
