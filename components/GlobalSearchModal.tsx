"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useMemo, useEffect, useRef } from "react";
import { saleProducts as products } from "@/data/products";

import { matchesProduct } from "@/data/product-search";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

export default function GlobalSearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  function handleClose() {
    setQuery("");
    onClose();
  }

  // Handle ESC
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter(p => matchesProduct(p, q)).slice(0, 8);
  }, [query]);

  const popularTags = [
    "MacBook Air 13",
    "Chống sốc 14 inch",
    "Da cao cấp",
    "Pastel",
    "Gaming 16 inch",
    "Chống nước",
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-12">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-md transition-opacity"
        onClick={handleClose}
      />

      {/* Search Container */}
      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl border border-black/10 animate-fade-in-up mt-8">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-4">
          <svg className="h-5 w-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm theo tên máy, kích thước (13, 14, 15.6, 16), chất liệu da, màu sắc..."
            className="flex-1 text-sm font-medium outline-none placeholder:text-gray-400"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs font-semibold text-gray-400 hover:text-black p-1"
            >
              Xóa
            </button>
          )}
          <button
            onClick={handleClose}
            className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500 hover:bg-gray-200 transition"
          >
            ESC
          </button>
        </div>

        {/* Hot Suggestions if empty */}
        {!query && (
          <div className="p-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Gợi ý tìm kiếm phổ biến
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="rounded-full bg-[#f6f4f0] px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:bg-amber-100 hover:text-amber-800 transition"
                >
                  🔍 {tag}
                </button>
              ))}
            </div>

            <div className="mt-8 pt-4 border-t border-gray-100">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
                Sản phẩm nổi bật hôm nay
              </p>
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((p) => (
                  <Link
                    key={p.id}
                    href={`/products/${p.id}`}
                    onClick={handleClose}
                    className="flex items-center gap-3 rounded-2xl p-2 hover:bg-gray-50 transition border border-transparent hover:border-gray-100"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                      <Image src={p.image} alt={p.name} fill className="object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="price-text text-[11px] font-semibold">{p.priceConfirmed === false ? "Giá chờ xác nhận" : p.price.toLocaleString("vi-VN") + "₫"}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {query && (
          <div className="max-h-[60vh] overflow-y-auto p-4 divide-y divide-gray-100">
            {filtered.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-sm font-semibold text-gray-800">Không tìm thấy sản phẩm cho &ldquo;{query}&rdquo;</p>
                <p className="text-xs text-gray-400 mt-1">Hãy thử tìm theo kích thước: &ldquo;13 inch&rdquo;, &ldquo;14 inch&rdquo; hoặc &ldquo;Chống sốc&rdquo;</p>
              </div>
            ) : (
              filtered.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  onClick={handleClose}
                  className="group flex items-center justify-between gap-4 p-3 hover:bg-[var(--brand-cream)] rounded-2xl transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[#f2eee9] border border-gray-100">
                      <Image src={item.image} alt={item.name} fill className="object-contain p-1 group-hover:scale-105 transition duration-300" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate group-hover:text-amber-600 transition">
                        {item.name}
                      </h4>
                      <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                        <span className="font-medium text-gray-700">{item.size}</span>
                        <span>•</span>
                        <span>{item.category}</span>
                        <span>•</span>
                        <span>{item.material}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <p className="price-text text-sm font-extrabold">
                      {item.priceConfirmed === false ? "Giá chờ xác nhận" : item.price.toLocaleString("vi-VN") + "₫"}
                    </p>
                    {item.badge && (
                      <span className="inline-block rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold text-amber-700 mt-0.5">
                        {item.badge}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
