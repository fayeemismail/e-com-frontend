import { ACCENT, TRACK_STEPS, getTrackIndex } from '@/types/order/status'

// The horizontal "Confirmed —— Processing —— Shipped —— Delivered" progress bar.
// Cancelled orders show a plain message instead of the bar.
export function OrderTracker({ status }: { status: string }) {
  const idx = getTrackIndex(status);

  if (idx === -1) {
    return (
      <p className="text-[11px] text-[#c94f4f] tracking-wide">
        This order was cancelled.
      </p>
    );
  }

  return (
    <div className="flex items-center">
      {TRACK_STEPS.map((step, i) => (
        <div key={step} className="flex items-center flex-1 last:flex-none">
          {/* dot + label for this step */}
          <div className="flex flex-col items-center gap-1.5">
            <div
              className="w-1.75 h-1.75 rounded-full transition-colors duration-300"
              style={{ backgroundColor: i <= idx ? ACCENT : "#e2e0db" }}
            />
            <span
              className={`text-[9px] tracking-widest uppercase whitespace-nowrap ${
                i <= idx ? "text-[#1a1a1a]" : "text-[#c4c2bc]"
              }`}
            >
              {step}
            </span>
          </div>

          {/* connecting line to the next step (skipped after the last step) */}
          {i < TRACK_STEPS.length - 1 && (
            <div
              className="flex-1 h-px mx-2 mb-4.5 transition-colors duration-300"
              style={{ backgroundColor: i < idx ? ACCENT : "#eeece7" }}
            />
          )}
        </div>
      ))}
    </div>
  );
}