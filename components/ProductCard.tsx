"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useCompare } from "@/components/ProductCompareModal";

type Props = {
  product: Product;
  onQuickView?: (product: Product) => void;
};

export default function ProductCard({ product, onQuickView }: Props) {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const [isAdding, setIsAdding] = useState(false);

  const isFavorite = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleQuickAdd(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (product.priceConfirmed === false) { alert("Giá size này đang chờ xác nhận."); return; }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      quantity: 1,
      selectedColor: product.colors[0],
    });
    setIsAdding(true);
    setTimeout(() => setIsAdding(false), 1200);
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-[var(--brand-border)] bg-white p-3.5 shadow-sm product-card">
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold shadow-sm ${
                product.badge === "Bán chạy" || product.badge === "Top 1"
                  ? "bg-[var(--brand-yellow)] text-[var(--text-primary)]"
                  : product.badge === "Mới"
                  ? "bg-[var(--soft-blue)] text-[var(--text-primary)]"
                  : product.badge === "Premium"
                  ? "bg-[var(--yellow)] text-[var(--text-primary)]"
                  : "bg-[var(--primary)] text-[var(--text-primary)]"
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="rounded-full bg-[var(--yellow)] px-2 py-0.5 text-[10px] font-bold text-[var(--text-primary)] shadow-sm">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Top Right Floating Action Buttons */}
        <div className="absolute right-3 top-3 z-10 flex flex-col gap-1.5">
          {/* Wishlist Heart */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product);
            }}
            aria-label="Yêu thích"
            aria-pressed={isFavorite}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] shadow-sm transition-transform duration-300 hover:scale-105 ${
              isFavorite
                ? "bg-white text-[var(--primary-ink)] hover:bg-[var(--soft-blue)]"
                : "bg-white text-gray-600 hover:bg-[var(--soft-blue)] hover:text-[var(--text-primary)]"
            }`}
          >
            <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </button>

          {/* Compare Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleCompare(product);
            }}
            title="Thêm vào bảng so sánh"
            aria-label="Thêm vào bảng so sánh"
            aria-pressed={isCompared}
            className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] shadow-sm transition-transform duration-300 hover:scale-105 ${
              isCompared
                ? "bg-[var(--primary)] text-[var(--on-primary)]"
                : "bg-white text-gray-600 hover:bg-[var(--soft-blue)] hover:text-amber-600"
            }`}
          >
            <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-100 transition-opacity duration-200 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full rounded-xl bg-white/95 py-2 text-xs font-bold text-gray-800 border border-[var(--border)] shadow-sm transition hover:bg-[var(--brand-primary-hover)] hover:text-[var(--on-primary)] hover-lift"
            >
              Xem nhanh
            </button>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Size */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-500">
            <span className={`font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[10px] hover-scale`}>
              {product.category}
            </span>
            <span className="font-medium text-gray-600 hover-scale">{product.kind === "sleeve" ? product.size : "Phụ kiện"}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="mt-1.5 block">
            <h3 title={product.name} className="line-clamp-2 min-h-10 text-sm leading-5 font-bold text-gray-900 group-hover:text-amber-600 transition-colors duration-200">
              {product.name}
            </h3>
          </Link>

          {/* Ratings & Sold */}
          <div className="mt-1 flex items-center gap-2 text-[11px] text-gray-500">
            <span className="flex items-center text-amber-500 font-bold">
              ★ {product.rating}
            </span>
            <span>•</span>
            <span>Đã bán {product.sold}</span>
          </div>

          {/* Color Dots */}
          <div className="mt-2.5 flex flex-wrap items-center gap-1.5">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className={`rounded-full bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600 border border-gray-200 hover-scale transition-transform duration-200`}
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        {product.kind === "sleeve" && <Link href={`/products/${product.id}`} className="mt-3 text-xs leading-relaxed font-medium text-[var(--primary-ink)] underline underline-offset-4">Tùy chọn màu vải · cúc/nút · thêu tên</Link>}

        {/* Price & Add to Cart */}
        <div className="mt-4 flex items-center justify-between gap-2 pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="price-text text-base font-extrabold">
                {product.priceConfirmed === false ? "Giá chờ xác nhận" : product.price.toLocaleString("vi-VN") + "₫"}
              </span>
            </div>
            {product.originalPrice && (
              <span className="text-[11px] text-gray-400 line-through">
                {product.originalPrice.toLocaleString("vi-VN")}₫
              </span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            aria-label={product.kind === "sleeve" ? "Thêm vào giỏ với màu đầu tiên và nút Baby Blue" : "Thêm vào giỏ"}
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-all duration-300 active:scale-95 shadow hover-lift btn-hover-premium ${
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--brand-primary-hover)]"
            }`}
          >
            {isAdding ? (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
