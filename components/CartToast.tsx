"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import type { ToastNotification } from "@/components/CartContext";

type Props = {
  notification: ToastNotification;
  onClose: () => void;
};

export default function CartToast({ notification, onClose }: Props) {
  const { product } = notification;

  // Auto-dismiss after 4.5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4500);

    return () => clearTimeout(timer);
  }, [notification, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-5 right-5 z-[9999] w-[calc(100%-2.5rem)] max-w-sm sm:max-w-[400px] animate-toast-in select-none hover-lift transition-all duration-300"
    >
      <div className="relative overflow-hidden rounded-3xl border border-black/10 bg-white/95 p-4 shadow-[0_20px_50px_-10px_rgba(0,0,0,0.2)] backdrop-blur-xl transition-all tilt-container">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--success-soft)] text-[var(--deep-navy)] shadow-sm ">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 leading-tight">
                Thêm vào giỏ thành công!
              </p>
              <p className="text-[11px] text-gray-500">
                Đã thêm {product.quantity} sản phẩm
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng thông báo"
            className="flex h-7 w-7 items-center justify-center rounded-full text-gray-400 transition hover:bg-black/5 hover:text-gray-700 "
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Product card */}
        <div className="mt-3.5 flex items-center gap-3.5 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-cream)] p-3 hover-lift transition-transform duration-300">
          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-[var(--brand-border)] bg-[var(--surface-muted)] hover-scale">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain p-1 transition-transform duration-500 hover-scale-large"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="truncate text-sm font-semibold text-gray-900 hover-scale transition-transform duration-200">
              {product.name}
            </h4>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-gray-500">
              <span className="rounded bg-black/5 px-1.5 py-0.5 font-medium text-gray-700 hover-scale transition-transform duration-200">
                {product.sizeMode === "custom" && product.customDimensions
                  ? `Kích thước riêng: ${product.customDimensions.lengthCm} × ${product.customDimensions.widthCm} × ${product.customDimensions.thicknessCm} cm`
                  : product.size}
              </span>
              {product.embroidery && <span className="rounded bg-[var(--surface-muted)] px-2 py-1">Có thêu tên</span>}
              {product.selectedButton && <span className="rounded bg-[var(--surface-muted)] px-2 py-1 text-[var(--primary-ink)]">Nút: {product.selectedButton}</span>}
              {product.selectedColor && (
                <span className="rounded bg-black/5 px-1.5 py-0.5 font-medium text-gray-700 hover-scale transition-transform duration-200">
                  {product.selectedColor}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-bold price-text">
              {product.price.toLocaleString("vi-VN")}₫
              <span className="font-normal text-gray-500"> × {product.quantity}</span>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-3.5 flex items-center gap-2">
          <Link
            href="/cart"
            onClick={onClose}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[var(--primary)] py-2.5 px-4 text-xs font-semibold text-[var(--on-primary)] shadow-sm transition hover:bg-[var(--brand-primary-hover)] hover:shadow-md hover-lift btn-hover-premium"
          >
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>Xem giỏ hàng</span>
          </Link>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-gray-200 py-2.5 px-4 text-xs font-medium text-gray-700 transition hover:bg-gray-100 hover-lift"
          >
            Tiếp tục xem
          </button>
        </div>

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/5">
          <div className="h-full bg-[var(--primary)] animate-toast-progress" />
        </div>

        {/* Floating decorative elements */}
        <div className="absolute -top-2 -left-2 floating-element" />
        <div className="absolute bottom-2 right-2 floating-element" />
      </div>
    </div>
  );
}
