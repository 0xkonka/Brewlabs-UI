import { Skeleton } from "@components/ui/skeleton";

const CurrencySelectorSkeleton = ({ count }: { count: number }) => (
  <div className="w-full">
    {new Array(count).fill(null).map((_, index) => (
      <div key={index} className="flex items-center space-x-4 space-y-1 px-6 py-6 pl-0">
        <Skeleton className="h-12 w-12 rounded-full" />
        <div className="flex w-full justify-between">
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[150px]" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="ml-auto h-4 w-[80px]" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default CurrencySelectorSkeleton;
