"use client";

import { useMemo, useState } from "react";
import { saleProducts as products, type Product } from "@/data/products";
import { matchesProduct } from "@/data/product-search";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import ChatBox from "@/components/ChatBox";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tất cả");
  const [selectedSize, setSelectedSize] = useState<string>("Tất cả");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("Tất cả");
  const [onlyWaterproof, setOnlyWaterproof] = useState(false);
  const [onlyPockets, setOnlyPockets] = useState(false);
  const [sortBy, setSortBy] = useState<string>("popular");
  const [viewColumns, setViewColumns] = useState<4 | 2>(4);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  const categories = ["Tất cả", ...new Set(products.map(p => p.category))];

  const sizes = ["Tất cả", ...new Set(products.map(p => p.size))];

  const priceRanges = [
    { label: "Tất cả", value: "Tất cả" },
    { label: "Dưới 200k", value: "under200" },
    { label: "200k - 300k", value: "200to300" },
    { label: "Trên 300k", value: "above300" },
  ];

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      // Search
      const q = search.trim().toLowerCase();
      const matchSearch = matchesProduct(product, q);

      // Category
      const matchCategory =
        selectedCategory === "Tất cả" || product.category === selectedCategory;

      // Size
      const matchSize =
        selectedSize === "Tất cả" || product.size === selectedSize;

      // Price Range
      let matchPrice = true;
      if (selectedPriceRange === "under200") {
        matchPrice = product.price < 200000;
      } else if (selectedPriceRange === "200to300") {
        matchPrice = product.price >= 200000 && product.price <= 300000;
      } else if (selectedPriceRange === "above300") {
        matchPrice = product.price > 300000;
      }

      if (selectedPriceRange !== "Tất cả" && product.priceConfirmed === false) matchPrice = false;

      // Features
      const matchWaterproof = !onlyWaterproof || product.waterproof;
      const matchPockets = !onlyPockets || product.hasPockets;

      return (
        matchSearch &&
        matchCategory &&
        matchSize &&
        matchPrice &&
        matchWaterproof &&
        matchPockets
      );
    });

    // Sorting
    result = [...result].sort((a, b) => {
      if (sortBy.startsWith("price") && a.priceConfirmed !== b.priceConfirmed) return a.priceConfirmed === false ? 1 : -1;
      if (sortBy === "popular") return b.sold - a.sold;
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "newest") return b.id - a.id;
      return 0;
    });

    return result;
  }, [
    search,
    selectedCategory,
    selectedSize,
    selectedPriceRange,
    onlyWaterproof,
    onlyPockets,
    sortBy,
  ]);

  function handleResetFilters() {
    setSearch("");
    setSelectedCategory("Tất cả");
    setSelectedSize("Tất cả");
    setSelectedPriceRange("Tất cả");
    setOnlyWaterproof(false);
    setOnlyPockets(false);
    setSortBy("popular");
  }

  const hasActiveFilters =
    search !== "" ||
    selectedCategory !== "Tất cả" ||
    selectedSize !== "Tất cả" ||
    selectedPriceRange !== "Tất cả" ||
    onlyWaterproof ||
    onlyPockets;

  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative overflow-hidden border-b border-[var(--brand-border)] bg-white py-12 px-6 md:px-12 lg:px-20">
        <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-amber-100/40 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
                Bộ Sưu Tập 2026
              </span>
              <h1 className="mt-3 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
                Bao Bảo Vệ & Phụ Kiện
              </h1>
              <p className="mt-2 text-sm md:text-base text-gray-500 max-w-xl leading-relaxed">
                Khám phá bao bảo vệ laptop, iPad và móc khóa trang trí. Giá bao và giá phụ kiện được niêm yết riêng.
              </p>
            </div>

            {/* Quick Stat Pill */}
            <div className="flex items-center gap-4 bg-[var(--surface-muted)] rounded-2xl p-3 border border-[var(--brand-border)]">
              <div className="text-center px-3 border-r border-[var(--brand-border)]">
                <p className="text-xs text-gray-400">Tổng mẫu</p>
                <p className="text-lg font-bold text-gray-800">{products.length}</p>
              </div>
              <div className="text-center px-3 border-r border-[var(--brand-border)]">
                <p className="text-xs text-gray-400">Đánh giá</p>
                <p className="text-lg font-bold text-amber-600">4.9 ★</p>
              </div>
              <div className="text-center px-3">
                <p className="text-xs text-gray-400">Bảo hành</p>
                <p className="text-lg font-bold text-[var(--secondary-ink)]">12T</p>
              </div>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-8 flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {categories.map((cat) => {
              const count =
                cat === "Tất cả"
                  ? products.length
                  : products.filter((p) => p.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`shrink-0 rounded-full px-5 py-2.5 text-xs font-bold transition-all flex items-center gap-2 ${
                    isSelected
                      ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-md"
                      : "bg-[var(--surface-muted)] text-gray-700 hover:bg-[var(--soft-blue)]"
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                      isSelected ? "bg-white/20 text-white" : "bg-black/5 text-gray-500"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter and Control Bar */}
      <section className="sticky top-[69px] z-30 border-b border-[var(--brand-border)] bg-white/90 backdrop-blur-md px-6 py-4 md:px-12 lg:px-20 transition-all">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative min-w-[240px] flex-1 sm:max-w-xs">
            <svg
              className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên máy, chất liệu..."
              className="w-full rounded-full border border-gray-200 bg-[var(--surface-muted)] py-2 pl-9 pr-8 text-xs font-medium outline-none transition focus:border-black focus:bg-white"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-[var(--text-primary)]"
              >
                ×
              </button>
            )}
          </div>

          {/* Size Pills */}
          <div className="hidden lg:flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400 mr-1">Size:</span>
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedSize === size
                    ? "bg-[var(--primary)] text-[var(--on-primary)]"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price Range */}
          <div className="hidden sm:flex items-center gap-1.5">
            <span className="text-xs font-bold text-gray-400 mr-1">Giá:</span>
            {priceRanges.map((r) => (
              <button
                key={r.value}
                onClick={() => setSelectedPriceRange(r.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                  selectedPriceRange === r.value
                    ? "bg-[var(--primary)] text-[var(--on-primary)]"
                    : "border border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {/* Checkboxes & Sort */}
          <div className="flex items-center gap-3">
            <label className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyWaterproof}
                onChange={(e) => setOnlyWaterproof(e.target.checked)}
                className="rounded border-gray-300 text-[var(--text-primary)] focus:ring-black"
              />
              <span>Chống nước</span>
            </label>

            <label className="hidden md:flex items-center gap-1.5 text-xs font-medium text-gray-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={onlyPockets}
                onChange={(e) => setOnlyPockets(e.target.checked)}
                className="rounded border-gray-300 text-[var(--text-primary)] focus:ring-black"
              />
              <span>Có ngăn phụ</span>
            </label>

            {/* Sort Select */}
            <div className="flex items-center gap-1.5">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-full border border-gray-200 bg-white px-3 py-2 text-xs font-semibold text-gray-800 outline-none hover:border-gray-400 cursor-pointer shadow-sm"
              >
                <option value="popular">Bán chạy nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
                <option value="rating">Đánh giá cao nhất</option>
                <option value="newest">Mới nhất</option>
              </select>
            </div>

            {/* View Switch */}
            <div className="hidden sm:flex rounded-full border border-gray-200 bg-white p-1">
              <button
                onClick={() => setViewColumns(4)}
                className={`rounded-full p-1.5 transition ${
                  viewColumns === 4 ? "bg-[var(--primary)] text-[var(--on-primary)]" : "text-gray-400 hover:text-[var(--text-primary)]"
                }`}
                title="Xem 4 cột"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 2.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z"/>
                </svg>
              </button>
              <button
                onClick={() => setViewColumns(2)}
                className={`rounded-full p-1.5 transition ${
                  viewColumns === 2 ? "bg-[var(--primary)] text-[var(--on-primary)]" : "text-gray-400 hover:text-[var(--text-primary)]"
                }`}
                title="Xem 2 cột"
              >
                <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h11A1.5 1.5 0 0 1 15 2.5v4A1.5 1.5 0 0 1 13.5 8h-11A1.5 1.5 0 0 1 1 6.5v-4zm0 7A1.5 1.5 0 0 1 2.5 8h11a1.5 1.5 0 0 1 1.5 1.5v4a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 1 13.5v-4z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mx-auto max-w-7xl mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-semibold text-gray-500">Đang lọc:</span>
              {selectedCategory !== "Tất cả" && (
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-amber-800 font-medium">
                  {selectedCategory}
                </span>
              )}
              {selectedSize !== "Tất cả" && (
                <span className="rounded-full bg-gray-200 px-2.5 py-0.5 font-medium">
                  {selectedSize}
                </span>
              )}
              {selectedPriceRange !== "Tất cả" && (
                <span className="rounded-full bg-gray-200 px-2.5 py-0.5 font-medium">
                  Giá: {selectedPriceRange}
                </span>
              )}
              {onlyWaterproof && (
                <span className="rounded-full bg-blue-100 text-blue-800 px-2.5 py-0.5 font-medium">
                  Chống nước
                </span>
              )}
              {onlyPockets && (
                <span className="rounded-full bg-[var(--surface-muted)] text-[var(--primary-ink)] px-2.5 py-0.5 font-medium">
                  Có ngăn phụ
                </span>
              )}
            </div>

            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-red-500 hover:text-red-700 underline"
            >
              Xóa tất cả bộ lọc
            </button>
          </div>
        )}
      </section>

      {/* Product Grid Section */}
      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
              Hiển thị {filteredProducts.length} trên tổng số {products.length} sản phẩm
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div
              className={`grid gap-6 ${
                viewColumns === 4
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1 md:grid-cols-2"
              }`}
            >
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={(p) => setQuickViewProduct(p)}
                />
              ))}
            </div>
          ) : (
            <div className="py-24 text-center rounded-3xl bg-white border border-[var(--brand-border)] p-8 shadow-sm">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-3xl">
                🔎
              </div>
              <h3 className="mt-4 text-lg font-bold text-gray-900">
                Không tìm thấy sản phẩm phù hợp
              </h3>
              <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
                Không có mẫu bao laptop nào khớp với bộ lọc hiện tại của bạn. Hãy thử thay đổi kích thước hoặc xóa bớt tiêu chí lọc.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-6 rounded-full bg-[var(--primary)] px-6 py-2.5 text-xs font-semibold text-[var(--on-primary)] shadow-md hover:bg-[var(--brand-primary-hover)] transition"
              >
                Xóa bộ lọc & Xem tất cả sản phẩm
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* AI Chatbox Trigger */}
      <ChatBox />
    </main>
  );
}
