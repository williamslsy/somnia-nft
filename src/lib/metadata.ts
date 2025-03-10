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
    return '';
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

    try {
      const baseURI = await getTokenBaseURI();
      if (baseURI) {
        return `${baseURI}${tokenId}`;
      }
    } catch (innerErr) {
      console.error('Error in fallback URI construction:', innerErr);
    }

    return '';
  }
}

export async function getNFTMetadata(tokenId: number): Promise<NFTMetadata> {
  try {
    const baseURI = await getTokenBaseURI();

    if (baseURI.includes('dicebear.com') || baseURI.includes('svg')) {
      return {
        name: `Somnia NFT #${tokenId}`,
        description: 'A Somnia Devnet NFT',
        image: `${baseURI}${tokenId}`,
      };
    }

    const tokenURI = await getTokenURI(tokenId);

    if (!tokenURI) {
      throw new Error('Could not retrieve token URI');
    }

    const uri = tokenURI.startsWith('ipfs://') ? tokenURI.replace('ipfs://', 'https://ipfs.io/ipfs/') : tokenURI;

    const response = await fetch(uri);

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    try {
      const metadata = await response.json();

      if (metadata.image && metadata.image.startsWith('ipfs://')) {
        metadata.image = metadata.image.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }

      return metadata;
    } catch {
      return {
        name: `Somnia NFT #${tokenId}`,
        description: 'A Somnia Devnet NFT',
        image: uri,
      };
    }
  } catch (err) {
    console.error(`Error fetching metadata for token ${tokenId}:`, err);

    return {
      name: `Somnia NFT #${tokenId}`,
      description: 'A Somnia Devnet NFT',
      image: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${tokenId}`,
    };
  }
}
