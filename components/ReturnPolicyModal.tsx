"use client";

import Image from "next/image";
import { useEffect } from "react";
import { contact } from "@/data/contact";
import { RETURN_POLICY_TITLE } from "@/data/business";
import { useDialogFocus } from "@/components/useDialogFocus";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ReturnPolicyModal({ isOpen, onClose }: Props) {
  const dialogRef = useDialogFocus(isOpen, onClose);

  // Close on ESC
  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="return-policy-title"
      ref={dialogRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <span className="inline-block rounded-full bg-emerald-50 px-3 py-0.5 text-xs font-bold text-emerald-800">
              {RETURN_POLICY_TITLE}
            </span>
            <h2
              id="return-policy-title"
              className="mt-1 text-xl sm:text-2xl font-extrabold text-gray-900"
            >
              Chính sách đổi trả CaseUp
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng cửa sổ chính sách"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-5">
          {/* Official Policy Banner / Image */}
          <div className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-[var(--surface-muted)]">
            <Image
              src="/products/chinh_sach_doi_trr.jpg"
              alt="Chính sách đổi trả CaseUp - Đổi trả trong 3 ngày cho sản phẩm lỗi, sai màu hoặc sai kích thước"
              width={800}
              height={500}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* Structured Points */}
          <div className="rounded-2xl bg-[var(--brand-cream)] p-4 sm:p-5 border border-[var(--brand-border)] space-y-3">
            <h3 className="text-sm font-bold text-gray-900">
              Điều kiện & Quy định áp dụng:
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Đổi trả sản phẩm lỗi, sai màu hoặc sai kích thước</strong> so với đơn hàng đã xác nhận.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span><strong>Đổi trả trong vòng 3 ngày</strong> tính từ thời điểm nhận hàng thành công.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Sản phẩm phải <strong>còn nguyên tem mác, phụ kiện đi kèm và chưa qua sử dụng</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold">✓</span>
                <span>Khách hàng vui lòng <strong>cung cấp video quay quá trình khui hàng</strong> để được hỗ trợ nhanh nhất.</span>
              </li>
            </ul>
          </div>

          {/* Support notice */}
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <p className="font-bold">Cần hỗ trợ đổi trả ngay?</p>
              <p className="text-[11px] text-amber-800">Hotline: {contact.phone} · Giờ làm việc: {contact.supportHours}</p>
            </div>
            <a
              href={contact.phoneHref}
              className="inline-flex items-center justify-center rounded-full bg-[var(--primary)] px-5 py-2.5 text-xs font-bold text-[var(--on-primary)] shadow-sm hover:bg-[var(--brand-primary-hover)] transition"
            >
              Gọi hotline hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
