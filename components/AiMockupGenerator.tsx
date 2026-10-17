"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { mockupSummary, mockupErrors, type MockupConfiguration } from "@/data/mockup";

export default function AiMockupGenerator({ configuration, valid, changeKey }: {
  configuration: MockupConfiguration; valid: boolean; changeKey: string;
}) {
  const fingerprint = JSON.stringify([configuration, changeKey]);
  const current = useRef(fingerprint);
  useEffect(() => { current.current = fingerprint; }, [fingerprint]);
  const active = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const [loading, setLoading] = useState(false);
  const [slow, setSlow] = useState(false);
  const [error, setError] = useState<{ key: string; message: string } | null>(null);
  const [result, setResult] = useState<{ key: string; url: string; summary: string } | null>(null);
  const [attemptedKey, setAttemptedKey] = useState<string | null>(null);
  const stale = attemptedKey !== null && attemptedKey !== fingerprint;

  useEffect(() => () => controller.current?.abort(), []);
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => setSlow(true), 25000);
    return () => clearTimeout(timer);
  }, [loading]);

  async function generate() {
    if (active.current || !valid) return;
    active.current = true;
    const key = fingerprint;
    setAttemptedKey(key);
    setLoading(true); setSlow(false); setError(null); setResult(null);
    const abort = new AbortController();
    controller.current = abort;
    const timeout = setTimeout(() => abort.abort(), 85000);
    try {
      const response = await fetch("/api/generate-mockup", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(configuration), signal: abort.signal,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(response.status === 429 ? "quota" : response.status === 404 ? "unavailable" : "failed");
      if (typeof data.imageUrl !== "string" || !/^data:image\/(png|jpeg|webp);base64,/.test(data.imageUrl)) throw new Error("failed");
      if (current.current === key) setResult({ key, url: data.imageUrl, summary: mockupSummary(configuration) });
    } catch (e) {
      if (current.current === key) setError({ key, message: e instanceof Error && e.message === "quota"
        ? mockupErrors.quota : e instanceof Error && e.message === "unavailable"
        ? mockupErrors.unavailable : mockupErrors.generation });
    } finally { clearTimeout(timeout); active.current = false; setLoading(false); }
  }

  const buttonClass = "min-h-11 rounded-full px-5 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--secondary)] disabled:opacity-60";
  return (
    <section aria-label="Bản mô phỏng AI" aria-busy={loading} className="min-w-0 rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-6">
      <h3 className="font-extrabold text-[var(--deep-navy)]">Bản mô phỏng AI</h3>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Tùy chọn tạo ảnh tham khảo cho thiết kế của bạn.</p>
      <div aria-live="polite" className="mt-3 text-sm">
        {stale && <p className="mb-3 rounded-xl bg-[var(--secondary-soft)] p-3">Tùy chọn đã thay đổi. Hãy tạo lại bản mô phỏng để cập nhật.</p>}
        {loading && <div role="status" className="my-4 rounded-xl bg-[var(--surface-muted)] p-4">
          <span aria-hidden="true" className="mb-2 block h-2 w-12 rounded-full bg-[var(--soft-blue)] motion-safe:animate-pulse" />
          <p>Đang tạo bản mô phỏng...</p><p className="mt-1 text-[var(--text-secondary)]">Thường mất khoảng 10–20 giây.</p>
          {slow && <p className="mt-2">Đang mất nhiều thời gian hơn dự kiến...</p>}
        </div>}
      </div>
      {error?.key === fingerprint && <p role="alert" className="my-3 text-sm text-red-800">{error.message}</p>}
      {result?.key === fingerprint && <div className="mt-4">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
          <Image src={result.url} alt={`Bản mô phỏng AI tham khảo: ${result.summary}`} fill unoptimized sizes="(min-width: 1024px) 400px, 100vw" className="object-contain" />
        </div>
        <p className="mt-3 break-words text-sm leading-relaxed">{result.summary}</p>
        <p className="mt-3 rounded-xl bg-[var(--soft-blue)]/40 p-3 text-sm leading-relaxed">Bản mô phỏng AI chỉ mang tính tham khảo. Sản phẩm thực tế sẽ được làm theo các tùy chọn bạn đã chọn.</p>
      </div>}
      {!valid && <p className="mt-3 text-sm text-[var(--text-secondary)]">Vui lòng hoàn tất kích thước hợp lệ trước khi tạo ảnh.</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" disabled={loading || !valid} onClick={generate} className={`${buttonClass} bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)]`}>
          {loading ? "Đang tạo bản mô phỏng..." : result?.key === fingerprint || stale ? "Tạo lại" : "Tạo bản mô phỏng AI"}
        </button>
        {result?.key === fingerprint && <button type="button" onClick={() => { setResult(null); setAttemptedKey(null); }} className={`${buttonClass} border border-[var(--border)]`}>Đóng</button>}
      </div>
    </section>
  );
}
