import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/header';
import WalletProvider from '@/contexts/WalletProvider';
import { Toaster } from '@/components/ui/toaster';
import { NFTProvider } from '@/contexts/NFTProvider';
import { AccountProvider } from '@/contexts/AccountProvider';
import { TooltipProvider } from '@/components/ui/tooltip';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Devnet Mint | Somnia',
  description: 'Discover, collect, and sell extraordinary NFTs on the Somnia marketplace',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <WalletProvider>
          <AccountProvider>
            <NFTProvider>
              <TooltipProvider>
                <Header />
                {children}
              </TooltipProvider>
            </NFTProvider>
          </AccountProvider>
        </WalletProvider>
        <Toaster />
      </body>
    </html>
  );
}
