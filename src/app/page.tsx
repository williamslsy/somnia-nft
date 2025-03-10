'use client';

import { Logo } from '@/components/logo';
import Image from 'next/image';
import Link from 'next/link';
import { useCountdown } from '@/hooks/useCountdown';

export default function Home() {
  const targetDate = new Date(2025, 2, 21);

  const timeLeft = useCountdown(targetDate);

  return (
    <main className="flex flex-col min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8 md:py-12 relative">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 relative">
          <div className="flex flex-col w-full lg:max-w-xl z-10 mb-12 lg:mb-0">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 md:mb-6 leading-tight">Mint Your Exclusive Somnia Devnet NFTs</h1>

            <p className="text-base sm:text-lg text-[#565656] mb-6 md:mb-8 leading-relaxed">
              Be among the first to mint a limited edition &quot;Devnet OG Somniac&quot; NFT on Somnia. These unique pixel art collectibles symbolize your early participation and grant you a 30% boost
              on Somnia Quest.
            </p>

            <div className="bg-primary text-white rounded-full py-3 sm:py-4 md:py-5 px-6 sm:px-8 md:px-10 inline-flex items-center justify-center mb-8 md:mb-12 w-fit hover:bg-opacity-90 transition-all duration-300">
              <Link href="/mint" className="text-lg sm:text-xl font-medium">
                Mint Now
              </Link>
            </div>

            <div className="flex flex-wrap gap-6 md:gap-8 lg:gap-16">
              <div className="flex flex-col">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  <span className="font-extrabold">1</span>k
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-[#565656]">Collection Size</p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  <span className="font-extrabold">50</span>+
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-[#565656]">NFTs Minted</p>
              </div>

              <div className="flex flex-col">
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">
                  <span className="font-extrabold">30</span>+
                </h3>
                <p className="text-sm sm:text-base md:text-lg text-[#565656]">Collectors</p>
              </div>
            </div>
          </div>

          <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[400px] h-[300px] sm:h-[360px] md:h-[440px] mx-auto lg:mx-0">
            <div className="absolute right-0 top-8 sm:top-10 md:top-12 z-10">
              <div className="w-[200px] sm:w-[250px] md:w-[310px] h-[220px] sm:h-[280px] md:h-[341px] rounded-[12px] sm:rounded-[16px] md:rounded-[19px] overflow-hidden bg-primary/10">
                <Image src="/assets/cover-image3.svg" alt="Somnia NFT Background" width={310} height={341} className="rounded-[12px] sm:rounded-[16px] md:rounded-[19px] object-cover w-full h-full" />
              </div>
            </div>

            <div className="absolute right-8 sm:right-10 md:right-12 top-4 sm:top-5 md:top-6 z-20">
              <div className="w-[230px] sm:w-[290px] md:w-[356px] h-[250px] sm:h-[320px] md:h-[392px] rounded-[14px] sm:rounded-[18px] md:rounded-[21px] overflow-hidden bg-primary/20">
                <Image src="/assets/cover-image2.svg" alt="Somnia NFT Middle" width={356} height={392} className="rounded-[14px] sm:rounded-[18px] md:rounded-[21px] object-cover w-full h-full" />
              </div>
            </div>

            <div className="absolute right-16 sm:right-20 md:right-24 top-0 z-30">
              <div className="w-[260px] sm:w-[330px] md:w-[400px] h-[280px] sm:h-[360px] md:h-[440px] rounded-[16px] sm:rounded-[20px] md:rounded-[24px] overflow-hidden bg-primary/30 relative">
                <Image src="/assets/cover-image.svg" alt="Featured Somnia NFT" width={400} height={440} className="rounded-[16px] sm:rounded-[20px] md:rounded-[24px] object-cover w-full h-full" />

                <div className="absolute top-4 sm:top-6 md:top-8 left-4 sm:left-6 md:left-8">
                  <h2 className="text-lg sm:text-xl md:text-[28px] font-bold text-white leading-tight">Devnet OG Somniac</h2>
                </div>

                <div className="absolute text-white font-bold top-12 sm:top-16 md:top-20 left-4 sm:left-6 md:left-8 flex items-center gap-2 sm:gap-3">
                  <Logo width={80} height={80} />
                  <span>Team</span>
                </div>

                <div className="absolute top-20 sm:top-24 md:top-32 right-4 sm:right-6 md:right-8">
                  <div className="w-[80px] h-[80px] sm:w-[100px] sm:h-[100px] md:w-[138px] md:h-[138px] flex items-center justify-center bg-primary/80 rounded-full text-white font-bold text-xs sm:text-sm md:text-lg text-center p-2 sm:p-3 md:p-4">
                    Limited
                    <br />
                    Edition
                  </div>
                </div>

                <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 left-1/2 transform -translate-x-1/2 w-[220px] sm:w-[280px] md:w-[348px] h-[60px] sm:h-[68px] md:h-[74px] bg-white/30 backdrop-blur-md rounded-lg md:rounded-xl">
                  <div className="flex justify-between items-center px-3 sm:px-4 md:px-6 py-2 sm:py-3 md:py-4">
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-xs text-white">Mint Price</span>
                      <div className="flex items-center gap-1">
                        <span className="text-xs sm:text-sm md:text-base text-white font-bold">0.1111 STT</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] sm:text-xs text-white">Event Ends in</span>
                      <span className="text-xs sm:text-sm md:text-base text-white">
                        <strong>{timeLeft.days}</strong>d <strong>{timeLeft.hours.toString().padStart(2, '0')}</strong>h <strong>{timeLeft.minutes.toString().padStart(2, '0')}</strong>m{' '}
                        <strong>{timeLeft.seconds.toString().padStart(2, '0')}</strong>s
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
