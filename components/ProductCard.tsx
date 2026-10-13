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
    <div className="group relative flex flex-col overflow-hidden rounded-3xl border border-black/5 bg-white p-3.5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-black/10 hover:shadow-xl">
      {/* Image Area */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[#f5f3ef]">
        <Link href={`/products/${product.id}`} className="block h-full w-full">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {product.badge && (
            <span
              className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm ${
                product.badge === "Bán chạy" || product.badge === "Top 1"
                  ? "bg-amber-500"
                  : product.badge === "Mới"
                  ? "bg-emerald-500"
                  : product.badge === "Premium"
                  ? "bg-purple-600"
                  : "bg-rose-500"
              }`}
            >
              {product.badge}
            </span>
          )}
          {discountPercent && (
            <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-sm">
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
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-110 ${
              isFavorite
                ? "bg-white text-rose-500"
                : "bg-white/90 text-gray-400 hover:text-rose-500"
            }`}
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
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
            className={`flex h-8 w-8 items-center justify-center rounded-full shadow-md backdrop-blur-md transition-transform duration-200 hover:scale-110 ${
              isCompared
                ? "bg-amber-500 text-white"
                : "bg-white/90 text-gray-500 hover:text-amber-600"
            }`}
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </button>
        </div>

        {/* Quick View Hover Button */}
        {onQuickView && (
          <div className="absolute inset-x-3 bottom-3 z-10 opacity-0 transition-all duration-300 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onQuickView(product);
              }}
              className="w-full rounded-xl bg-white/95 py-2 text-xs font-bold text-gray-800 shadow-md backdrop-blur-md transition hover:bg-black hover:text-white"
            >
              👁️ Xem nhanh
            </button>
          </div>
        )}
      </div>

      {/* Info Area */}
      <div className="mt-3.5 flex flex-1 flex-col justify-between">
        <div>
          {/* Category & Size */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span className="font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md text-[10px]">
              {product.category}
            </span>
            <span className="font-medium text-gray-600">{product.size}</span>
          </div>

          {/* Title */}
          <Link href={`/products/${product.id}`} className="mt-1.5 block">
            <h3 className="line-clamp-1 text-sm font-bold text-gray-900 group-hover:text-amber-600 transition">
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
          <div className="mt-2.5 flex items-center gap-1.5">
            {product.colors.map((color, i) => (
              <span
                key={i}
                className="rounded-full bg-gray-100 px-2 py-0.5 text-[9px] font-medium text-gray-600 border border-gray-200"
              >
                {color}
              </span>
            ))}
          </div>
        </div>

        {/* Price & Add to Cart */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-gray-100">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-extrabold text-amber-600">
                {product.price.toLocaleString("vi-VN")}₫
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
            aria-label="Thêm vào giỏ"
            className={`flex h-9 w-9 items-center justify-center rounded-full transition-all duration-200 active:scale-95 shadow ${
              isAdding
                ? "bg-emerald-600 text-white"
                : "bg-black text-white hover:bg-amber-600"
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
