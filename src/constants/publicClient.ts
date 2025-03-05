import { somnia } from '@/lib/chains';
import { createPublicClient, http } from 'viem';

export const publicClient = createPublicClient({
  chain: somnia,
  transport: http(),
});
