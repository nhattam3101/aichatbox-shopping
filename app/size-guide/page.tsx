"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { products } from "@/data/products";
import Navbar from "@/components/Navbar";
export default function SizeGuidePage() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [searched, setSearched] = useState(false);

  const matchedProducts = useMemo(() => {
    if (!searched) {
      return [];
    }

    const laptopWidth = Number(width);
    const laptopHeight = Number(height);

    if (
      !laptopWidth ||
      !laptopHeight ||
      laptopWidth <= 0 ||
      laptopHeight <= 0
    ) {
      return [];
    }

    return products.filter((product) => {
      return (
        product.maxWidth >= laptopWidth && product.maxHeight >= laptopHeight
      );
    });
  }, [width, height, searched]);

  function handleSearch() {
    setSearched(true);
  }

  function handleReset() {
    setWidth("");
    setHeight("");
    setSearched(false);
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#1f1f1f]">
      {/* Header */}
      <Navbar />

      {/* Intro */}
      <section className="px-10 py-14 md:px-20">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Size Guide
        </p>

        <h1 className="mt-2 text-4xl font-bold">
          Chọn bao laptop theo kích thước
        </h1>

        <p className="mt-4 max-w-2xl text-gray-600">
          Nhập kích thước thực tế của laptop để tìm những mẫu bao phù hợp.
        </p>
      </section>

      {/* Form */}
      <section className="px-10 md:px-20">
        <div className="max-w-3xl rounded-3xl bg-white p-8">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Chiều dài laptop (cm)
              </label>

              <input
                type="number"
                value={width}
                onChange={(e) => {
                  setWidth(e.target.value);
                  setSearched(false);
                }}
                placeholder="Ví dụ: 32"
                className="w-full rounded-2xl border border-black/20 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Chiều rộng laptop (cm)
              </label>

              <input
                type="number"
                value={height}
                onChange={(e) => {
                  setHeight(e.target.value);
                  setSearched(false);
                }}
                placeholder="Ví dụ: 22"
                className="w-full rounded-2xl border border-black/20 px-4 py-3 outline-none focus:border-black"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              onClick={handleSearch}
              className="rounded-full bg-black px-6 py-3 text-white"
            >
              Tìm size phù hợp
            </button>

            <button
              onClick={handleReset}
              className="rounded-full border border-black/20 px-6 py-3"
            >
              Nhập lại
            </button>
          </div>

          <p className="mt-5 text-sm leading-6 text-gray-500">
            Nên đo phần thân laptop, không tính dây sạc hoặc phụ kiện đi kèm.
          </p>
        </div>
      </section>

      {/* Result */}
      {searched && (
        <section className="px-10 py-14 md:px-20">
          <h2 className="text-2xl font-bold">Kết quả phù hợp</h2>

          {matchedProducts.length === 0 ? (
            <div className="mt-6 rounded-3xl bg-white p-8">
              <p className="font-medium">Chưa tìm thấy sản phẩm phù hợp.</p>

              <p className="mt-2 text-sm text-gray-500">
                Bạn có thể thử kiểm tra lại kích thước hoặc hỏi AI để được tư
                vấn thêm.
              </p>
            </div>
          ) : (
            <div className="mt-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {matchedProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.id}`}
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
                    <h3 className="text-lg font-semibold">{product.name}</h3>

                    <p className="mt-1 text-sm text-gray-500">{product.size}</p>

                    <p className="mt-1 text-sm text-gray-500">
                      Tối đa: {product.maxWidth} × {product.maxHeight} cm
                    </p>

                    <p className="mt-3 font-semibold">
                      {product.price.toLocaleString("vi-VN")}đ
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      )}
    </main>
  );
}
