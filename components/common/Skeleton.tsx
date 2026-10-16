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

/** Matches vertical cardless product card chrome with conventional calm pulse. */
export function ProductCardSkeleton({ className = "" }: ProductCardSkeletonProps) {
  return (
    <div
      className={`animate-pulse flex flex-col justify-between h-full bg-transparent w-full select-none ${className}`}
      aria-hidden
    >
      <div className="flex flex-col flex-1">
        {/* Square Image Stage (matches real card border & rounded-lg) */}
        <div className="w-full aspect-square rounded-lg bg-slate-100 border border-slate-200/90 mb-2 overflow-hidden flex items-center justify-center">
          <div className="w-full h-full bg-slate-200/60" />
        </div>

        {/* Category / Brand */}
        <div className="h-2.5 w-16 bg-slate-200/80 rounded-sm mb-1" />

        {/* Title (2 lines matching conventional 2.6em height) */}
        <div className="space-y-1.5 min-h-[2.6em] mb-1">
          <div className="h-3.5 w-full bg-slate-200/80 rounded-sm" />
          <div className="h-3.5 w-3/4 bg-slate-200/70 rounded-sm" />
        </div>

        {/* Spec: SAP ID & Unit */}
        <div className="flex items-center gap-2 mt-0.5 mb-1">
          <div className="h-2.5 w-20 bg-slate-200/60 rounded-sm" />
          <div className="h-2.5 w-16 bg-slate-200/60 rounded-sm" />
        </div>

        {/* Price (Amazon style SAR first, then number, then /unit) */}
        <div className="flex items-baseline gap-1 mt-1">
          <div className="h-3 w-6 bg-slate-200/70 rounded-sm" />
          <div className="h-5 w-20 bg-slate-200/90 rounded-sm" />
          <div className="h-3 w-10 bg-slate-200/60 rounded-sm" />
        </div>
      </div>

      {/* Button (Add to requisition cart) */}
      <div className="w-full mt-2">
        <div className="h-8 sm:h-8.5 w-full rounded-lg bg-slate-200/90" />
      </div>
    </div>
  );
}

/** Compact list-row skeleton for shop list view. */
export function ProductListRowSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-4 py-4 px-3 select-none" aria-hidden>
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-slate-200/80 shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="h-2.5 w-16 bg-slate-200/80 rounded-sm" />
        <div className="h-3.5 w-2/3 max-w-xs bg-slate-200/70 rounded-sm" />
        <div className="h-2.5 w-24 bg-slate-200/60 rounded-sm" />
      </div>
      <div className="h-4 w-14 bg-slate-200/80 rounded-sm shrink-0" />
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
