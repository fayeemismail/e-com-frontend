type SkeletonProps = {
  className?: string;
  /** Soft pill vs sharp block */
  rounded?: "sm" | "md" | "full" | "none";
};

const roundedMap = {
  none: "rounded-none",
  sm: "rounded-sm",
  md: "rounded-md",
  full: "rounded-full",
} as const;

/** Single painted bone — use inside layout shells that mirror real UI. */
export function Skeleton({ className = "", rounded = "sm" }: SkeletonProps) {
  return (
    <div
      aria-hidden
      className={`skeleton-bone ${roundedMap[rounded]} ${className}`}
    />
  );
}

type ProductCardSkeletonProps = {
  className?: string;
};

/** Matches horizontal ProductCard / FeaturedProductCard chrome. */
export function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col h-full bg-white border border-[#e2e8f0] rounded-md overflow-hidden ${className}`}
      aria-hidden
    >
      <div className="flex flex-col p-3 sm:p-3.5 gap-2.5">
        <div className="flex items-stretch gap-3">
          <Skeleton className="shrink-0 w-[7.5rem] sm:w-32 lg:w-36 min-h-[7.5rem] sm:min-h-32 self-stretch rounded-sm" rounded="sm" />
          <div className="flex-1 min-w-0 flex flex-col gap-2">
            <div>
              <div className="flex items-center justify-between gap-2 mb-1 h-4">
                <Skeleton className="h-2.5 w-20" />
                <Skeleton className="h-2.5 w-12" />
              </div>
              <div className="min-h-[2.6em] space-y-1">
                <Skeleton className="h-3.5 w-full" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
            <div className="flex flex-col justify-center gap-1.5 h-[2.75rem] sm:h-[3rem]">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex flex-col justify-end min-h-[2.75rem] sm:min-h-[3rem]">
              <Skeleton className="h-4 w-24 mb-1.5" />
              <Skeleton className="h-2.5 w-28" />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 h-8 sm:h-9">
          <Skeleton className="h-full w-[4.5rem] shrink-0" rounded="sm" />
          <Skeleton className="h-full flex-1" rounded="sm" />
        </div>
      </div>
    </div>
  );
}

/** Compact list-row skeleton for shop list view. */
export function ProductListRowSkeleton() {
  return (
    <div className="flex items-center gap-4 py-4 px-3" aria-hidden>
      <Skeleton className="w-14 h-14 sm:w-16 sm:h-16 shrink-0" rounded="sm" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-2.5 w-16" />
        <Skeleton className="h-3.5 w-2/3 max-w-xs" />
        <Skeleton className="h-2.5 w-24" />
      </div>
      <Skeleton className="h-4 w-14 shrink-0" />
    </div>
  );
}

/** Category filter line in shop sidebar. */
export function CategoryRowSkeleton() {
  return (
    <div className="py-2" aria-hidden>
      <Skeleton className="h-3 w-[70%]" />
    </div>
  );
}

/** Home category pill strip. */
export function CategoryPillSkeleton() {
  return <Skeleton className="h-8 w-[5.5rem] shrink-0" rounded="full" />;
}
