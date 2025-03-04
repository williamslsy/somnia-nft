import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Marketplace | Somnia',
  description: 'Discover, collect, and sell extraordinary NFTs on the Somnia marketplace',
};

export default function MarketplaceLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
