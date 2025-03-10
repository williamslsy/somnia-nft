'use client';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { somnia } from '@/lib/chains';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

const config = getDefaultConfig({
  appName: 'Somnia NFT dApp',
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID || '',
  chains: [mainnet, somnia],
  ssr: true,
});

export default function WalletProvider({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize="compact">{mounted ? children : null}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
