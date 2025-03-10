import { Button } from '@/components/ui/button';

interface NoSearchResultsProps {
  onClear: () => void;
}

export const NoSearchResults = ({ onClear }: NoSearchResultsProps) => {
  return (
    <div className="text-center py-16">
      <h3 className="text-xl font-semibold mb-2">No matching NFTs found</h3>
      <p className="text-muted-foreground mb-4">Try adjusting your search criteria</p>
      <Button variant="outline" onClick={onClear} className="rounded-xl">
        Clear Search
      </Button>
    </div>
  );
};
