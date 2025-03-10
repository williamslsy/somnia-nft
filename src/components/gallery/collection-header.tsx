interface NFTCollectionHeaderProps {
  isLoading: boolean;
  totalNFTs: number;
  filteredNFTs: number;
}

export const NFTCollectionHeader = ({ isLoading, totalNFTs, filteredNFTs }: NFTCollectionHeaderProps) => {
  return (
    <div>
      <h2 className="text-3xl font-bold mb-2">Your NFT Collection</h2>
      <p className="text-muted-foreground">{isLoading ? 'Loading your collection...' : `Displaying ${filteredNFTs} of ${totalNFTs} NFTs`}</p>
    </div>
  );
};
