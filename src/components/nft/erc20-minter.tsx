'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { useNFTContext } from '@/contexts/NFTProvider';
import { erc20ContractConfig } from '@/lib/config';

export function ERC20Minter() {
  const [amount, setAmount] = useState<string>('10');
  const [isMinting, setIsMinting] = useState(false);

  const { fetchERC20Balance } = useNFTContext();
  const { writeContract } = useWriteContract();

  const handleMint = async () => {
    try {
      setIsMinting(true);

      const mintAmount = parseInt(amount);
      if (isNaN(mintAmount) || mintAmount <= 0) {
        toast({
          title: 'Error',
          description: 'Please enter a valid amount',
          variant: 'destructive',
        });
        setIsMinting(false);
        return;
      }

      writeContract({
        ...erc20ContractConfig,
        functionName: 'mint',
        args: [mintAmount],
      });

      toast({
        title: 'Transaction Submitted',
        description: 'Your IKOIN minting transaction has been submitted',
        variant: 'default',
      });

      // Reset form after successful mint
      setAmount('10');

      // Refresh the balance after a delay to allow transaction to process
      setTimeout(() => {
        fetchERC20Balance();
      }, 5000);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to mint IKOIN: ${message}`,
        variant: 'destructive',
      });
    } finally {
      setIsMinting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Get IKOIN Tokens</CardTitle>
        <CardDescription>Mint IKOIN tokens to use for NFT purchases</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" className="w-full" placeholder="Amount of IKOIN to mint" />
            <Button onClick={handleMint} disabled={isMinting} className="whitespace-nowrap">
              {isMinting ? 'Minting...' : 'Mint IKOIN'}
            </Button>
          </div>
        </div>
      </CardContent>
      <CardFooter className="text-sm text-muted-foreground">You need IKOIN tokens to mint NFTs using the ERC20 payment method.</CardFooter>
    </Card>
  );
}
