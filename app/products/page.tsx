"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedSize, setSelectedSize] = useState("Tất cả");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchSize =
        selectedSize === "Tất cả" || product.size === selectedSize;

      return matchSearch && matchSize;
    });
  }, [search, selectedSize]);

  const sizes = ["Tất cả", "13 inch", "14 inch", "15.6 inch", "16 inch"];

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#1f1f1f]">
      {/* Header */}
      <Navbar />

      {/* Title */}
      <section className="px-10 py-14 md:px-20">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Collection
        </p>

        <h1 className="mt-2 text-4xl font-bold">Tất cả sản phẩm</h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Khám phá các mẫu bao laptop theo kích thước, màu sắc và nhu cầu sử
          dụng.
        </p>
      </section>

      {/* Search + Filter */}
      <section className="px-10 md:px-20">
        <div className="border-b border-black/10 pb-6">
          {/* Search */}
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm sản phẩm..."
            className="mb-5 w-full max-w-md rounded-full border border-black/20 bg-white px-5 py-3 text-sm outline-none focus:border-black"
          />

          {/* Size Filter */}
          <div className="flex flex-wrap gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={
                  selectedSize === size
                    ? "rounded-full bg-black px-5 py-2 text-sm text-white"
                    : "rounded-full border border-black/20 bg-white px-5 py-2 text-sm"
                }
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="px-10 py-10 md:px-20">
        {filteredProducts.length > 0 ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((product) => (
              <Link
                href={`/products/${product.id}`}
                key={product.id}
                className="group"
              >
                <div className="relative h-72 overflow-hidden rounded-2xl bg-[#eeeae5]">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>

                <div className="mt-4">
                  <h2 className="text-lg font-semibold">{product.name}</h2>

                  <p className="mt-1 text-sm text-gray-500">{product.size}</p>

                  <p className="mt-3 font-semibold">
                    {product.price.toLocaleString("vi-VN")}đ
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="py-20 text-center text-gray-500">
            Không tìm thấy sản phẩm phù hợp.
          </p>
        )}
      </section>
    </main>
  );
}
