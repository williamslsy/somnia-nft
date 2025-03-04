import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Devnet Mint | Somnia',
  description: 'Discover, collect, and sell extraordinary NFTs on the Somnia marketplace',
};

export default function MintPageLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
