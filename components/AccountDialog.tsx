"use client";
import type { ReactNode } from "react";
import { useDialogFocus } from "@/components/useDialogFocus";

export default function AccountDialog({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  const ref = useDialogFocus(true, onClose);
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--deep-navy)]/40 p-4" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
    <div ref={ref} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-5 text-[var(--text-primary)] shadow-xl sm:p-7">
      <div className="mb-5 flex items-start justify-between gap-3"><h2 className="text-xl font-extrabold">{title}</h2>
        <button type="button" onClick={onClose} aria-label="Đóng" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-xl focus-visible:outline-2 focus-visible:outline-[var(--secondary)]">×</button>
      </div>{children}
    </div>
  </div>;
}
