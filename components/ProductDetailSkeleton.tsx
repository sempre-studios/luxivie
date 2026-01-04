import { Skeleton } from "@/components/ui/skeleton";

export function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-[#F9F9F6]">
      {/* Spacer for fixed navigation */}
      <div className="h-20"></div>

      <div className="pt-12 pb-12 md:pb-16 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center gap-2 mb-6 md:mb-8">
            <Skeleton className="h-4 w-12 bg-gray-300" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-20 bg-gray-300" />
            <span className="text-gray-400">/</span>
            <Skeleton className="h-4 w-32 bg-gray-300" />
          </div>

          {/* Product Grid Skeleton */}
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 mb-12 md:mb-16">
            {/* Left Column - Gallery Skeleton */}
            <div className="w-full">
              <div className="space-y-4">
                {/* Main Image */}
                <Skeleton className="w-full aspect-square rounded-lg bg-gray-300" />
                {/* Thumbnail Images */}
                <div className="grid grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="w-full aspect-square rounded-lg bg-gray-200" />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Product Info Skeleton */}
            <div className="w-full space-y-6">
              {/* Badge */}
              <Skeleton className="h-6 w-24 bg-gray-300" />
              
              {/* Title */}
              <Skeleton className="h-10 w-3/4 bg-gray-300" />
              
              {/* Rating */}
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-20 bg-gray-300" />
                <Skeleton className="h-4 w-32 bg-gray-200" />
              </div>
              
              {/* Price */}
              <Skeleton className="h-8 w-32 bg-gray-300" />
              
              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-5/6 bg-gray-200" />
              </div>
              
              {/* Sizes */}
              <div className="space-y-3">
                <Skeleton className="h-5 w-16 bg-gray-300" />
                <div className="flex gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-20 rounded-full bg-gray-300" />
                  ))}
                </div>
              </div>
              
              {/* Add to Cart Button */}
              <Skeleton className="h-12 w-full rounded-full bg-gray-300" />
              
              {/* Benefits */}
              <div className="space-y-3 pt-4 border-t border-gray-200">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <Skeleton className="w-5 h-5 rounded-full mt-0.5 bg-gray-300" />
                    <Skeleton className="h-4 flex-1 bg-gray-200" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Tabs Skeleton */}
          <div className="mt-12 md:mt-16">
            {/* Tab Headers */}
            <div className="flex gap-6 border-b-2 border-gray-200">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-32 mb-0 bg-gray-200" />
              ))}
            </div>
            
            {/* Tab Content */}
            <div className="pt-6 md:pt-8 space-y-4">
              <Skeleton className="h-6 w-48 bg-gray-300" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-full bg-gray-200" />
                <Skeleton className="h-4 w-5/6 bg-gray-200" />
                <Skeleton className="h-4 w-4/6 bg-gray-200" />
              </div>
              <div className="space-y-3 pt-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full bg-gray-200" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

