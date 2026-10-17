"use client";
import { useState } from "react";
export default function CopyVoucherButton({ code }: { code: string }) {
  const [message, setMessage] = useState("");
  async function copy() {
    try { await navigator.clipboard.writeText(code); setMessage("Đã sao chép mã."); }
    catch { setMessage(`Không thể sao chép tự động. Bạn có thể chọn mã ${code} để sao chép.`); }
  }
  return <div><button type="button" onClick={copy} className="min-h-11 rounded-full border border-[var(--border)] px-5 py-2.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-[var(--secondary)]">Sao chép mã</button>
    {message && <p role="status" className="mt-2 max-w-xs text-sm text-[var(--secondary-ink)]">{message}</p>}
  </div>;
}
