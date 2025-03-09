'use client';
import Image from 'next/image';
import React, { useCallback, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useNFT } from '@/hooks/useNFT';
import { PlusCircle, Loader2, Minus, Plus, Info, ExternalLink } from 'lucide-react';
import { useNFTContext } from '@/contexts/NFTProvider';
import { ERC20MinterDialog } from './erc20-minter-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { Logo } from '../ui/logo';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';

interface MintSectionProps {
  paymentMethod: 'native' | 'erc20';
  onPaymentMethodChange: (method: 'native' | 'erc20') => void;
}

const MAX_NFT_LIMIT = 50;

function MintSection({ paymentMethod, onPaymentMethodChange }: MintSectionProps) {
  const { isConnected } = useAccount();
  const { isMinting, isApprovingERC20, hasERC20Approval } = useNFTContext();
  const [isERC20Minting, setIsERC20Minting] = useState(false);
  const [prevConnected, setPrevConnected] = useState(isConnected);

  const {
    mintAmount,
    mintNativeToken,
    handleIncrementMint,
    handleDecrementMint,
    mintPrice,
    ownedNFTs,
    isLoading,
    isImageLoading,
    showcaseMetadata,

    erc20Balance,
    hasEnoughERC20,
    mintWithERC20,
    setMintAmount,
    sttBalance,
    hasEnoughSTT,
  } = useNFT();

  // Calculate the remaining NFTs the user can mint
  const remainingMintAllowance = MAX_NFT_LIMIT - ownedNFTs.length;

  // Check if user has reached their maximum limit
  const hasReachedMaxLimit = remainingMintAllowance <= 0;

  // Check if current mintAmount exceeds remaining allowance
  const exceedsRemainingAllowance = mintAmount > remainingMintAllowance;

  // Custom increment handler that respects maximum limits
  const handleIncrementWithLimit = useCallback(() => {
    if (mintAmount < remainingMintAllowance) {
      handleIncrementMint();
    }
  }, [mintAmount, remainingMintAllowance, handleIncrementMint]);

  // Effect to adjust mint amount if it exceeds remaining allowance
  useEffect(() => {
    if (isConnected && exceedsRemainingAllowance && setMintAmount && remainingMintAllowance > 0) {
      setMintAmount(remainingMintAllowance);
    }
  }, [isConnected, exceedsRemainingAllowance, remainingMintAllowance, setMintAmount]);

  // Existing effects...
  useEffect(() => {
    if (isERC20Minting) {
      setIsERC20Minting(false);
    }
  }, [erc20Balance, isERC20Minting]);

  useEffect(() => {
    // If previously connected and now disconnected, reset to 1
    if (prevConnected && !isConnected && setMintAmount) {
      setMintAmount(1);
    }

    // Update the previous connection state
    setPrevConnected(isConnected);
  }, [isConnected, prevConnected, setMintAmount]);

  const handlePaymentMethodChange = (value: string) => {
    onPaymentMethodChange(value as 'native' | 'erc20');
  };

  const handleMint = useCallback(async () => {
    try {
      if (paymentMethod === 'native') {
        await mintNativeToken(mintAmount);
      } else {
        await mintWithERC20(mintAmount);
      }

      if (typeof setMintAmount === 'function') {
        setMintAmount(1);
      }
    } catch (error) {
      console.error('Minting failed:', error);
    }
  }, [paymentMethod, mintNativeToken, mintAmount, mintWithERC20, setMintAmount]);

  const getERC20ButtonText = () => {
    if (!isConnected) return 'Connect Wallet to Mint';
    if (isMinting) return 'Minting...';
    if (isApprovingERC20) return 'Approving IKOIN...';
    if (!hasEnoughERC20) return `Insufficient IKOIN Balance`;
    if (hasReachedMaxLimit) return `Maximum Limit (50) Reached`;
    return `Mint ${mintAmount} for ${mintPrice.toFixed(4)} IKOIN`;
  };

  return (
    <section className="w-full py-6 md:py-12 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-3xl overflow-hidden shadow-xl border border-border">
          <div className="w-full h-14 bg-gradient-to-r from-primary to-primary/80 relative px-4 md:px-6 flex items-center">
            <div className="flex space-x-2">
              <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="h-2 w-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                <span className="text-white text-xs font-medium">Minting Now</span>
              </div>
              {isConnected && (
                <Link href="/gallery" className="group">
                  <div className="flex items-center bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 hover:bg-white/30 transition-colors cursor-pointer">
                    {isLoading ? (
                      <Skeleton className="h-5 w-24 bg-white/30 rounded-full" />
                    ) : (
                      <div className="flex items-center space-x-1">
                        <span className="text-white text-xs font-medium">
                          {ownedNFTs.length === 0 ? 'No NFTs minted' : ownedNFTs.length === 1 ? '1 NFT minted' : `${ownedNFTs.length} NFTs minted`}
                        </span>
                        <ExternalLink className="h-3 w-3 ml-1 text-white opacity-70 group-hover:opacity-100 transition-opacity" />
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row">
            <div className="hidden md:block w-full lg:w-5/12 p-6 md:p-8">
              <div className="aspect-square rounded-2xl overflow-hidden bg-primary/5 relative flex items-center justify-center group shadow-lg">
                {isImageLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-4/5 h-4/5 rounded-lg bg-muted/50 animate-pulse"></div>
                  </div>
                ) : (
                  <div className="w-4/5 h-4/5 rounded-lg overflow-hidden transition duration-300 group-hover:scale-105">
                    <Image src={showcaseMetadata.image} alt={showcaseMetadata.name || 'Somnia Mascot Pixel Art'} className="w-full h-full object-contain" width={400} height={400} priority />
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition duration-300"></div>

                <div className="absolute top-3 left-3 bg-background rounded-full px-3 py-1 shadow-md">
                  <span className="text-primary text-xs font-bold">Limited Edition</span>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-7/12 p-5 md:p-8">
              <div className="mb-6 md:block hidden">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Somnia Devnet NFT</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-muted-foreground">by</span>
                  <Logo width={60} height={60} />
                  <span className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary font-medium">on Devnet</span>
                </div>

                <p className="text-foreground text-sm leading-relaxed">
                  Come break the devnet. Be one of the first to mint an NFT on Somnia! Join us starting December 18th for a thrilling 72-hour event where you can be among the first to mint your very
                  own &quot;Devnet OG Somniac&quot; NFT of Somnia Mascot on Somnia. These unique pixel art NFTs not only symbolize your early participation but also enhance your experience with a 30%
                  boost on Somnia Quest.
                </p>
              </div>

              <div className="md:hidden mb-4">
                <h1 className="text-xl font-bold text-center">Somnia Devnet NFT</h1>
              </div>

              <Tabs defaultValue={paymentMethod} onValueChange={handlePaymentMethodChange} value={paymentMethod} className="w-full">
                <TabsList className="grid w-full grid-cols-2 px-1 h-auto">
                  <TabsTrigger
                    value="native"
                    className="rounded-lg py-2 text-sm font-medium
                  data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 
                  data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent
                  data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400
                  transition-all duration-200"
                  >
                    Mint with STT
                  </TabsTrigger>
                  <TabsTrigger
                    value="erc20"
                    className="rounded-lg py-2 text-sm font-medium
                  data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 
                  data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent
                  data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400
                  transition-all duration-200"
                  >
                    Mint with IKOIN
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="native" className="mt-4">
                  <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 mb-6">
                    <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Mint with native STT tokens</h3>
                    {isConnected ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} STT</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Your Balance:</span>
                          <span className={`text-sm ${!hasEnoughSTT ? 'text-destructive' : 'text-slate-700 dark:text-slate-300'}`}>{sttBalance} STT</span>
                        </div>
                        {!hasEnoughSTT && (
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Need more tokens?</span>
                            <a href="https://testnet.somnia.network/" target="_blank" rel="noopener noreferrer">
                              <Button size="sm" className="btn-primary text-white">
                                Get STT Tokens
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </a>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} STT</span>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="erc20" className="mt-4">
                  <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 mb-6">
                    <div className="flex justify-between">
                      <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Mint with IKOIN ERC20 tokens</h3>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className={`font-medium text-sm ${hasERC20Approval ? 'text-green-500' : 'text-amber-500'} cursor-help`}>{hasERC20Approval ? 'Approved ✓' : 'Approve ⚠️'}</span>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs">
                          {hasERC20Approval
                            ? 'You have approved the NFT contract to use your IKOIN tokens for minting.'
                            : 'Before minting with IKOIN, you need to approve the NFT contract to use your tokens. This is a one-time transaction required for security.'}
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    {isConnected ? (
                      <>
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
                          <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} IKOIN</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Your Balance:</span>
                          <span className={`text-sm ${!hasEnoughERC20 ? 'text-destructive' : 'text-slate-700 dark:text-slate-300'}`}>{erc20Balance} IKOIN</span>
                        </div>
                        {!hasEnoughERC20 && (
                          <div className="flex justify-between items-center mt-4">
                            <span className="text-sm text-slate-500 dark:text-slate-400">Need more tokens?</span>
                            <ERC20MinterDialog
                              trigger={
                                <Button size="sm" className="btn-primary text-white" disabled={isMinting || isApprovingERC20 || isERC20Minting}>
                                  {isERC20Minting ? (
                                    <>
                                      <Loader2 className="h-3 w-3 animate-spin" />
                                      Minting...
                                    </>
                                  ) : (
                                    <>
                                      Get IKOIN Tokens
                                      <PlusCircle className="h-3 w-3" />
                                    </>
                                  )}
                                </Button>
                              }
                            />
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
                        <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} IKOIN</span>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-auto">
                <div className="flex items-stretch gap-3 gap-x-1 sm:gap-3 mb-5">
                  <div className="flex items-center rounded-xl bg-slate-100 dark:bg-slate-800 p-0.5 sm:p-1 h-12 sm:h-14">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleDecrementMint}
                      disabled={!isConnected || mintAmount <= 1 || isMinting || isApprovingERC20 || isERC20Minting}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                    >
                      <Minus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                    <div className="w-10 sm:w-14 flex items-center justify-center text-base sm:text-lg font-semibold text-slate-900 dark:text-white">{mintAmount}</div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleIncrementWithLimit}
                      disabled={!isConnected || isMinting || isApprovingERC20 || isERC20Minting || hasReachedMaxLimit || mintAmount >= remainingMintAllowance}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-700"
                    >
                      <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
                    </Button>
                  </div>

                  {paymentMethod === 'native' ? (
                    <Button
                      disabled={!isConnected || isMinting || isERC20Minting || (isConnected && (!hasEnoughSTT || hasReachedMaxLimit))}
                      onClick={handleMint}
                      className="flex-1 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2 px-2 sm:px-4 h-12 sm:h-14 shadow-lg text-sm sm:text-base truncate"
                    >
                      {isMinting ? (
                        <>
                          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          <span className="truncate">Minting...</span>
                        </>
                      ) : isConnected ? (
                        !hasEnoughSTT ? (
                          <span className="truncate">Insufficient STT Balance</span>
                        ) : hasReachedMaxLimit ? (
                          <span className="truncate">Maximum Limit (50) Reached</span>
                        ) : (
                          <span className="truncate">{`Mint ${mintAmount} for ${mintPrice.toFixed(4)} STT`}</span>
                        )
                      ) : (
                        <span className="truncate">Connect Wallet to Mint</span>
                      )}
                    </Button>
                  ) : (
                    <Button
                      disabled={!isConnected || isMinting || isERC20Minting || (isConnected && (isApprovingERC20 || !hasEnoughERC20 || hasReachedMaxLimit))}
                      onClick={handleMint}
                      className="flex-1 bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2 px-2 sm:px-4 h-12 sm:h-14 shadow-lg text-sm sm:text-base truncate"
                    >
                      {isMinting ? (
                        <>
                          <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                          <span className="truncate">{getERC20ButtonText()}</span>
                        </>
                      ) : (
                        <span className="truncate">{getERC20ButtonText()}</span>
                      )}
                    </Button>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    By minting this NFT, you agree to our{' '}
                    <a href="#" className="text-primary hover:underline">
                      Terms of Service
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full px-5 py-6 md:px-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
            <div className="grid grid-cols-2 md:flex md:flex-wrap gap-y-4 gap-x-6">
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Collection Size</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">1,000 NFTs</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mint Ends</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">March 21, 2025</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Creator Royalties</p>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">2.5%</p>
              </div>
              <div className="col-span-2 md:ml-auto mt-4 md:mt-0">
                <button className="flex items-center text-primary hover:underline text-sm">
                  <Info className="h-4 w-4 mr-1" />
                  View Collection Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default MintSection;
