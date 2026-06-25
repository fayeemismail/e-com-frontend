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
                ? "text-[#1a1a1a]"
                : i < current
                ? "text-[#9a9a94] hover:text-[#1a1a1a] cursor-pointer"
                : "text-[#c5c5bf] cursor-default"
            }`}
          >
            {s}
          </button>
          {i < steps.length - 1 && (
            <span className="text-[#e8e6e2] text-xs">›</span>
          )}
        </div>
      ))}
    </div>
  );
}