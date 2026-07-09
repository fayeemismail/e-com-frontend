// Central place for "what color/label/step does this status mean" logic.
// Both StatusIndicator and OrderTracker read from here, so if the business
// rules for a status ever change, you only edit this one file.

export const ACCENT = "#c27c5a";

export const TRACK_STEPS = ["Confirmed", "Processing", "Shipped", "Delivered"];

/** Dot color + display label for the small status badge in the card header. */
export function statusTone(status: string) {
  const s = status.toLowerCase();
  if (s === "cancelled") return { color: "#c94f4f", label: "Cancelled" };
  if (s === "delivered") return { color: "#3f7a4e", label: "Delivered" };
  if (s === "shipped") return { color: ACCENT, label: "Shipped" };
  if (s === "confirmed") return { color: "#1a1a1a", label: "Confirmed" };
  return { color: "#9a9a94", label: "Pending" };
}

/**
 * How far along the 4-step tracker (Confirmed -> Processing -> Shipped -> Delivered)
 * this order is. Returns -1 for cancelled orders, which get a special message instead
 * of the step tracker.
 */
export function getTrackIndex(status: string) {
  const s = status.toLowerCase();
  if (s === "delivered") return 3;
  if (s === "shipped") return 2;
  if (s === "confirmed") return 1;
  if (s === "cancelled") return -1;
  return 0; // pending / anything unrecognized
}