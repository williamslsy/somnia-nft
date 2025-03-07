'use client';
import { useState, useEffect } from 'react';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { toast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { useNFTContext } from '@/contexts/NFTProvider';
import { erc20ContractConfig } from '@/lib/config';
import { Loader2 } from 'lucide-react';

interface ERC20MinterProps {
  trigger?: React.ReactNode; // Custom trigger element
}

export function ERC20MinterDialog({ trigger }: ERC20MinterProps) {
  const [amount, setAmount] = useState<string>('1');
  const [isMinting, setIsMinting] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [open, setOpen] = useState(false);

  const { fetchERC20Balance } = useNFTContext();
  const { writeContract, data: hash, error, isPending: isWritePending } = useWriteContract();

  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
    hash,
    query: {
      enabled: !!hash,
    },
  });

  // Track transaction states
  useEffect(() => {
    if (isWritePending || isConfirming) {
      setIsPending(true);
    }

    if (error) {
      if (error.message?.includes('rejected') || error.message?.includes('denied') || error.message?.includes('cancelled')) {
        toast({
          title: 'Transaction Cancelled',
          description: 'You rejected the transaction',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: `Transaction failed: ${error.message?.substring(0, 100) || 'Unknown error'}`,
          variant: 'destructive',
        });
      }

      setIsMinting(false);
      setIsPending(false);
    }

    if (hash) {
      toast({
        title: 'Transaction Submitted',
        description: `Your IKOIN minting transaction is processing`,
        variant: 'success',
      });
    }

    if (isConfirming) {
      toast({
        title: 'Pending',
        description: 'Your transaction is being confirmed...',
        variant: 'success',
      });
    }

    if (isSuccess) {
      toast({
        title: 'Success',
        description: 'Transaction confirmed: Your IKOIN tokens have been minted',
        variant: 'success',
      });
      setIsMinting(false);
      setIsPending(false);

      // Reset form and close dialog after successful mint
      setAmount('1');
      setOpen(false);

      // Refresh the IKOIN balance
      fetchERC20Balance();
    }
  }, [hash, isConfirming, isSuccess, error, fetchERC20Balance, isWritePending]);

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
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      toast({
        title: 'Error',
        description: `Failed to mint IKOIN: ${message}`,
        variant: 'destructive',
      });
      setIsMinting(false);
      setIsPending(false);
    }
  };

  // Generate appropriate button text based on transaction state
  const getButtonText = () => {
    if (isMinting && !hash) return 'Submitting...';
    if (hash && isConfirming) return 'Confirming...';
    if (isMinting) return 'Minting...';
    return 'Mint IKOIN';
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        // Only allow closing if not in the middle of a transaction
        if (isMinting || isPending) {
          return;
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Get IKOIN Tokens</DialogTitle>
          <DialogDescription>Mint IKOIN tokens to use for NFT purchases</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center gap-3">
            <Input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} min="1" className="w-full" placeholder="Amount of IKOIN to mint" disabled={isMinting || isPending} />
          </div>
          <p className="text-sm text-muted-foreground">You need IKOIN tokens to mint NFTs using the ERC20 payment method.</p>
        </div>
        <DialogFooter>
          <Button onClick={handleMint} disabled={isMinting || isPending} className="w-full">
            {isMinting || isPending ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                {getButtonText()}
              </div>
            ) : (
              'Mint IKOIN'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
