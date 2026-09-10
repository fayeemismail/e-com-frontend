"use client";

export default function CardSkeleton() {
  return (
    <div className="animate-pulse">
      <div
        className="bg-[#f0eeea] w-full relative overflow-hidden mb-2"
        style={{ paddingBottom: "100%" }}
      />
      <div className="pt-1 pb-1">
        <div className="h-2 bg-[#e8e6e2] w-1/4 rounded mb-2" />
        <div className="h-3 bg-[#e8e6e2] w-3/4 rounded mb-2" />
        <div className="h-3 bg-[#e8e6e2] w-1/2 rounded" />
      </div>
    </div>
  );
}
