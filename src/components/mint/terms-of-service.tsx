import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="text-center">
      <p className="text-xs text-slate-500 dark:text-slate-400">
        By minting this NFT, you agree to our <span className="text-primary hover:underline">Terms of Service</span>
      </p>
    </div>
  );
};

export default TermsOfService;
