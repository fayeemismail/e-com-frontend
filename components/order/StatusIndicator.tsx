import { statusTone } from "@/types/order/status";

// The small "• Shipped" style badge shown next to each order in the list header.
export function StatusIndicator({ status }: { status: string }) {
  const { color, label } = statusTone(status);

  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span
        className="text-[10px] tracking-[0.14em] uppercase"
        style={{ color: status.toLowerCase() === "pending" ? "#9a9a94" : "#1a1a1a" }}
      >
        {label}
      </span>
    </span>
  );
}