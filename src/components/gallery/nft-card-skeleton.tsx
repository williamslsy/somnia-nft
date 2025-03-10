import { Skeleton } from '@/components/ui/skeleton';

export const NFTCardSkeleton = () => {
  return (
    <div className="bg-background border border-border rounded-2xl overflow-hidden shadow-sm">
      <div className="relative aspect-square overflow-hidden">
        <Skeleton className="absolute inset-0 w-full h-full" />
      </div>
      <div className="p-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-6 w-2/3 rounded-md" />
          <Skeleton className="h-6 w-12 rounded-full" />
        </div>
        <div className="mt-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-md" />
          </div>
          <Skeleton className="h-5 w-16 rounded-md" />
        </div>
      </div>
    </div>
  );
};
