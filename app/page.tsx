"use client";

import { useState } from "react";
import AnnouncementBar from "@/components/common/AnnouncementBar";
import Hero from "@/components/home/Hero";
import Featured from "@/components/home/FeaturedProducts";
import FeaturedProductThree from "@/components/home/FeaturedProductThree";
import FeaturedProductFour from "@/components/home/FeaturedProductFour";
import FeaturedProductFive from "@/components/home/FeaturedProductFive";
import FeaturedProductSix from "@/components/home/FeaturedProductSix";
import FeaturedProductSeven from "@/components/home/FeaturedProductSeven";
import FeaturedProductEight from "@/components/home/FeaturedProductEight";
import FeaturedProductTen from "@/components/home/FeaturedProductTen";

const VARIANTS = [
  { id: 0,  label: "Current",   description: "Original grid"         },
  { id: 3,  label: "Type-Led",  description: "Row layout"            },
  { id: 4,  label: "Cinematic", description: "Scroll + expand"       },
  { id: 5,  label: "Stagger",   description: "Soft asymmetric"       },
  { id: 6,  label: "Carousel",  description: "Slide + progress bar"  },
  { id: 7,  label: "Grid+Tab",  description: "4-col + filter tabs"   },
  { id: 8,  label: "Split",     description: "Hero + 3-col grid"     },
  { id: 10, label: "Magazine",  description: "Dark editorial stack"  },
] as const;

function FeaturedSection({ id }: { id: number }) {
  switch (id) {
    case 3:  return <FeaturedProductThree />;
    case 4:  return <FeaturedProductFour />;
    case 5:  return <FeaturedProductFive />;
    case 6:  return <FeaturedProductSix />;
    case 7:  return <FeaturedProductSeven />;
    case 8:  return <FeaturedProductEight />;
    case 10: return <FeaturedProductTen />;
    default: return <Featured />;
  }
}

export default function Home() {
  const [active, setActive] = useState(0);

  return (
    <>
      <AnnouncementBar />
      <Hero />
      <FeaturedSection id={active} />

      {/* Floating variant switcher */}
      <div className="fixed bottom-7 left-1/2 -translate-x-1/2 z-[9999] flex items-center gap-1 bg-[rgba(15,14,13,0.88)] backdrop-blur-md border border-white/10 rounded-full px-1.5 py-[5px] shadow-[0_8px_32px_rgba(0,0,0,0.28)]">
        {/* Label */}
        <span className="text-[8px] tracking-[0.2em] uppercase text-white/35 pl-2 pr-1 whitespace-nowrap select-none">
          Layout
        </span>
        {/* Divider */}
        <div className="w-px h-4 bg-white/10 mr-0.5" />
        {/* Buttons */}
        {VARIANTS.map((v) => {
          const isActive = active === v.id;
          return (
            <button
              key={v.id}
              onClick={() => setActive(v.id)}
              title={v.description}
              className={`flex flex-col items-center gap-px px-[11px] py-1.5 rounded-full border-none cursor-pointer transition-[background-color,color] duration-200 text-[10px] leading-none whitespace-nowrap ${
                isActive
                  ? "bg-white/90 text-[#0f0e0d] font-medium"
                  : "bg-transparent text-white/55 hover:bg-white/10 hover:text-white/90"
              }`}
            >
              {v.label}
            </button>
          );
        })}
      </div>
    </>
  );
}