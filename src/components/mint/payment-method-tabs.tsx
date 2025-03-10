import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ExternalLink, PlusCircle, Loader2 } from 'lucide-react';
import { ERC20MinterDialog } from './erc20-minter-dialog';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

interface PaymentMethodTabsProps {
  paymentMethod: 'native' | 'erc20';
  onPaymentMethodChange: (method: 'native' | 'erc20') => void;
  isConnected: boolean;
  mintPrice: number;
  sttBalance: string;
  hasEnoughSTT: boolean;
  erc20Balance: string;
  hasEnoughERC20: boolean;
  hasERC20Approval: boolean;
  isApprovingERC20: boolean;
  isMinting: boolean;
  isERC20Minting: boolean;
}

export const PaymentMethodTabs = ({
  paymentMethod,
  onPaymentMethodChange,
  isConnected,
  mintPrice,
  sttBalance,
  hasEnoughSTT,
  erc20Balance,
  hasEnoughERC20,
  hasERC20Approval,
  isApprovingERC20,
  isMinting,
  isERC20Minting,
}: PaymentMethodTabsProps) => {
  const handlePaymentMethodChange = (value: string) => {
    onPaymentMethodChange(value as 'native' | 'erc20');
  };

  return (
    <Tabs defaultValue={paymentMethod} onValueChange={handlePaymentMethodChange} value={paymentMethod} className="w-full">
      <TabsList className="grid w-full grid-cols-2 px-1 h-auto">
        <TabsTrigger
          value="native"
          className="rounded-lg py-2 text-sm font-medium
        data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 
        data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent
        data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400
        transition-all duration-200"
        >
          Mint with STT
        </TabsTrigger>
        <TabsTrigger
          value="erc20"
          className="rounded-lg py-2 text-sm font-medium
        data-[state=active]:bg-white dark:data-[state=active]:bg-slate-900 
        data-[state=active]:shadow-sm data-[state=inactive]:bg-transparent
        data-[state=inactive]:text-slate-600 dark:data-[state=inactive]:text-slate-400
        transition-all duration-200"
        >
          Mint with IKOIN
        </TabsTrigger>
      </TabsList>

      <TabsContent value="native" className="mt-4">
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 mb-6">
          <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Mint with native STT tokens</h3>
          {isConnected ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} STT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Your Balance:</span>
                <span className={`text-sm ${!hasEnoughSTT ? 'text-destructive' : 'text-slate-700 dark:text-slate-300'}`}>{sttBalance} STT</span>
              </div>
              {!hasEnoughSTT && (
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Need more tokens?</span>
                  <a href="https://testnet.somnia.network/" target="_blank" rel="noopener noreferrer">
                    <Button size="sm" className="btn-primary text-white">
                      Get STT Tokens
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </a>
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} STT</span>
            </div>
          )}
        </div>
      </TabsContent>

      <TabsContent value="erc20" className="mt-4">
        <div className="bg-slate-50 dark:bg-slate-800/30 rounded-xl p-5 mb-6">
          <div className="flex justify-between">
            <h3 className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">Mint with IKOIN ERC20 tokens</h3>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className={`font-medium text-sm ${hasERC20Approval ? 'text-green-500' : 'text-amber-500'} cursor-help`}>{hasERC20Approval ? 'Approved ✓' : 'Approve ⚠️'}</span>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs">
                {hasERC20Approval
                  ? 'You have approved the NFT contract to use your IKOIN tokens for minting.'
                  : 'Before minting with IKOIN, you need to approve the NFT contract to use your tokens. This is a one-time transaction required for security.'}
              </TooltipContent>
            </Tooltip>
          </div>

          {isConnected ? (
            <>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} IKOIN</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Your Balance:</span>
                <span className={`text-sm ${!hasEnoughERC20 ? 'text-destructive' : 'text-slate-700 dark:text-slate-300'}`}>{erc20Balance} IKOIN</span>
              </div>
              {!hasEnoughERC20 && (
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Need more tokens?</span>
                  <ERC20MinterDialog
                    trigger={
                      <Button size="sm" className="btn-primary text-white" disabled={isMinting || isApprovingERC20 || isERC20Minting}>
                        {isERC20Minting ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin" />
                            Minting...
                          </>
                        ) : (
                          <>
                            Get IKOIN Tokens
                            <PlusCircle className="h-3 w-3" />
                          </>
                        )}
                      </Button>
                    }
                  />
                </div>
              )}
            </>
          ) : (
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Price:</span>
              <span className="text-lg font-semibold text-slate-900 dark:text-white">{mintPrice.toFixed(4)} IKOIN</span>
            </div>
          )}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodTabs;
