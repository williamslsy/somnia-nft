'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ConnectButton } from '@rainbow-me/rainbowkit';

export const ConnectWalletPrompt = () => {
  return (
    <section className="w-full min-h-[80vh] py-24 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container max-w-lg mx-auto px-4 text-center">
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
          <div className="relative z-10">
            <p className="text-2xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-500">Connect your wallet to explore your exclusive Somnia NFTs</p>
          </div>
        </div>

        <div className="bg-background/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-border">
          <div className="mb-6">
            <Image src="/assets/wallet-illustration.svg" alt="Connect Wallet" width={128} height={128} className="w-32 h-32 mx-auto mb-4" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Connect Your Wallet</h3>
          <p className="text-muted-foreground mb-8">Unlock your personal gallery to view, manage, and showcase your NFT collection</p>
          <div className="flex items-center justify-center">
            <ConnectButton />
          </div>
        </div>
      </motion.div>
    </section>
  );
};
