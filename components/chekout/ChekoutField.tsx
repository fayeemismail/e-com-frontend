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
  value,
  onChange,
  placeholder,
  error,
  colSpan,
}: Props) {
  return (
    <div className={colSpan ? "sm:col-span-2" : ""}>
      <label className="block text-[10px] tracking-[0.16em] uppercase text-[#64748b] mb-1.5 font-medium">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full border ${
          error ? "border-[#d32f2f]" : "border-[#cbd5e1]"
        } px-3.5 py-3 text-xs text-[#0f172a] tracking-wide outline-none focus:border-[#0f2e5a] transition-colors placeholder-[#94a3b8] rounded-xs bg-white`}
      />
      {error && (
        <span className="text-[10px] text-[#d32f2f] mt-1 block tracking-wide">
          {error}
        </span>
      )}
    </div>
  );
}