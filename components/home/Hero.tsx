"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=1600&q=80",
    title: "The Art of Living",
    subtitle: "New Collection 2025",
    cta: "Discover Now",
    href: "#",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=1600&q=80",
    title: "Architecture & Design",
    subtitle: "Essential Volumes",
    cta: "Explore More",
    href: "#",
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1600&q=80",
    title: "Photography Icons",
    subtitle: "Limited Editions",
    cta: "Shop Now",
    href: "#",
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1600&q=80",
    title: "Nature & Science",
    subtitle: "Collector's Series",
    cta: "Discover More",
    href: "#",
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1600&q=80",
    title: "World Escapes",
    subtitle: "Travel & Culture",
    cta: "View Collection",
    href: "#",
  },
];

const AUTOPLAY_INTERVAL = 5000;

export default function Hero() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const currentRef = useRef(current);
  currentRef.current = current;

  // No transitioning guard — just update current directly
  const goTo = (index: number) => {
    setCurrent((index + slides.length) % slides.length);
  };

  const next = () => goTo(currentRef.current + 1);
  const prev = () => goTo(currentRef.current - 1);

  // Autoplay — stable interval, reads currentRef to avoid stale closure
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, AUTOPLAY_INTERVAL);
    return () => clearInterval(timer);
  }, [paused]);

  return (
    <main
      className="relative w-full h-[calc(100svh-52px)] overflow-hidden bg-black"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.id}
          className={[
            "absolute inset-0 transition-opacity duration-700 ease-in-out",
            i === current ? "opacity-100 z-10" : "opacity-0 z-0",
          ].join(" ")}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/15 to-transparent" />
          <div className="absolute inset-0 bg-linear-to-r from-black/40 via-transparent to-transparent" />
        </div>
      ))}

      {/* Slide content */}
      <div className="absolute bottom-14 sm:bottom-16 left-5 sm:left-8 md:left-10 z-20 max-w-[90%] sm:max-w-md md:max-w-lg">
        {slides.map((slide, i) => (
          <div
            key={slide.id}
            className={[
              "absolute bottom-0 left-0 transition-all duration-700",
              i === current
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4 pointer-events-none",
            ].join(" ")}
          >
            <p className="text-white/70 text-[10px] sm:text-xs tracking-[0.2em] uppercase mb-1.5 sm:mb-2 font-light">
              {slide.subtitle}
            </p>
            <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-light tracking-tight leading-tight mb-4 sm:mb-6 font-serif">
              {slide.title}
            </h2>
            <Link
              href={slide.href}
              className="inline-block border border-white text-white text-[10px] sm:text-[11px] tracking-[0.18em] uppercase px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-white hover:text-black transition-colors duration-300 font-light"
            >
              {slide.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Prev arrow — always visible */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-3 md:left-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>

      {/* Next arrow — always visible */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors duration-200"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={[
              "transition-all duration-500 rounded-full",
              i === current
                ? "bg-white w-5 sm:w-6 h-0.75"
                : "bg-white/40 w-0.75 h-0.75 hover:bg-white/70",
            ].join(" ")}
          />
        ))}
      </div>

      {/* Progress bar */}
      <div className="absolute bottom-0 left-0 right-0 z-20 h-0.5 bg-white/10">
        <div
          key={current}
          className="h-full bg-white/60 origin-left"
          style={{
            animation: paused ? "none" : `progress ${AUTOPLAY_INTERVAL}ms linear forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes progress {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
      `}</style>
    </main>
  );
}