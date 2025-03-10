import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const ExpandCollectionCTA = () => {
  return (
    <div className="mt-12 text-center">
      <div className="inline-block bg-background/80 backdrop-blur-sm rounded-xl p-6 border border-border">
        <h3 className="text-xl font-semibold mb-3">Expand Your Collection</h3>
        <p className="text-muted-foreground mb-4">Discover the latest Somnia NFTs and add to your growing collection</p>
        <Link href="/mint">
          <Button className="bg-primary hover:bg-primary/90 rounded-xl text-white font-semibold py-2.5 px-6 h-12 shadow-lg text-base transition-all duration-300 hover:scale-105">Mint New NFTs</Button>
        </Link>
      </div>
    </div>
  );
};
