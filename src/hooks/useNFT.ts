// 'use client';
// import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// import { useAccount } from 'wagmi';
// import { getNFTMetadata, getTokenBaseURI, NFTMetadata } from '@/lib/metadata';
// import { useNFTContext } from '@/contexts/NFTProvider';
// import { formatEther } from 'viem';

// export function useNFT() {
//   const { address, isConnected } = useAccount();
//   const {
//     mintNativeToken,
//     getNFTsOwned,
//     registerSuccessCallback,
//     unregisterSuccessCallback,

//     hasERC20Approval,
//     erc20Balance,
//     mintWithERC20,
//     isApprovingERC20,
//     sttBalance,
//   } = useNFTContext();

//   // Mint-related state
//   const [isImageLoading, setIsImageLoading] = useState(true);
//   const [mintAmount, setMintAmount] = useState(1);
//   const [ownedNFTs, setOwnedNFTs] = useState<bigint[]>([]);
//   const [paymentMethod, setPaymentMethod] = useState<'native' | 'erc20'>('native');

//   // Metadata-related state
//   const [nftMetadata, setNFTMetadata] = useState<Record<string, NFTMetadata>>({});
//   const [baseURI, setBaseURI] = useState<string>('');
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Use refs to track values without causing re-renders
//   const prevOwnedNFTsRef = useRef<bigint[]>([]);
//   const showcaseMetadataRef = useRef<NFTMetadata | null>(null);
//   const nextNftIdRef = useRef<number>(0);

//   // Track if we've loaded the initial data
//   const initialDataLoadedRef = useRef(false);

//   // Format ERC20 balance for display
//   const formattedERC20Balance = useMemo(() => {
//     return Number(formatEther(erc20Balance)).toFixed(4);
//   }, [erc20Balance]);

//   // Calculate if user has enough ERC20 tokens
//   const hasEnoughERC20 = useMemo(() => {
//     const requiredAmount = 0.1111 * mintAmount;
//     return Number(formatEther(erc20Balance)) >= requiredAmount;
//   }, [erc20Balance, mintAmount]);

//   const formattedSTTBalance = useMemo(() => {
//     return Number(formatEther(sttBalance)).toFixed(4);
//   }, [sttBalance]);

//   // Calculate if user has enough STT tokens
//   const hasEnoughSTT = useMemo(() => {
//     const requiredAmount = 0.1111 * mintAmount;
//     return Number(formatEther(sttBalance)) >= requiredAmount;
//   }, [sttBalance, mintAmount]);

//   // Calculate mint price - memoized
//   const mintPrice = useMemo(() => {
//     return 0.1111 * mintAmount;
//   }, [mintAmount]);

//   // Toggle payment method
//   const togglePaymentMethod = useCallback(() => {
//     setPaymentMethod((prev) => (prev === 'native' ? 'erc20' : 'native'));
//   }, []);

//   // Fetch base URI - only needs to run once
//   const fetchBaseURI = useCallback(async () => {
//     try {
//       const uri = await getTokenBaseURI();
//       setBaseURI(uri);
//     } catch (err) {
//       console.error('Error fetching base URI:', err);
//       setError('Failed to fetch base URI');
//     }
//   }, []);

//   // Fetch metadata for a specific token with optional force refresh flag
//   const fetchTokenMetadata = useCallback(async (tokenId: number, forceShowcaseUpdate = false) => {
//     try {
//       const metadata = await getNFTMetadata(tokenId);

//       setNFTMetadata((prev) => {
//         // Only update if metadata has changed or doesn't exist
//         if (!prev[tokenId] || JSON.stringify(prev[tokenId]) !== JSON.stringify(metadata)) {
//           return {
//             ...prev,
//             [tokenId]: metadata,
//           };
//         }
//         return prev;
//       });

//       // If this is the next NFT ID or we're forcing a showcase update
//       if (tokenId === nextNftIdRef.current || forceShowcaseUpdate) {
//         showcaseMetadataRef.current = metadata;
//       }

//       return metadata;
//     } catch (err) {
//       console.error(`Error fetching metadata for token ${tokenId}:`, err);
//       return null;
//     }
//   }, []);

//   // Updated fetchOwnedNFTs to avoid unnecessary re-renders
//   const fetchOwnedNFTs = useCallback(async () => {
//     if (!isConnected || !address) return;

//     // Only show loading state on initial load
//     if (!initialDataLoadedRef.current) {
//       setIsLoading(true);
//     }

//     try {
//       const nfts = await getNFTsOwned(address);

//       // Only update state if NFTs have actually changed to prevent re-renders
//       if (!areArraysEqual(nfts, prevOwnedNFTsRef.current)) {
//         setOwnedNFTs(nfts);
//         prevOwnedNFTsRef.current = nfts;

//         // Update the nextNftId ref when ownedNFTs change
//         if (nfts.length === 0) {
//           nextNftIdRef.current = 0;
//         } else {
//           // Find the maximum token ID and add 1
//           const maxTokenId = nfts.reduce((max, current) => {
//             return Number(current) > Number(max) ? current : max;
//           }, nfts[0]);
//           nextNftIdRef.current = Number(maxTokenId) + 1;
//         }

//         // This is a real change, we need to fetch the showcase metadata
//         if (nextNftIdRef.current !== undefined) {
//           fetchTokenMetadata(nextNftIdRef.current, true);
//         }
//       }
//     } catch (err) {
//       console.error('Error fetching owned NFTs:', err);
//       setError('Failed to fetch owned NFTs');
//     } finally {
//       if (!initialDataLoadedRef.current) {
//         setIsLoading(false);
//         initialDataLoadedRef.current = true;
//       }
//     }
//   }, [isConnected, address, getNFTsOwned, fetchTokenMetadata]);

//   // Helper function to check if two arrays of bigints are equal
//   const areArraysEqual = (arr1: bigint[], arr2: bigint[]) => {
//     if (arr1.length !== arr2.length) return false;
//     return arr1.every((val, idx) => val === arr2[idx]);
//   };

//   // Fetch metadata for all owned NFTs - optimized to avoid unnecessary fetches
//   const fetchAllOwnedNFTsMetadata = useCallback(async () => {
//     if (ownedNFTs.length === 0) return;

//     // This should only run when ownedNFTs actually changes
//     const metadataPromises = ownedNFTs.map((tokenId) => {
//       // Only fetch if we don't have the metadata already
//       if (!nftMetadata[Number(tokenId)]) {
//         return fetchTokenMetadata(Number(tokenId));
//       }
//       return Promise.resolve(nftMetadata[Number(tokenId)]);
//     });

//     try {
//       await Promise.all(metadataPromises);
//     } catch (err) {
//       console.error('Error fetching all NFT metadata:', err);
//       setError('Failed to fetch NFT metadata');
//     }
//   }, [ownedNFTs, nftMetadata, fetchTokenMetadata]);

//   // Custom increment handler
//   const handleIncrementMint = useCallback(() => {
//     setMintAmount((prev) => prev + 1);
//   }, []);

//   // Custom decrement handler
//   const handleDecrementMint = useCallback(() => {
//     setMintAmount((prev) => Math.max(1, prev - 1));
//   }, []);

//   // Register the refetch callback when the component mounts
//   useEffect(() => {
//     // This is the key part - we only want to refetch NFTs when minting is successful
//     registerSuccessCallback(fetchOwnedNFTs);

//     // Clean up when the component unmounts
//     return () => {
//       unregisterSuccessCallback();
//     };
//   }, [registerSuccessCallback, unregisterSuccessCallback, fetchOwnedNFTs]);

//   // Initial data fetching - only on connect/disconnect or address change
//   useEffect(() => {
//     fetchBaseURI();
//     fetchOwnedNFTs();
//   }, [isConnected, address, fetchBaseURI, fetchOwnedNFTs]);

//   // Fetch metadata for owned NFTs - only when ownedNFTs actually changes
//   useEffect(() => {
//     fetchAllOwnedNFTsMetadata();
//   }, [ownedNFTs, fetchAllOwnedNFTsMetadata]);

//   // Load the showcase image only once when the component mounts
//   useEffect(() => {
//     const loadShowcaseImage = async () => {
//       setIsImageLoading(true);
//       try {
//         // Initialize default showcase metadata if needed
//         if (!showcaseMetadataRef.current) {
//           showcaseMetadataRef.current = {
//             name: 'Somnia NFT',
//             description: 'A Somnia Devnet NFT',
//             image: '/assets/placeholder.svg',
//           };
//         }
//       } catch (error) {
//         console.error('Failed to load showcase image:', error);
//       } finally {
//         setIsImageLoading(false);
//       }
//     };

//     loadShowcaseImage();
//   }, []); // Empty dependency array means this runs once on mount

//   // Get showcase metadata without causing re-renders
//   const getShowcaseMetadata = useCallback(() => {
//     // If we have metadata for the next NFT, use it
//     if (nftMetadata[nextNftIdRef.current]) {
//       // Only update the ref if it's different to avoid unnecessary changes
//       if (JSON.stringify(showcaseMetadataRef.current) !== JSON.stringify(nftMetadata[nextNftIdRef.current])) {
//         showcaseMetadataRef.current = nftMetadata[nextNftIdRef.current];
//       }
//     }

//     // If we don't have a showcase metadata yet, use a default
//     if (!showcaseMetadataRef.current) {
//       showcaseMetadataRef.current = {
//         name: 'Somnia NFT',
//         description: 'A Somnia Devnet NFT',
//         image: '/assets/placeholder.svg',
//       };
//     }

//     return showcaseMetadataRef.current;
//   }, [nftMetadata]);

//   // Get the current showcase metadata
//   const showcaseMetadata = getShowcaseMetadata();

//   return {
//     // Minting-related returns
//     mintAmount,
//     setMintAmount,
//     mintNativeToken,
//     handleIncrementMint,
//     handleDecrementMint,
//     mintPrice,

//     // NFT ownership and metadata returns
//     ownedNFTs,
//     nftMetadata,
//     baseURI,
//     isImageLoading,
//     isLoading,
//     error,
//     nextNftId: nextNftIdRef.current,
//     showcaseMetadata,

//     // Utility methods
//     fetchTokenMetadata,
//     refetchOwnedNFTs: fetchOwnedNFTs,

//     paymentMethod,
//     togglePaymentMethod,
//     hasERC20Approval,
//     erc20Balance: formattedERC20Balance,
//     hasEnoughERC20,
//     isApprovingERC20,
//     mintWithERC20,
//     sttBalance: formattedSTTBalance,
//     hasEnoughSTT,
//   };
// }

// hooks/useNFT.ts - Compose the sub-hooks
// 'use client';
// import { useNFTMetadata } from './useNFTMetadata';
// import { useNFTOwnership } from './useNFTOwnership';
// import { useMintControls } from './useMintControls';

// export function useNFT() {
//   const metadata = useNFTMetadata();
//   const ownership = useNFTOwnership();
//   const mintControls = useMintControls();

//   const showcaseMetadata = metadata.getShowcaseMetadata(ownership.nextNftId);

//   return {
//     ...metadata,
//     ...ownership,
//     ...mintControls,

//     showcaseMetadata,

//     refetchOwnedNFTs: ownership.fetchOwnedNFTs,
//   };
// }

// 'use client';
// import { useMemo, useEffect, useState } from 'react';
// import { useNFTMetadata } from './useNFTMetadata';
// import { useNFTOwnership } from './useNFTOwnership';
// import { useMintControls } from './useMintControls';

// export function useNFT() {
//   const metadata = useNFTMetadata();
//   // Pass the fetchTokenMetadata function to useNFTOwnership so it can update metadata
//   // when NFTs change
//   const ownership = useNFTOwnership(metadata.fetchTokenMetadata);
//   const mintControls = useMintControls();

//   // Use a state to track the showcase metadata and force re-renders when needed
//   const [showcaseMetadataState, setShowcaseMetadataState] = useState(metadata.getShowcaseMetadata(ownership.nextNftId));

//   // Re-fetch the metadata when the NFT changed event is triggered
//   useEffect(() => {
//     if (ownership.nftChangedEvent) {
//       // Update the showcase metadata
//       metadata.setShowcaseMetadata(ownership.nftChangedEvent.nextNftId);
//     }
//   }, [ownership.nftChangedEvent, metadata]);

//   // Update the showcase metadata state when metadata update count changes
//   useEffect(() => {
//     setShowcaseMetadataState(metadata.getShowcaseMetadata(ownership.nextNftId));
//   }, [metadata.showcaseUpdateCount, ownership.nextNftId, metadata]);

//   // Also update when metadata changes
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       // Delayed update to ensure we have the latest metadata
//       setShowcaseMetadataState(metadata.getShowcaseMetadata(ownership.nextNftId));
//     }, 50);

//     return () => clearTimeout(timer);
//   }, [metadata.nftMetadata, ownership.nextNftId, metadata]);

//   // All owned NFTs have metadata
//   const fetchAllOwnedNFTsMetadata = useMemo(() => {
//     return async () => {
//       if (ownership.ownedNFTs.length === 0) return;

//       const promises = ownership.ownedNFTs.map((tokenId) => metadata.fetchTokenMetadata(Number(tokenId)));

//       try {
//         await Promise.all(promises);
//       } catch (err) {
//         console.error('Error fetching NFT metadata:', err);
//       }
//     };
//   }, [ownership.ownedNFTs, metadata]);

//   // Fetch metadata when owned NFTs change
//   useEffect(() => {
//     fetchAllOwnedNFTsMetadata();
//   }, [ownership.ownedNFTs, fetchAllOwnedNFTsMetadata]);

//   return {
//     // Spread all the properties from the sub-hooks
//     ...metadata,
//     ...ownership,
//     ...mintControls,

//     // Override with composed values
//     showcaseMetadata: showcaseMetadataState, // Use the state to ensure re-renders

//     // Maintain backwards compatibility with renamed methods
//     refetchOwnedNFTs: ownership.fetchOwnedNFTs,
//     fetchAllOwnedNFTsMetadata,
//   };
// }

'use client';
import { useMemo, useEffect, useState } from 'react';
import { useNFTMetadata } from './useNFTMetadata';
import { useNFTOwnership } from './useNFTOwnership';
import { useMintControls } from './useMintControls';

export function useNFT() {
  const metadata = useNFTMetadata();
  // Pass the fetchTokenMetadata function to useNFTOwnership so it can update metadata
  // when NFTs change
  const ownership = useNFTOwnership(metadata.fetchTokenMetadata);
  const mintControls = useMintControls();

  // Use a state to track the showcase metadata and force re-renders when needed
  const [showcaseMetadataState, setShowcaseMetadataState] = useState(metadata.getShowcaseMetadata(ownership.nextNftId));

  // Re-fetch the metadata when the NFT changed event is triggered
  useEffect(() => {
    if (ownership.nftChangedEvent) {
      // Update the showcase metadata
      metadata.setShowcaseMetadata(ownership.nftChangedEvent.nextNftId);
    }
  }, [ownership.nftChangedEvent, metadata]);

  // Update the showcase metadata state when metadata update count changes
  useEffect(() => {
    setShowcaseMetadataState(metadata.getShowcaseMetadata(ownership.nextNftId));
  }, [metadata.showcaseUpdateCount, ownership.nextNftId, metadata]);

  // Also update when metadata changes - immediate update without timeout
  useEffect(() => {
    setShowcaseMetadataState(metadata.getShowcaseMetadata(ownership.nextNftId));
  }, [metadata.nftMetadata, ownership.nextNftId, metadata]);

  // All owned NFTs have metadata
  const fetchAllOwnedNFTsMetadata = useMemo(() => {
    return async () => {
      if (ownership.ownedNFTs.length === 0) return;

      const promises = ownership.ownedNFTs.map((tokenId) => metadata.fetchTokenMetadata(Number(tokenId)));

      try {
        await Promise.all(promises);
      } catch (err) {
        console.error('Error fetching NFT metadata:', err);
      }
    };
  }, [ownership.ownedNFTs, metadata]);

  // Fetch metadata when owned NFTs change
  useEffect(() => {
    fetchAllOwnedNFTsMetadata();
  }, [ownership.ownedNFTs, fetchAllOwnedNFTsMetadata]);

  return {
    // Spread all the properties from the sub-hooks
    ...metadata,
    ...ownership,
    ...mintControls,

    // Override with composed values
    showcaseMetadata: showcaseMetadataState, // Use the state to ensure re-renders

    // Maintain backwards compatibility with renamed methods
    refetchOwnedNFTs: ownership.fetchOwnedNFTs,
    fetchAllOwnedNFTsMetadata,
  };
}
