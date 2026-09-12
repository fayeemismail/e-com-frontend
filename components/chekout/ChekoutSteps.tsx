type Props = {
  current: number;
  steps: string[];
  onStepClick: (i: number) => void;
};

export default function CheckoutSteps({ current, steps, onStepClick }: Props) {
  return (
    <div className="flex items-center gap-2">
      {steps.map((s, i) => (
        <div key={s} className="flex items-center gap-2">
          <button
            onClick={() => i < current && onStepClick(i)}
            className={`text-[10px] tracking-[0.16em] uppercase transition-colors ${
              i === current
                ? "text-[#0f2e5a] font-semibold"
                : i < current
                ? "text-[#64748b] hover:text-[#0f2e5a] cursor-pointer"
                : "text-[#cbd5e1] cursor-default"
            }`}
          >
            {s}
          </button>
          {i < steps.length - 1 && (
            <span className="text-[#cbd5e1] text-xs">›</span>
          )}
        </div>
      ))}
    </div>
  );
}