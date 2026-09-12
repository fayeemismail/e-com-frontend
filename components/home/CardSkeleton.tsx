"use client";

export default function CardSkeleton() {
  return (
    <div className="animate-pulse flex flex-col justify-between bg-white border border-[#e2e8f0] rounded-xs h-full overflow-hidden">
      {/* Top illustration block */}
      <div className="h-28 sm:h-32 bg-[#f0f4f9] flex items-center justify-center p-3 relative">
        <div className="w-14 h-14 rounded-xs bg-[#e2e8f0]/70" />
      </div>

      <div className="p-2.5 sm:p-3 md:p-3.5 flex flex-col flex-1">
        {/* Category */}
        <div className="h-2.5 bg-[#f0eeea] w-1/3 rounded mb-2" />
        {/* Product Name */}
        <div className="h-3.5 bg-[#f0eeea] w-4/5 rounded mb-2.5" />
        {/* Unit & Dispatch */}
        <div className="h-2.5 bg-[#f0eeea] w-1/2 rounded mb-3" />
        {/* Price */}
        <div className="h-4 bg-[#f0eeea] w-1/3 rounded mb-3 mt-auto" />

        {/* Bottom Counter & Add Button */}
        <div className="pt-2 border-t border-[#f0ece4] flex gap-1.5">
          <div className="h-7 sm:h-7.5 bg-[#f0eeea] w-16 rounded-xs" />
          <div className="h-7 sm:h-7.5 bg-[#f0eeea] flex-1 rounded-xs" />
        </div>
      </div>
    </div>
  );
}
