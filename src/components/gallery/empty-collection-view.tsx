'use client';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export const EmptyCollectionView = () => {
  return (
    <section className="w-full min-h-[80vh] py-24 flex items-center justify-center bg-gradient-to-b from-background to-muted/30">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="container max-w-lg mx-auto px-4 text-center">
        <div className="bg-background/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-border">
          <div className="mb-6">
            <Image src="/assets/empty-collection.svg" alt="No NFTs Found" width={160} height={160} className="w-40 h-40 mx-auto mb-4 opacity-80" />
          </div>
          <h3 className="text-2xl font-bold mb-4">Your Collection is Empty</h3>
          <p className="text-muted-foreground mb-8">Start your journey into the Somnia universe by minting your first NFT</p>
          <Link href="/mint">
            <Button className="w-full bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2.5 px-4 h-14 shadow-lg text-base transition-all duration-300 hover:scale-105">
              Mint Your First NFT
            </Button>
          </Link>
        </div>
      </motion.div>
    </section>
  );
};
