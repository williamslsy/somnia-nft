'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { useNFT } from '@/hooks/useNFT';
import { useNFTContext } from '@/contexts/NFTProvider';

import MintStatusHeader from './mint-status-header';
import PaymentMethodTabs from './payment-method-tabs';
import MintControls from './mint-controls';
import TermsOfService from './terms-of-service';
import CollectionInfoFooter from './collection-info-footer';

import { useMintLimits } from '@/hooks/useMintLimits';
import { useMintAmount } from '@/hooks/useMintAmount';
import { Logo } from '../logo';
import NFTShowcase from './nft-showcase';

interface MintSectionProps {
  paymentMethod: 'native' | 'erc20';
  onPaymentMethodChange: (method: 'native' | 'erc20') => void;
}

function MintSection({ paymentMethod, onPaymentMethodChange }: MintSectionProps) {
  const { address, isConnected } = useAccount();
  const { isMinting, isApprovingERC20, hasERC20Approval } = useNFTContext();
  const [isERC20Minting, setIsERC20Minting] = useState(false);

  const { mintNativeToken, mintWithERC20, mintPrice, ownedNFTs, isLoading, isImageLoading, showcaseMetadata, erc20Balance, sttBalance, setMintAmount: setNFTMintAmount, tokenId } = useNFT();

  const { maxNftLimit, remainingMintAllowance, hasReachedMaxLimit, isLimitsLoading, refreshMintedCount } = useMintLimits({
    isConnected,
    address,
    ownedNFTsLength: ownedNFTs.length,
  });

  const { mintAmount, handleIncrementWithLimit, handleDecrementMint, resetMintAmount } = useMintAmount({
    isConnected,
    remainingMintAllowance,
    onMintComplete: () => {
      if (setNFTMintAmount) {
        setNFTMintAmount(1);
      }
    },
  });

  const calculatedMintPrice = 0.1111 * mintAmount;

  const currentHasEnoughSTT = useMemo(() => {
    const requiredAmount = calculatedMintPrice;
    return Number(sttBalance) >= requiredAmount;
  }, [sttBalance, calculatedMintPrice]);

  const currentHasEnoughERC20 = useMemo(() => {
    const requiredAmount = calculatedMintPrice;
    return Number(erc20Balance) >= requiredAmount;
  }, [erc20Balance, calculatedMintPrice]);

  useEffect(() => {
    if (isERC20Minting) {
      setIsERC20Minting(false);
    }
  }, [erc20Balance, isERC20Minting]);

  const handlePaymentMethodChange = (value: 'native' | 'erc20') => {
    onPaymentMethodChange(value);
  };

  const getERC20ButtonText = useCallback(() => {
    if (!isConnected) return 'Connect Wallet to Mint';
    if (isMinting) return 'Minting...';
    if (isApprovingERC20) return 'Approving IKOIN...';
    if (!currentHasEnoughERC20) return `Insufficient IKOIN Balance`;
    if (hasReachedMaxLimit) return `Maximum Limit (${maxNftLimit}) Reached`;
    return `Mint ${mintAmount} for ${calculatedMintPrice.toFixed(4)} IKOIN`;
  }, [isConnected, isMinting, isApprovingERC20, currentHasEnoughERC20, hasReachedMaxLimit, maxNftLimit, mintAmount, calculatedMintPrice]);

  const handleMint = useCallback(async () => {
    try {
      if (paymentMethod === 'native') {
        await mintNativeToken(mintAmount);
      } else {
        await mintWithERC20(mintAmount);
      }

      resetMintAmount();

      refreshMintedCount();
    } catch (error) {
      console.error('Minting failed:', error);
    }
  }, [paymentMethod, mintNativeToken, mintAmount, mintWithERC20, resetMintAmount, refreshMintedCount]);

  return (
    <section className="w-full py-6 md:py-12 px-4 bg-gradient-to-b from-background to-primary/5">
      <div className="max-w-6xl mx-auto">
        <div className="bg-card rounded-3xl overflow-hidden shadow-xl border border-border">
          <MintStatusHeader isConnected={isConnected} isLoading={isLoading || isLimitsLoading} ownedNFTsLength={ownedNFTs.length} maxNftLimit={maxNftLimit} />

          <div className="flex flex-col lg:flex-row">
            <div className="w-full lg:w-5/12 p-6 md:p-8">
              <NFTShowcase showcaseMetadata={showcaseMetadata} isLoading={isImageLoading} tokenId={tokenId} />
            </div>

            <div className="w-full lg:w-7/12 p-5 md:p-8">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-bold mb-2">Somnia Devnet NFT</h1>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-muted-foreground">by</span>
                  <Logo width={60} height={60} />
                  <span className="px-2 py-0.5 bg-primary/10 rounded-full text-xs text-primary font-medium">on Devnet</span>
                </div>

                <p className="text-foreground text-sm leading-relaxed hidden md:block">
                  Come break the devnet. Be one of the first to mint an NFT on Somnia! Join us starting December 18th for a thrilling 72-hour event where you can be among the first to mint your very
                  own &quot;Devnet OG Somniac&quot; NFT of Somnia Mascot on Somnia. These unique pixel art NFTs not only symbolize your early participation but also enhance your experience with a 30%
                  boost on Somnia Quest.
                </p>
              </div>

              <PaymentMethodTabs
                paymentMethod={paymentMethod}
                onPaymentMethodChange={handlePaymentMethodChange}
                isConnected={isConnected}
                mintPrice={mintPrice}
                sttBalance={sttBalance}
                hasEnoughSTT={currentHasEnoughSTT}
                erc20Balance={erc20Balance}
                hasEnoughERC20={currentHasEnoughERC20}
                hasERC20Approval={hasERC20Approval}
                isApprovingERC20={isApprovingERC20}
                isMinting={isMinting}
                isERC20Minting={isERC20Minting}
              />

              <div className="mt-auto">
                <MintControls
                  isConnected={isConnected}
                  mintAmount={mintAmount}
                  hasReachedMaxLimit={hasReachedMaxLimit}
                  remainingMintAllowance={remainingMintAllowance}
                  isMinting={isMinting}
                  isApprovingERC20={isApprovingERC20}
                  isERC20Minting={isERC20Minting}
                  onIncrement={handleIncrementWithLimit}
                  onDecrement={handleDecrementMint}
                  onMint={handleMint}
                  hasEnoughTokens={paymentMethod === 'native' ? currentHasEnoughSTT : currentHasEnoughERC20}
                  paymentMethod={paymentMethod}
                  maxNftLimit={maxNftLimit}
                  mintPrice={calculatedMintPrice}
                  getERC20ButtonText={getERC20ButtonText}
                />

                <TermsOfService />
              </div>
            </div>
          </div>

          <CollectionInfoFooter />
        </div>
      </div>
    </section>
  );
}

export default MintSection;
