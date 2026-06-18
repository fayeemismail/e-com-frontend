import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-5 text-center">
      <p className="text-[11px] tracking-[0.22em] uppercase text-[#bbb] mb-3">
        Error 404
      </p>

      <h1 className="text-5xl sm:text-6xl md:text-7xl font-light tracking-tight text-[#1a1a1a] font-serif mb-4">
        Page Not Found
      </h1>

      <p className="text-[13px] sm:text-[14px] text-[#5a5a55] max-w-md mb-8 leading-relaxed">
        The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
        <Link
          href="/"
          className="text-[11px] tracking-[0.16em] uppercase text-white bg-[#1a1a1a] px-6 py-3 no-underline hover:bg-[#333] transition-colors duration-200"
        >
          Back to Home
        </Link>
        <Link
          href="/shop"
          className="text-[11px] tracking-[0.16em] uppercase text-[#1a1a1a] border border-[#1a1a1a] px-6 py-3 no-underline hover:bg-[#1a1a1a] hover:text-white transition-colors duration-200"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}