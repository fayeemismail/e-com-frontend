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

/** Matches vertical ProductCard / FeaturedProductCard chrome. */
export function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
  return (
    <div
      className={`flex flex-col h-full bg-white border border-[#e2e8f0] rounded-xl overflow-hidden ${className}`}
      aria-hidden
    >
      {/* Top Image Stage */}
      <Skeleton className="w-full aspect-[16/10] rounded-none" rounded="none" />

      {/* Bottom Details Section */}
      <div className="p-3.5 sm:p-4 flex flex-col justify-between gap-3 flex-1 bg-white">
        <div className="flex flex-col gap-2">
          {/* Category & in-stock row */}
          <div className="flex items-center justify-between gap-2 h-4">
            <Skeleton className="h-2.5 w-16" rounded="sm" />
            <Skeleton className="h-2.5 w-12" rounded="sm" />
          </div>

          {/* Title */}
          <div className="space-y-1.5 min-h-[2.6em]">
            <Skeleton className="h-3.5 w-full" />
            <Skeleton className="h-3.5 w-3/4" />
          </div>

          {/* Spec pills */}
          <div className="flex items-center gap-1.5">
            <Skeleton className="h-5 w-20" rounded="sm" />
            <Skeleton className="h-5 w-24" rounded="sm" />
          </div>
        </div>

        {/* Pricing & action bar */}
        <div className="flex flex-col gap-2.5 pt-2 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>

          <div className="flex items-center gap-1.5 h-9">
            <Skeleton className="h-full w-[4.5rem] shrink-0 rounded-lg" rounded="md" />
            <Skeleton className="h-full flex-1 rounded-lg" rounded="md" />
          </div>
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
