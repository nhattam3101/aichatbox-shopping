import { buttonOptions, type ButtonName } from "@/data/customization";

export default function ButtonSelector({ value, onChange }: {
  value: ButtonName;
  onChange: (value: ButtonName) => void;
}) {
  return (
    <fieldset className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
      <legend className="px-1 text-sm font-semibold">Chọn mẫu cúc / nút</legend>
      <p className="mb-3 text-xs leading-relaxed text-[var(--text-secondary)]">Phối cùng màu vải của bạn · đang chọn: <strong className="text-[var(--text-primary)]">{value}</strong></p>
      <div className="grid grid-cols-2 gap-2">
        {buttonOptions.map(option => (
          <button key={option.name} type="button" aria-pressed={value === option.name}
            onClick={() => onChange(option.name)}
            className={`flex min-h-12 items-center gap-2 rounded-xl border-2 px-3 py-2 text-left text-xs font-semibold transition-colors ${value === option.name ? "border-[var(--secondary)] bg-[var(--secondary-soft)]" : "border-[var(--border)] bg-white hover:border-[var(--primary)] hover:bg-[var(--soft-blue)]"}`}>
            <span aria-hidden="true" className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-black/20 shadow-sm" style={{ backgroundColor: option.color }}>
              <span className="h-1 w-1 rounded-full bg-black/40" />
            </span>
            <span className="min-w-0 flex-1">{option.name}</span>
            {value === option.name && <span aria-hidden="true">✓</span>}
          </button>
        ))}
      </div>
      <a href="/products/bang_mau_nut.jpg" target="_blank" rel="noreferrer" className="mt-3 inline-block text-xs font-medium text-[var(--primary-ink)] underline underline-offset-4">Xem bảng màu nút thực tế</a>
    </fieldset>
  );
}
