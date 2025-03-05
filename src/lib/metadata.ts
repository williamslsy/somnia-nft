import { publicClient } from '@/constants/publicClient';
import { contractConfig } from './config';

export interface NFTMetadata {
  name: string;
  description: string;
  image: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

export async function getTokenBaseURI(): Promise<string> {
  try {
    const baseURI = await publicClient.readContract({
      ...contractConfig,
      functionName: 'baseURI',
    });

    return baseURI as string;
  } catch (err) {
    console.error('Error fetching base URI:', err);
    return ''; // Return empty string if there's an error
  }
}

export async function getTokenURI(tokenId: number): Promise<string> {
  try {
    const tokenURI = await publicClient.readContract({
      ...contractConfig,
      functionName: 'tokenURI',
      args: [BigInt(tokenId)],
    });

    return tokenURI as string;
  } catch (err) {
    console.error(`Error fetching token URI for token ${tokenId}:`, err);

    // Fallback: Try to construct the URI from baseURI + tokenId
    try {
      const baseURI = await getTokenBaseURI();
      if (baseURI) {
        return `${baseURI}${tokenId}`;
      }
    } catch (innerErr) {
      console.error('Error in fallback URI construction:', innerErr);
    }

    return ''; // Return empty string if we can't get the URI
  }
}

export async function getNFTMetadata(tokenId: number): Promise<NFTMetadata> {
  try {
    const baseURI = await getTokenBaseURI();

    // Special handling for DiceBear and other direct image services
    if (baseURI.includes('dicebear.com') || baseURI.includes('svg')) {
      // For DiceBear, the baseURI is directly pointing to an image generator
      // We'll create synthetic metadata with the direct image URL
      return {
        name: `Somnia NFT #${tokenId}`,
        description: 'A Somnia Devnet NFT',
        image: `${baseURI}${tokenId}`,
      };
    }

    // Standard metadata flow for JSON-based metadata
    const tokenURI = await getTokenURI(tokenId);

    if (!tokenURI) {
      throw new Error('Could not retrieve token URI');
    }

    // If URI is IPFS, convert to HTTP gateway URL
    const uri = tokenURI.startsWith('ipfs://') ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/') : tokenURI;

    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    // Try to parse as JSON, but handle case where response is direct image data
    try {
      const metadata = await response.json();

      // If the image is an IPFS URL, convert it to an HTTP gateway URL
      if (metadata.image && metadata.image.startsWith('ipfs://')) {
        metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }

      return metadata;
    } catch {
      // The response is not JSON, likely direct image data
      // Create synthetic metadata with the direct URI as the image
      return {
        name: `Somnia NFT #${tokenId}`,
        description: 'A Somnia Devnet NFT',
        image: uri,
      };
    }
  } catch (err) {
    console.error(`Error fetching metadata for token ${tokenId}:`, err);

    // Return fallback metadata with generated image
    // Using DiceBear since we know it works
    return {
      name: `Somnia NFT #${tokenId}`,
      description: 'A Somnia Devnet NFT',
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${tokenId}`,
    };
  }
}
