import { Skeleton } from "@/components/ui/skeleton";

interface ProductCardSkeletonProps {
  count?: number;
  variant?: "grid" | "featured";
}

export function ProductCardSkeleton({ count = 3, variant = "grid" }: ProductCardSkeletonProps) {
  const skeletons = Array.from({ length: count });

  if (variant === "featured") {
    return (
      <div className="grid md:grid-cols-3 gap-8">
        {skeletons.map((_, index) => (
          <div
            key={index}
            className="bg-[#F9F9F6] rounded-3xl overflow-hidden"
          >
            {/* Image Skeleton */}
            <div className="relative aspect-square overflow-hidden bg-gray-200">
              <Skeleton className="w-full h-full rounded-none bg-gray-300" />
            </div>

            {/* Content Skeleton */}
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-3/4 bg-gray-300" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-5/6 bg-gray-200" />
                <Skeleton className="h-4 w-4/6 bg-gray-200" />
              </div>
              <Skeleton className="h-10 w-full rounded-full bg-gray-300" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Grid variant (for products page)
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 justify-items-center">
      {skeletons.map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-xl overflow-hidden flex flex-col shadow-sm"
          style={{ width: '378px', height: '486px', minWidth: '378px', minHeight: '486px', maxWidth: '378px', maxHeight: '486px' }}
        >
          {/* Image Skeleton */}
          <div className="relative w-full h-[270px] overflow-hidden flex-shrink-0 bg-gray-200">
            <Skeleton className="w-full h-full rounded-none bg-gray-300" />
          </div>

          {/* Content Skeleton */}
          <div className="p-3 space-y-2.5 flex-1 flex flex-col">
            <div>
              <Skeleton className="h-5 w-3/4 mb-2 bg-gray-300" />
              <Skeleton className="h-6 w-20 bg-gray-300" />
            </div>
            
            <div className="space-y-1 flex-1">
              <div className="flex items-start gap-1.5">
                <Skeleton className="w-3 h-3 rounded-full mt-0.5 bg-gray-300" />
                <Skeleton className="h-3 flex-1 bg-gray-200" />
              </div>
              <div className="flex items-start gap-1.5">
                <Skeleton className="w-3 h-3 rounded-full mt-0.5 bg-gray-300" />
                <Skeleton className="h-3 flex-1 bg-gray-200" />
              </div>
            </div>

            <Skeleton className="h-9 w-full rounded-full mt-auto bg-gray-300" />
          </div>
        </div>
      ))}
    </div>
  );
}

