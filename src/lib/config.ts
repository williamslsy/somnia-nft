import { ERC20TestIKOIN, SomniaTestNFT } from '@/constants/contracts';
import SomniaTestNFTAbi from '@/abis/SomniaTestNFTAbi.json';
import ERC20TestIKOINAbi from '@/abis/ERC20TestIKOINAbi.json';

export const sttContractConfig = {
  address: SomniaTestNFT as `0x${string}`,
  abi: SomniaTestNFTAbi,
};

export const erc20ContractConfig = {
  address: ERC20TestIKOIN as `0x${string}`,
  abi: ERC20TestIKOINAbi,
};
