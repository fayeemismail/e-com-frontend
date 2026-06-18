"use client";

import { useEffect, useState } from "react";
import { announcements } from "@/lib/announcements";

export default function AnnouncementBar() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setFading(true);
      setTimeout(() => {
        setCurrent((c) => (c + 1) % announcements.length);
        setFading(false);
      }, 300);
    }, 3500);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full bg-[#1a1a1a] h-8 flex items-center justify-center px-4 overflow-hidden">
      <p
        className={`text-white text-[10px] tracking-[0.18em] uppercase text-center transition-opacity duration-300 ${
          fading ? "opacity-0" : "opacity-100"
        }`}
      >
        {announcements[current]}
      </p>
    </div>
  );
}