import { NFTCard } from '@/components/nft/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';

export default function MarketplacePage() {
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

      <section className="w-full py-16 bg-gradient-to-b from-background to-[#1967FF]/5">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto bg-white rounded-[32px] p-8 md:p-12 shadow-sm overflow-hidden">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
              <div className="w-full md:w-2/5 flex-shrink-0">
                <div className="rounded-[24px] bg-[#D0EBFF] aspect-square flex items-center justify-center overflow-hidden">
                  <Image src="/assets/placeholder.svg" alt="Somnia Mascot Pixel Art" width={400} height={400} className="object-contain w-4/5 h-4/5" />
                </div>
              </div>

              <div className="flex flex-col items-start mb-16">
                <div className="inline-flex items-center gap-2 text-[#1967FF] text-sm font-medium bg-[#1967FF]/10 px-4 py-1.5 rounded-full mb-5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#1967FF] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#1967FF]"></span>
                  </span>
                  Minting Now
                </div>

                <h2 className="text-3xl md:text-4xl font-bold mb-2">Somnia Devnet NFT</h2>

                <div className="flex items-center gap-2 mb-6">
                  <span className="text-gray-500">by</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-[#1967FF]/20 flex items-center justify-center">
                      <span className="text-xs text-[#1967FF] font-bold">S</span>
                    </div>
                    <span className="font-medium">somnia</span>
                  </div>
                  <span className="text-gray-500">on Devnet</span>
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  Come break the devnet. Be one of the first to mint an NFT on Somnia! Join us starting December 18th for a thrilling 72-hour event where you can be among the first to mint your very
                  own &ldquo;Devnet OG Somniac&rdquo; NFT of Somnia Mascot on Somnia. These unique pixel art NFTs not only symbolize your early participation but also enhance your experience with a
                  30% boost on Somnia Quest.
                </p>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium">1</div>
                  </div>

                  <Button className="rounded-full bg-primary hover:bg-primary text-white px-4 py-2 h-auto text-base font-medium">Mint for 0.1111 STT</Button>
                </div>

                <div className="mt-6 text-gray-500">5478 minted</div>
              </div>
            </div>
          </div>
        </div>
      </section>

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
