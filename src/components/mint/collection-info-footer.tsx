import React from 'react';
import { Info } from 'lucide-react';

export const CollectionInfoFooter = () => {
  return (
    <div className="w-full px-5 py-6 md:px-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
      <div className="grid grid-cols-2 md:flex md:flex-wrap gap-y-4 gap-x-6">
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Collection Size</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">1,000 NFTs</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Mint Ends</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">March 21, 2025</p>
        </div>
        <div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">Creator Royalties</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">2.5%</p>
        </div>
        <div className="col-span-2 md:ml-auto mt-4 md:mt-0">
          <span className="flex items-center text-primary hover:underline text-sm">
            <Info className="h-4 w-4 mr-1" />
            View Collection Details
          </span>
        </div>
      </div>
    </div>
  );
};

export default CollectionInfoFooter;
