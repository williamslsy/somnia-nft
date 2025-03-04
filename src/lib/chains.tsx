import { defineChain } from 'viem';

export const somnia = defineChain({
  id: 50312,
  name: 'Somnia Testnet',
  network: 'somnia',
  nativeCurrency: {
    name: 'Somnia Token',
    symbol: 'STT',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://dream-rpc.somnia.network/'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Somnia Explorer',
      url: 'https://somnia-devnet.socialscan.io/',
    },
  },
});
