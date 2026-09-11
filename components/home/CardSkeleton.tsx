"use client";

export default function CardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col justify-between bg-white border border-[#e8e4de] p-2.5 sm:p-3 md:p-3.5 rounded-xs h-full min-h-[200px]">
      <div>
        {/* Category & Icon */}
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 rounded-xs bg-[#f0eeea] shrink-0" />
          <div className="h-2.5 bg-[#f0eeea] w-1/3 rounded" />
        </div>
        {/* Product Name */}
        <div className="h-3.5 bg-[#f0eeea] w-4/5 rounded mb-2.5" />
        {/* Unit & SKU */}
        <div className="flex flex-col gap-1 mb-3">
          <div className="h-2.5 bg-[#f0eeea] w-14 rounded" />
          <div className="h-2 bg-[#f0eeea] w-20 rounded" />
        </div>
        {/* Price */}
        <div className="h-4 bg-[#f0eeea] w-1/3 rounded mb-3" />
      </div>
      {/* Bottom Counter & Add Button */}
      <div className="pt-3 border-t border-[#f0ece4] flex gap-1.5">
        <div className="h-6.5 sm:h-7 bg-[#f0eeea] w-14 rounded-xs" />
        <div className="h-6.5 sm:h-7 bg-[#f0eeea] flex-1 rounded-xs" />
      </div>
    </div>
  );
}

