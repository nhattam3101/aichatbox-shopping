"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, createContext, useContext, ReactNode } from "react";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartContext";

type CompareContextType = {
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  isInCompare: (id: number) => boolean;
  removeFromCompare: (id: number) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;
};

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  function toggleCompare(product: Product) {
    setCompareList((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        return prev.filter((p) => p.id !== product.id);
      }
      if (prev.length >= 3) {
        // limit to 3 products
        alert("Bạn có thể so sánh tối đa 3 sản phẩm cùng lúc.");
        return prev;
      }
      return [...prev, product];
    });
  }

  function isInCompare(id: number) {
    return compareList.some((p) => p.id === id);
  }

  function removeFromCompare(id: number) {
    setCompareList((prev) => prev.filter((p) => p.id !== id));
  }

  function clearCompare() {
    setCompareList([]);
    setIsCompareModalOpen(false);
  }

  return (
    <CompareContext.Provider
      value={{
        compareList,
        toggleCompare,
        isInCompare,
        removeFromCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
      }}
    >
      {children}
      <CompareFloatingBar />
      <CompareModal />
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}

// Floating bar at bottom of screen when >= 1 item selected
function CompareFloatingBar() {
  const { compareList, removeFromCompare, clearCompare, setIsCompareModalOpen } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2 animate-fade-in-up">
      <div className="flex items-center gap-4 rounded-full border border-black/10 bg-white/95 px-5 py-3 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
            {compareList.length}
          </span>
          <span className="text-xs font-bold text-gray-800 hidden sm:inline">
            Đang chọn so sánh:
          </span>
        </div>

        {/* Thumbnail icons */}
        <div className="flex -space-x-2">
          {compareList.map((item) => (
            <div
              key={item.id}
              className="group relative h-9 w-9 overflow-hidden rounded-full border-2 border-white bg-gray-100 shadow-sm"
              title={item.name}
            >
              <Image src={item.image} alt={item.name} fill className="object-cover" />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromCompare(item.id);
                }}
                className="absolute inset-0 hidden items-center justify-center bg-black/60 text-white group-hover:flex"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={() => setIsCompareModalOpen(true)}
          className="rounded-full bg-black px-4 py-2 text-xs font-semibold text-white shadow hover:bg-gray-800 transition"
        >
          So sánh ngay ({compareList.length}/3)
        </button>

        <button
          onClick={clearCompare}
          className="text-xs text-gray-400 hover:text-gray-700 transition"
          title="Bỏ so sánh"
        >
          Xóa
        </button>
      </div>
    </div>
  );
}

// Full Comparison Modal
function CompareModal() {
  const { compareList, isCompareModalOpen, setIsCompareModalOpen, removeFromCompare, clearCompare } = useCompare();
  const { addToCart } = useCart();

  if (!isCompareModalOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setIsCompareModalOpen(false)}
      />

      <div className="relative z-10 w-full max-w-5xl rounded-3xl bg-white p-6 md:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">So sánh thông số sản phẩm</h2>
            <p className="text-xs text-gray-500 mt-1">Đánh giá các đặc điểm kỹ thuật để chọn chiếc bao ưng ý nhất</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-gray-400 hover:text-red-500 transition"
            >
              Xóa tất cả
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-black transition"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Matrix table */}
        <div className="mt-6 overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="w-1/4 pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Tiêu chí</th>
                {compareList.map((product) => (
                  <th key={product.id} className="pb-4 px-3 align-top min-w-[200px]">
                    <div className="relative flex flex-col items-center text-center">
                      <button
                        onClick={() => removeFromCompare(product.id)}
                        className="absolute right-0 top-0 text-gray-300 hover:text-red-500 transition"
                        title="Bỏ sản phẩm này"
                      >
                        ×
                      </button>
                      <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-[#f6f4f0] p-2">
                        <Image src={product.image} alt={product.name} fill className="object-contain" />
                      </div>
                      <Link
                        href={`/products/${product.id}`}
                        onClick={() => setIsCompareModalOpen(false)}
                        className="mt-2 font-bold text-sm text-gray-900 hover:text-amber-600 transition"
                      >
                        {product.name}
                      </Link>
                      <span className="text-base font-extrabold text-amber-600 mt-1">
                        {product.price.toLocaleString("vi-VN")}₫
                      </span>
                      <button
                        onClick={() => {
                          addToCart({
                            id: product.id,
                            name: product.name,
                            price: product.price,
                            image: product.image,
                            size: product.size,
                            quantity: 1,
                            selectedColor: product.colors[0],
                          });
                        }}
                        className="mt-3 rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white hover:bg-gray-800 transition"
                      >
                        + Thêm vào giỏ
                      </button>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              <tr>
                <td className="py-3 font-semibold text-gray-500">Phân loại</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center">
                    <span className="rounded-full bg-amber-50 px-2.5 py-0.5 font-bold text-amber-700">
                      {p.category}
                    </span>
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Kích thước phù hợp</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center font-bold text-gray-800">
                    {p.size}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Kích thước máy tối đa</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center text-gray-700">
                    {p.maxWidth} × {p.maxHeight} cm
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Chất liệu chính</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center text-gray-700">
                    {p.material}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Khả năng kháng nước</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center">
                    {p.waterproof ? (
                      <span className="font-bold text-emerald-600">✓ Có (Kháng nước cao cấp)</span>
                    ) : (
                      <span className="text-gray-400">Tiêu chuẩn kháng bụi nhẹ</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Ngăn phụ kiện</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center">
                    {p.hasPockets ? (
                      <span className="font-bold text-blue-600">✓ Có ngăn riêng cho sạc/chuột</span>
                    ) : (
                      <span className="text-gray-400">Thiết kế mỏng 1 ngăn chính</span>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Trọng lượng</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center font-medium text-gray-700">
                    {p.weight}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Tùy chọn màu sắc</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center text-gray-700">
                    {p.colors.join(", ")}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="py-3 font-semibold text-gray-500">Đánh giá khách hàng</td>
                {compareList.map((p) => (
                  <td key={p.id} className="py-3 px-3 text-center font-bold text-amber-500">
                    ★ {p.rating} / 5 ({p.sold} đã bán)
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
