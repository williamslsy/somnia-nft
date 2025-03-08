'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useAccount } from 'wagmi';
import { getNFTMetadata, getTokenBaseURI, NFTMetadata } from '@/lib/metadata';
import { useNFTContext } from '@/contexts/NFTProvider';
import { formatEther } from 'viem';

export function useNFT() {
  const { address, isConnected } = useAccount();
  const {
    mintNativeToken,
    getNFTsOwned,
    registerSuccessCallback,
    unregisterSuccessCallback,

    hasERC20Approval,
    erc20Balance,
    mintWithERC20,
    isApprovingERC20,
    sttBalance,
  } = useNFTContext();

  // Mint-related state
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [mintAmount, setMintAmount] = useState(1);
  const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'native' | 'erc20'>('native');

  // Metadata-related state
  const [nftMetadata, setNFTMetadata] = useState<Record<string, NFTMetadata>>({});
  const [baseURI, setBaseURI] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Format ERC20 balance for display
  const formattedERC20Balance = useMemo(() => {
    return Number(formatEther(erc20Balance)).toFixed(4);
  }, [erc20Balance]);

  // Calculate if user has enough ERC20 tokens
  const hasEnoughERC20 = useMemo(() => {
    const requiredAmount = 0.1111 * mintAmount;
    return Number(formatEther(erc20Balance)) >= requiredAmount;
  }, [erc20Balance, mintAmount]);

  const formattedSTTBalance = useMemo(() => {
    return Number(formatEther(sttBalance)).toFixed(4);
  }, [sttBalance]);

  // Calculate if user has enough STT tokens
  const hasEnoughSTT = useMemo(() => {
    const requiredAmount = 0.1111 * mintAmount;
    return Number(formatEther(sttBalance)) >= requiredAmount;
  }, [sttBalance, mintAmount]);

  // Toggle payment method
  const togglePaymentMethod = useCallback(() => {
    setPaymentMethod((prev) => (prev === 'native' ? 'erc20' : 'native'));
  }, []);

  // Fetch base URI
  const fetchBaseURI = useCallback(async () => {
    try {
      const uri = await getTokenBaseURI();
      setBaseURI(uri);
    } catch (err) {
      console.error('Error fetching base URI:', err);
      setError('Failed to fetch base URI');
    }
  }, []);

  // Fetch owned NFTs
  const fetchOwnedNFTs = useCallback(async () => {
    if (!isConnected || !address) return;

    setIsLoading(true);
    try {
      const nfts = await getNFTsOwned(address);
      setOwnedNFTs(nfts);
    } catch (err) {
      console.error('Error fetching owned NFTs:', err);
      setError('Failed to fetch owned NFTs');
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, address, getNFTsOwned]);

  // Fetch metadata for a specific token
  const fetchTokenMetadata = useCallback(async (tokenId: number) => {
    try {
      const metadata = await getNFTMetadata(tokenId);
      setNFTMetadata((prev) => ({
        ...prev,
        [tokenId]: metadata,
      }));
      return metadata;
    } catch (err) {
      console.error(`Error fetching metadata for token ${tokenId}:`, err);
      return null;
    }
  }, []);

  // Fetch metadata for all owned NFTs
  const fetchAllOwnedNFTsMetadata = useCallback(async () => {
    if (ownedNFTs.length === 0) return;

    setIsLoading(true);
    try {
      const metadataPromises = ownedNFTs.map((tokenId) => fetchTokenMetadata(Number(tokenId)));
      await Promise.all(metadataPromises);
    } catch (err) {
      console.error('Error fetching all NFT metadata:', err);
      setError('Failed to fetch NFT metadata');
    } finally {
      setIsLoading(false);
    }
  }, [ownedNFTs, fetchTokenMetadata]);

  // Calculate the next NFT ID in the sequence
  const nextNftId = useMemo(() => {
    if (ownedNFTs.length === 0) return 0;

    // Find the maximum token ID and add 1
    const maxTokenId = ownedNFTs.reduce((max, current) => {
      return Number(current) > Number(max) ? current : max;
    }, ownedNFTs[0]);

    return Number(maxTokenId) + 1;
  }, [ownedNFTs]);

  // Custom increment handler that doesn't trigger showcase reload
  const handleIncrementMint = useCallback(() => {
    setMintAmount((prev) => prev + 1);
  }, []);

  // Custom decrement handler that doesn't trigger showcase reload
  const handleDecrementMint = useCallback(() => {
    setMintAmount((prev) => Math.max(1, prev - 1));
  }, []);

  // Register the refetch callback when the component mounts
  useEffect(() => {
    registerSuccessCallback(fetchOwnedNFTs);

    // Clean up when the component unmounts
    return () => {
      unregisterSuccessCallback();
    };
  }, [registerSuccessCallback, unregisterSuccessCallback, fetchOwnedNFTs]);

  // Initial data fetching
  useEffect(() => {
    fetchBaseURI();
    fetchOwnedNFTs();
  }, [isConnected, address, fetchBaseURI, fetchOwnedNFTs]);

  // Fetch metadata when owned NFTs change, but NOT when mintAmount changes
  useEffect(() => {
    fetchAllOwnedNFTsMetadata();

    // Also fetch the next NFT metadata to show in showcase
    if (nextNftId !== undefined) {
      fetchTokenMetadata(nextNftId);
    }
  }, [ownedNFTs, nextNftId, fetchAllOwnedNFTsMetadata, fetchTokenMetadata]); // Removed mintAmount from dependencies

  // Load the showcase image only once when the component mounts
  useEffect(() => {
    const loadShowcaseImage = async () => {
      setIsImageLoading(true);
      try {
        // Load your showcase metadata here
        // ...
      } catch (error) {
        console.error('Failed to load showcase image:', error);
      } finally {
        setIsImageLoading(false);
      }
    };

    loadShowcaseImage();
  }, []); // Empty dependency array means this runs once on mount

  // Calculate the showcase metadata - don't depend on mintAmount
  const showcaseMetadata = useMemo(() => {
    // If we have metadata for the next NFT, use it
    if (nftMetadata[nextNftId]) {
      return nftMetadata[nextNftId];
    }

    // Default metadata if nothing else is available
    return {
      name: 'Somnia NFT',
      description: 'A Somnia Devnet NFT',
      image: '/assets/placeholder.svg',
    };
  }, [nftMetadata, nextNftId]); // Removed mintAmount from dependencies

  // Wrapper for mintNativeToken that doesn't need to call refetchOwnedNFTs
  // since it will be called via the success callback
  // const handleMint = useCallback(
  //   (amount: number) => {
  //     return mintNativeToken(amount);
  //   },
  //   [mintNativeToken]
  // );

  return {
    // Minting-related returns
    mintAmount,
    setMintAmount,
    mintNativeToken,
    handleIncrementMint,
    handleDecrementMint,
    mintPrice: 0.1111 * mintAmount,

    // NFT ownership and metadata returns
    ownedNFTs,
    nftMetadata,
    baseURI,
    isImageLoading,
    isLoading,
    error,
    nextNftId,
    showcaseMetadata,

    // Utility methods
    fetchTokenMetadata,
    refetchOwnedNFTs: fetchOwnedNFTs,

    paymentMethod,
    togglePaymentMethod,
    hasERC20Approval,
    erc20Balance: formattedERC20Balance,
    hasEnoughERC20,
    isApprovingERC20,
    mintWithERC20,
    sttBalance: formattedSTTBalance,
    hasEnoughSTT,
  };
}
