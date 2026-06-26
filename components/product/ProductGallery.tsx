"use client";

import { useState } from "react";
import Image from "next/image";

export default function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col-reverse sm:flex-row gap-3">
      {/* Thumbnails */}
      <div className="flex flex-row sm:flex-col gap-2">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={`w-14 h-14 sm:w-16 sm:h-16 shrink-0 overflow-hidden bg-[#f0eeea] border-none cursor-pointer p-0 relative transition-opacity duration-200 ${active === i ? "opacity-100 ring-1 ring-[#1a1a1a]" : "opacity-60 hover:opacity-90"}`}
          >
            <Image src={img} alt={`${name} ${i + 1}`} fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1 bg-[#f0eeea] aspect-square sm:aspect-4/5 overflow-hidden relative">
        <Image
          src={images[active]}
          alt={name}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover transition-opacity duration-300"
        />
      </div>
    </div>
  );
}