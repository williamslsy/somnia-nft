'use client';
import { useState } from 'react';
import { useWriteContract } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useNFTContext } from '@/contexts/NFTProvider';
import { erc20ContractConfig } from '@/lib/config';

interface ERC20MinterProps {
  trigger?: React.ReactNode; // Custom trigger element
}

export function ERC20MinterDialog({ trigger }: ERC20MinterProps) {
  const [amount, setAmount] = useState<string>('10');
  const [isMinting, setIsMinting] = useState(false);
  const [open, setOpen] = useState(false);

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

      // Reset form and close dialog after successful mint
      setAmount('10');
      setOpen(false);

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="text-sm font-medium">
            Mint IKOIN
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get IKOIN Tokens</DialogTitle>
          <DialogDescription>Mint IKOIN tokens to use for NFT purchases</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" className="w-full" placeholder="Amount of IKOIN to mint" />
          </div>
          <p className="text-sm text-muted-foreground">You need IKOIN tokens to mint NFTs using the ERC20 payment method.</p>
        </div>
        <DialogFooter>
          <Button onClick={handleMint} disabled={isMinting} className="w-full">
            {isMinting ? 'Minting...' : 'Mint IKOIN'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
