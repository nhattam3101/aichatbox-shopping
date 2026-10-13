"use client";

import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import ChatBox from "@/components/ChatBox";

type LaptopPreset = {
  name: string;
  brand: string;
  width: number;
  height: number;
  screenSize: string;
};

const POPULAR_LAPTOPS: LaptopPreset[] = [
  { name: "MacBook Air 13 (M1/M2/M3)", brand: "Apple", width: 30.4, height: 21.5, screenSize: "13.6 inch" },
  { name: "MacBook Pro 14 (M1/M2/M3)", brand: "Apple", width: 31.3, height: 22.1, screenSize: "14.2 inch" },
  { name: "MacBook Pro 16 (M1/M2/M3)", brand: "Apple", width: 35.6, height: 24.8, screenSize: "16.2 inch" },
  { name: "Dell XPS 13 Plus", brand: "Dell", width: 29.6, height: 19.9, screenSize: "13.4 inch" },
  { name: "Dell XPS 15 / XPS 16", brand: "Dell", width: 34.5, height: 23.0, screenSize: "15.6 inch" },
  { name: "Lenovo ThinkPad X1 Carbon", brand: "Lenovo", width: 31.5, height: 22.2, screenSize: "14 inch" },
  { name: "Asus ZenBook 14 OLED", brand: "Asus", width: 31.3, height: 22.0, screenSize: "14 inch" },
  { name: "Asus TUF / ROG Strix 15.6", brand: "Asus", width: 35.5, height: 25.2, screenSize: "15.6 inch" },
  { name: "HP Envy x360 14", brand: "HP", width: 32.2, height: 21.6, screenSize: "14 inch" },
  { name: "Acer Nitro 5 / Swift 3", brand: "Acer", width: 36.0, height: 25.5, screenSize: "15.6 inch" },
];

export default function SizeGuidePage() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  function applyPreset(preset: LaptopPreset) {
    setWidth(preset.width.toString());
    setHeight(preset.height.toString());
    setSelectedPreset(preset.name);
  }

  const numWidth = parseFloat(width) || 0;
  const numHeight = parseFloat(height) || 0;

  const matchedProducts = useMemo(() => {
    if (numWidth <= 0 || numHeight <= 0) {
      return [];
    }

    return products
      .filter((p) => p.maxWidth >= numWidth && p.maxHeight >= numHeight)
      .sort((a, b) => {
        // rank closer fit first
        const slackA = a.maxWidth - numWidth + (a.maxHeight - numHeight);
        const slackB = b.maxWidth - numWidth + (b.maxHeight - numHeight);
        return slackA - slackB;
      });
  }, [numWidth, numHeight]);

  function handleReset() {
    setWidth("");
    setHeight("");
    setSelectedPreset("");
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] text-[#1a1a1a]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-black/5 bg-white py-14 px-6 md:px-12 lg:px-20">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            Công Cụ Chọn Size Thông Minh 2.0
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Tìm Bao Laptop Vừa Khít 100%
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Chọn model máy có sẵn của bạn hoặc nhập chiều Dài × Rộng (cm). Hệ thống sẽ tự động tính toán độ ôm sát hoàn hảo và đề xuất các mẫu tương thích.
          </p>
        </div>
      </section>

      {/* Main interactive finder */}
      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Column: Preset Selector & Custom Inputs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Presets Box */}
              <div className="rounded-3xl border border-black/5 bg-white p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    ⚡ Chọn nhanh theo dòng máy:
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {POPULAR_LAPTOPS.map((laptop) => (
                    <button
                      key={laptop.name}
                      onClick={() => applyPreset(laptop)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition text-xs ${
                        selectedPreset === laptop.name
                          ? "bg-black text-white font-bold shadow-md"
                          : "bg-[#f8f6f2] text-gray-700 hover:bg-[#ece8e1]"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{laptop.name}</p>
                        <p className={`text-[10px] mt-0.5 ${selectedPreset === laptop.name ? "text-gray-300" : "text-gray-400"}`}>
                          {laptop.brand} • {laptop.screenSize}
                        </p>
                      </div>
                      <span className="font-mono text-[11px] opacity-80">
                        {laptop.width} × {laptop.height}cm
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Input Box */}
              <div className="rounded-3xl border border-black/5 bg-white p-6 md:p-8 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  📏 Hoặc nhập kích thước đo thực tế:
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Chiều Dài máy (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        setSelectedPreset("");
                      }}
                      placeholder="Ví dụ: 31.5"
                      className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-[#f8f6f2] p-3 text-sm font-bold text-gray-800 outline-none focus:border-black focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-gray-600">
                      Chiều Rộng máy (cm)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={height}
                      onChange={(e) => {
                        setHeight(e.target.value);
                        setSelectedPreset("");
                      }}
                      placeholder="Ví dụ: 22.0"
                      className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-[#f8f6f2] p-3 text-sm font-bold text-gray-800 outline-none focus:border-black focus:bg-white transition"
                    />
                  </div>
                </div>

                {numWidth > 0 && numHeight > 0 && (
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Đang tìm bao vừa: <strong className="text-black">{numWidth} × {numHeight} cm</strong>
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      Xóa nhập lại
                    </button>
                  </div>
                )}

                {/* Guide Tip */}
                <div className="mt-6 rounded-2xl bg-amber-50 p-4 border border-amber-200/60 text-xs text-amber-900 leading-relaxed">
                  💡 <strong>Mẹo đo chuẩn xác:</strong> Đặt laptop gập kín lên mặt bàn phẳng, dùng thước kẻ hoặc thước dây đo viền ngoài cùng của chiều dài và chiều rộng (tính cả độ cong của vỏ máy).
                </div>
              </div>
            </div>

            {/* Right Column: Matched Products Results */}
            <div className="lg:col-span-7">
              {numWidth > 0 && numHeight > 0 ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-gray-900">
                        {matchedProducts.length} Mẫu Bao Phù Hợp Hoàn Hảo
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Sắp xếp theo độ vừa vặn ôm sát từ cao đến thấp
                      </p>
                    </div>
                  </div>

                  {matchedProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {matchedProducts.map((product) => {
                        const slackW = (product.maxWidth - numWidth).toFixed(1);
                        const slackH = (product.maxHeight - numHeight).toFixed(1);
                        const isSnugFit = parseFloat(slackW) <= 1.5 && parseFloat(slackH) <= 1.5;

                        return (
                          <div key={product.id} className="relative flex flex-col">
                            {/* Fit Indicator pill */}
                            <div className="mb-2 flex items-center justify-between text-[11px]">
                              <span
                                className={`rounded-full px-2.5 py-0.5 font-bold ${
                                  isSnugFit
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-blue-100 text-blue-800"
                                }`}
                              >
                                {isSnugFit ? "✓ Vừa ôm khít tuyệt đối" : "✓ Vừa vặn thoải mái"}
                              </span>
                              <span className="text-gray-400 font-mono">
                                Dư +{slackW}cm / +{slackH}cm
                              </span>
                            </div>
                            <ProductCard
                              product={product}
                              onQuickView={(p) => setQuickViewProduct(p)}
                            />
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-20 text-center rounded-3xl bg-white border border-black/5 p-8 shadow-sm">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-2xl">
                        ⚠️
                      </div>
                      <h3 className="mt-4 font-bold text-gray-900">
                        Chưa tìm thấy bao có kích thước vừa {numWidth} × {numHeight} cm
                      </h3>
                      <p className="mt-2 text-xs text-gray-500 max-w-sm mx-auto">
                        Laptop của bạn có kích thước vượt chuẩn hoặc đặc biệt. Vui lòng mở AI tư vấn để được hỗ trợ kiểm tra mẫu máy trạm phù hợp!
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                /* Empty / Intro state */
                <div className="flex h-full flex-col items-center justify-center rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f8f6f2] text-3xl mb-4">
                    💻
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Bắt đầu bằng cách chọn model laptop của bạn
                  </h3>
                  <p className="mt-2 max-w-md text-xs text-gray-500 leading-relaxed">
                    Nhấp vào một trong các dòng máy phổ biến ở cột bên trái hoặc tự điền thông số đo được để xem danh sách các mẫu bao tương thích ngay lập tức!
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2 justify-center">
                    {POPULAR_LAPTOPS.slice(0, 4).map((lp) => (
                      <button
                        key={lp.name}
                        onClick={() => applyPreset(lp)}
                        className="rounded-full bg-[#f6f4f0] px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-black hover:text-white transition"
                      >
                        {lp.name.split(" ")[0]} {lp.screenSize}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <ChatBox />
    </main>
  );
}
