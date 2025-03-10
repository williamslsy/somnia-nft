'use client';

import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Loader2, Coins, Check, TrendingUp } from 'lucide-react';
import { Slider } from '../ui/slider';
import { motion } from 'framer-motion';
import { useERC20Minter } from '@/hooks/useERC20Minter';

interface ERC20MinterProps {
  trigger?: React.ReactNode;
}

export function ERC20MinterDialog({ trigger }: ERC20MinterProps) {
  const [open, setOpen] = useState(false);

  const { amount, isMinting, isPending, isSuccess, handleMint, handleAmountChange, handleSliderChange, resetAmount, getButtonText } = useERC20Minter();

  useEffect(() => {
    if (isSuccess) {
      setOpen(false);
    }
  }, [isSuccess]);

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        if (isMinting || isPending) {
          return;
        }
        setOpen(newOpen);
      }}
    >
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Coins className="h-5 w-5 text-amber-500" />
            <span>Get IKOIN Tokens</span>
            {isSuccess && <Check className="h-5 w-5 text-green-500 ml-2" />}
          </DialogTitle>
          <DialogDescription>Mint IKOIN tokens to use for NFT purchases on the Somnia Devnet</DialogDescription>
        </DialogHeader>

        <div className="mt-2 mb-6 relative">
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Amount to mint</span>
                <span>{amount} IKOIN</span>
              </div>

              <Slider value={[parseInt(amount) || 1]} min={1} max={100} step={1} onValueChange={handleSliderChange} disabled={isMinting || isPending} className="py-2" />

              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>50</span>
                <span>100</span>
              </div>
            </div>

            <div>
              <label htmlFor="amount-input" className="text-sm font-medium">
                Or enter custom amount:
              </label>
              <div className="flex items-center mt-1 gap-2">
                <Input
                  id="amount-input"
                  type="number"
                  value={amount}
                  onChange={handleAmountChange}
                  min="1"
                  className="w-full"
                  placeholder="Amount of IKOIN to mint"
                  disabled={isMinting || isPending}
                />
                <Button variant="outline" size="sm" className="whitespace-nowrap" onClick={resetAmount} disabled={isMinting || isPending}>
                  Reset
                </Button>
              </div>
            </div>

            <div className="rounded-lg bg-muted p-3 text-sm">
              <div className="flex gap-2 items-start">
                <TrendingUp className="h-4 w-4 text-muted-foreground mt-0.5" />
                <p className="text-muted-foreground">You need IKOIN tokens to mint NFTs using the ERC20 payment method. These tokens are for testing purposes only on the Somnia devnet.</p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleMint} disabled={isMinting || isPending} className="w-full relative overflow-hidden">
            {isMinting && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
              />
            )}

            <div className="flex items-center justify-center gap-2">
              {isMinting || isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {getButtonText()}
                </>
              ) : (
                getButtonText()
              )}
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
