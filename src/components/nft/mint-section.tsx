'use client';
import Image from 'next/image';
import React, { useCallback } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { NFTCard } from './card';
import { useNFT } from '@/hooks/useNFT';
import { Loader2 } from 'lucide-react';
import { useNFTContext } from '@/contexts/NFTProvider';

interface MintSectionProps {
  paymentMethod: 'native' | 'erc20';
  onPaymentMethodChange: (method: 'native' | 'erc20') => void;
}

function MintSection({ paymentMethod, onPaymentMethodChange }: MintSectionProps) {
  const { isConnected } = useAccount();
  const { isMinting, isApprovingERC20 } = useNFTContext();

  const {
    mintAmount,
    mintNativeToken,
    handleIncrementMint,
    handleDecrementMint,
    mintPrice,
    ownedNFTs,
    nftMetadata,
    isLoading,
    fetchTokenMetadata,
    showcaseMetadata,
    hasERC20Approval,
    approveERC20,
    erc20Balance,
    hasEnoughERC20,
    mintWithERC20,
  } = useNFT();

  const handlePaymentMethodChange = (value: string) => {
    onPaymentMethodChange(value as 'native' | 'erc20');
  };

  const handleMint = useCallback(async () => {
    if (paymentMethod === 'native') {
      return mintNativeToken(mintAmount);
    } else {
      return mintWithERC20(mintAmount);
    }
  }, [paymentMethod, mintNativeToken, mintAmount, mintWithERC20]);

  return (
    <section className="w-full py-16 bg-gradient-to-b from-background to-primary/5">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto bg-card rounded-[32px] p-8 md:p-12 shadow-sm overflow-hidden">
          <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16">
            <div className="w-full md:w-2/5 flex-shrink-0">
              <div className="rounded-[24px] bg-primary/5 aspect-square flex items-center justify-center overflow-hidden">
                {isLoading ? (
                  <div className="flex items-center justify-center w-full h-full">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                  </div>
                ) : (
                  <Image src={showcaseMetadata.image} alt={showcaseMetadata.name || 'Somnia Mascot Pixel Art'} width={400} height={400} className="object-contain w-4/5 h-4/5" />
                )}
              </div>
            </div>

            <div className="flex flex-col items-start mb-16">
              <div className="flex gap-4">
                <div className="inline-flex items-center gap-2 text-primary text-sm font-medium bg-primary/10 px-4 py-1.5 rounded-full mb-5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                  </span>
                  Minting Now
                </div>
                <div className=" items-center gap-2 text-primary text-sm font-medium bg-primary/10 px-4 py-1.5 w-full rounded-full mb-5">
                  {isConnected && <div className="mt-6 text-muted-foreground">{ownedNFTs.length} NFTs minted</div>}
                </div>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">Somnia Devnet NFT</h2>

              <div className="flex items-center gap-2 mb-6">
                <span className="text-muted-foreground">by</span>
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-xs text-primary font-bold">S</span>
                  </div>
                  <span className="font-medium">somnia</span>
                </div>
                <span className="text-muted-foreground">on Devnet</span>
              </div>

              <p className="text-foreground mb-8 leading-relaxed">
                Come break the devnet. Be one of the first to mint an NFT on Somnia! Join us starting December 18th for a thrilling 72-hour event where you can be among the first to mint your very own
                &quot;Devnet OG Somniac&quot; NFT of Somnia Mascot on Somnia. These unique pixel art NFTs not only symbolize your early participation but also enhance your experience with a 30% boost
                on Somnia Quest.
              </p>

              <Tabs defaultValue={paymentMethod} className="w-full mb-6" onValueChange={handlePaymentMethodChange} value={paymentMethod}>
                <TabsList className="grid w-full grid-cols-2 mb-2">
                  <TabsTrigger value="native">Pay with STT</TabsTrigger>
                  <TabsTrigger value="erc20">Pay with IKOIN</TabsTrigger>
                </TabsList>

                <TabsContent value="native" className="mt-2">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm mb-2 text-muted-foreground">Pay with native STT tokens</p>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="font-semibold">{mintPrice.toFixed(4)} STT</span>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="erc20" className="mt-2">
                  <div className="p-4 bg-muted/30 rounded-lg">
                    <p className="text-sm mb-2 text-muted-foreground">Pay with IKOIN ERC20 tokens</p>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Price:</span>
                      <span className="font-semibold">{mintPrice.toFixed(4)} IKOIN</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Your Balance:</span>
                      <span className={`font-semibold ${!hasEnoughERC20 && 'text-destructive'}`}>{erc20Balance} IKOIN</span>
                    </div>
                    {!hasEnoughERC20 && <div className="text-xs text-destructive mt-1">Insufficient balance. Get IKOIN by calling the mint function.</div>}
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Approval:</span>
                      <span className={`font-semibold ${!hasERC20Approval && 'text-amber-500'}`}>{hasERC20Approval ? 'Approved ✓' : 'Required ⚠️'}</span>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 mb-6">
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="icon" onClick={handleDecrementMint} disabled={!isConnected || mintAmount <= 1}>
                    -
                  </Button>
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">{mintAmount}</div>
                  <Button variant="outline" size="icon" onClick={handleIncrementMint} disabled={!isConnected}>
                    +
                  </Button>
                </div>

                {paymentMethod === 'native' ? (
                  <Button disabled={!isConnected || isMinting} onClick={handleMint} className="btn-primary w-full py-2 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all">
                    {isMinting ? <>Minting...</> : isConnected ? `Mint ${mintAmount} for ${mintPrice.toFixed(4)} STT` : 'Connect Wallet to Mint'}
                  </Button>
                ) : (
                  <>
                    {!hasERC20Approval ? (
                      <Button
                        disabled={!isConnected || isApprovingERC20}
                        onClick={approveERC20}
                        variant="outline"
                        className="w-full py-2 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all"
                      >
                        {isApprovingERC20 ? 'Approving...' : 'Approve IKOIN'}
                      </Button>
                    ) : (
                      <Button
                        disabled={!isConnected || isMinting || !hasEnoughERC20}
                        onClick={handleMint}
                        className="btn-primary w-full py-2 h-auto text-base font-semibold shadow-sm hover:shadow-md transition-all"
                      >
                        {isMinting ? 'Minting...' : `Mint ${mintAmount} for ${mintPrice.toFixed(4)} IKOIN`}
                      </Button>
                    )}
                  </>
                )}
              </div>

              {isConnected && <div className="mt-6 text-muted-foreground">{ownedNFTs.length} NFTs minted</div>}
            </div>
          </div>
        </div>
      </div>

      {isConnected && ownedNFTs.length > 0 && (
        <div className="container mx-auto px-4 mt-12">
          <h3 className="text-2xl font-bold mb-6">Your Owned NFTs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {ownedNFTs.map((tokenId) => (
              <NFTCard
                key={tokenId.toString()}
                tokenId={tokenId}
                metadata={nftMetadata[Number(tokenId)]}
                onLoad={() => {
                  if (!nftMetadata[Number(tokenId)]) {
                    fetchTokenMetadata(Number(tokenId));
                  }
                }}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default MintSection;
