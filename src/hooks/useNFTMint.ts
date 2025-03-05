import { useState, useEffect } from 'react';
import { useNFTContext } from '@/contexts/NFTProvider';

interface UseNFTMintProps {
  address?: string;
  isConnected: boolean;
}

export function useNFTMint({ address, isConnected }: UseNFTMintProps) {
  const { mintNativeToken, getNFTsOwned, isMinting } = useNFTContext();
  const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([]);
  const [mintAmount, setMintAmount] = useState(1);

  useEffect(() => {
    const fetchOwnedNFTs = async () => {
      if (isConnected && address) {
        try {
          const nfts = await getNFTsOwned(address as `0x${string}`);
          setOwnedNFTs(nfts);
        } catch (error) {
          console.error('Failed to fetch owned NFTs', error);
        }
      }
    };

    fetchOwnedNFTs();
  }, [isConnected, address, getNFTsOwned]);

  const handleMint = () => {
    if (isConnected) {
      mintNativeToken(mintAmount);
    }
  };

  const handleIncrementMint = () => {
    // Add max mint limit logic if needed
    setMintAmount((prev) => prev + 1);
  };

  const handleDecrementMint = () => {
    setMintAmount((prev) => Math.max(1, prev - 1));
  };

  return {
    ownedNFTs,
    mintAmount,
    isMinting,
    handleMint,
    handleIncrementMint,
    handleDecrementMint,
    mintPrice: 0.1111 * mintAmount,
  };
}
