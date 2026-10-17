"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [imgFailed, setImgFailed] = useState<Record<number, boolean>>({});

  const validImages = images && images.length > 0 ? images : ["/images/categories/books.svg"];

  return (
    <div className="flex flex-col gap-3 font-nav">
      {/* Main Image Stage — Clean grounded canvas without artificial hover zoom or badges */}
      <div className="relative w-full aspect-square sm:aspect-[4/3] bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs flex items-center justify-center p-6 sm:p-10">
        <Image
          src={imgFailed[active] ? "/images/categories/books.svg" : validImages[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          onError={() => setImgFailed((prev) => ({ ...prev, [active]: true }))}
          className="object-contain p-4 select-none"
        />
      </div>

      {/* Thumbnails (if multiple images from backend) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-2.5 overflow-x-auto no-scrollbar py-1">
          {validImages.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              className={`relative w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden bg-white border cursor-pointer p-1 transition-all duration-150 shrink-0 ${
                active === i
                  ? "border-[#00a6e0] ring-2 ring-[#00a6e0]/30 shadow-xs"
                  : "border-slate-200/90 hover:border-slate-300 opacity-75 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={imgFailed[i] ? "/images/categories/books.svg" : img}
                alt={`${name} thumbnail ${i + 1}`}
                fill
                sizes="72px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}