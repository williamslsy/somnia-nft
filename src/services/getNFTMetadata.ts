import { publicClient } from '@/constants/publicClient';
import { sttContractConfig } from '../lib/config';
import { cacheBaseURI, getCachedBaseURI, cacheNFTMetadata, getCachedNFTMetadata } from '../lib/nftMetadataCache';

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
  const cachedBaseURI = getCachedBaseURI();
  if (cachedBaseURI) {
    return cachedBaseURI;
  }

  try {
    const baseURI = await publicClient.readContract({
      ...sttContractConfig,
      functionName: 'baseURI',
    });

    const baseURIString = baseURI as string;

    cacheBaseURI(baseURIString);

    return baseURIString;
  } catch (err) {
    console.error('Error fetching base URI:', err);
    return '';
  }
}

export async function getTokenURI(tokenId: number): Promise<string> {
  try {
    const tokenURI = await publicClient.readContract({
      ...sttContractConfig,
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

function getIPFSGatewayURL(ipfsURI: string): string {
  if (!ipfsURI.startsWith('ipfs://')) return ipfsURI;
  return ipfsURI.replace('ipfs://', 'https://ipfs.io/ipfs/');
}

async function fetchWithTimeout(url: string, timeout = 10000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

export async function getNFTMetadata(tokenId: number): Promise<NFTMetadata> {
  const cachedMetadata = getCachedNFTMetadata(tokenId);
  if (cachedMetadata) {
    return cachedMetadata;
  }

  try {
    const baseURI = await getTokenBaseURI();

    if (baseURI.includes('dicebear.com') || baseURI.includes('svg')) {
      const metadata = {
        name: `Somnia NFT #${tokenId}`,
        description: 'A Somnia Devnet NFT',
        image: `${baseURI}${tokenId}`,
      };

      cacheNFTMetadata(tokenId, metadata);

      return metadata;
    }

    const tokenURI = await getTokenURI(tokenId);

    if (!tokenURI) {
      throw new Error('Could not retrieve token URI');
    }

    const uri = tokenURI.startsWith('ipfs://') ? getIPFSGatewayURL(tokenURI) : tokenURI;

    const response = await fetchWithTimeout(uri);

    if (!response.ok) {
      throw new Error(`Failed to fetch metadata: ${response.statusText}`);
    }

    try {
      const metadata = await response.json();

      if (metadata.image && metadata.image.startsWith('ipfs://')) {
        metadata.image = getIPFSGatewayURL(metadata.image);
      }

      cacheNFTMetadata(tokenId, metadata);

      return metadata;
    } catch {
      const fallback = {
        name: `Somnia NFT #${tokenId}`,
        description: 'A Somnia Devnet NFT',
        image: uri,
      };

      return fallback;
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

export async function getBatchNFTMetadata(tokenIds: number[]): Promise<Record<number, NFTMetadata>> {
  const result: Record<number, NFTMetadata> = {};

  const batchSize = 5;

  for (let i = 0; i < tokenIds.length; i += batchSize) {
    const batch = tokenIds.slice(i, i + batchSize);

    const promises = batch.map(async (tokenId) => {
      const metadata = await getNFTMetadata(tokenId);
      result[tokenId] = metadata;
    });

    await Promise.all(promises);
  }

  return result;
}
