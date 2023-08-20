import { Skeleton } from './ui/skeleton';

export default function LoadingSkeleton() {
  return (
    <div className="container bg-white flex justify-center">
      <div className="flex mt-5 space-x-4 w-11/12 sm:w-3/4">
        <Skeleton className="h-16 w-16 rounded-full" />
        <div className="space-y-2 w-full">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    </div>
  );
}
