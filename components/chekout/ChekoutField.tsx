type Props = {
  label: string;
  fieldKey: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  colSpan?: boolean;
};

export default function CheckoutField({
  label,
  fieldKey,
  value,
  onChange,
  placeholder,
  error,
  colSpan,
}: Props) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] tracking-[0.16em] uppercase text-[#9a9a94] mb-1.5">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border ${
          error ? "border-[#d32f2f]" : "border-[#e8e6e2]"
        } px-3 py-3 text-xs text-[#1a1a1a] tracking-wide outline-none focus:border-[#1a1a1a] transition-colors placeholder-[#c5c5bf]`}
      />
      {error && (
        <span className="text-[10px] text-[#d32f2f] mt-1 block tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}