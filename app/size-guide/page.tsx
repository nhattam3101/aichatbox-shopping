"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { products, type Product } from "@/data/products";
import { validateCustomDimensions } from "@/data/size-validation";
import { recommendSizes } from "@/data/size-rules";
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
  const [thickness, setThickness] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<string>("");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  function applyPreset(preset: LaptopPreset) {
    setThickness("");
    setWidth(preset.width.toString());
    setHeight(preset.height.toString());
    setSelectedPreset(preset.name);
  }

  const numWidth = parseFloat(width) || 0;
  const numHeight = parseFloat(height) || 0;

  const measurements = validateCustomDimensions(width, height, thickness);
  const matchedProducts = useMemo(() => {
    if (!validateCustomDimensions(width, height, thickness).isValid) {
      return [];
    }

    return recommendSizes(numWidth, numHeight, Number(thickness));
  }, [numWidth, numHeight, width, height, thickness]);

  function handleReset() {
    setThickness("");
    setWidth("");
    setHeight("");
    setSelectedPreset("");
  }

  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)]">
      <Navbar />

      {/* Hero Header */}
      <section className="relative overflow-hidden border-b border-[var(--brand-border)] bg-white py-14 px-6 md:px-12 lg:px-20">
        <div className="absolute -left-20 -top-20 h-72 w-72 rounded-full bg-orange-100/40 blur-3xl pointer-events-none" />
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            Công Cụ Chọn Size Thông Minh 2.0
          </span>
          <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Tìm Bao Laptop Phù Hợp Với Máy
          </h1>
          <p className="mt-3 text-sm md:text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Nhập chiều dài × chiều rộng × độ dày thực tế (cm). Thông số chọn nhanh chỉ để tham khảo; hãy đo máy trước khi mua.
          </p>
        </div>
      </section>

      {/* Main interactive finder */}
      <section className="px-6 py-10 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-12">
            {/* Left Column: Preset Selector & Custom Inputs */}
            <div className="lg:col-span-5 space-y-6">
              {/* Custom Input Box */}
              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 md:p-8 shadow-sm">
                <h2 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
                  Nhập kích thước đo thực tế
                </h2>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="device-width" className="text-xs font-semibold text-gray-600">
                      Chiều dài máy (cm)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      id="device-width"
                      value={width}
                      onChange={(e) => {
                        setWidth(e.target.value);
                        setSelectedPreset("");
                      }}
                      placeholder="Ví dụ: 31.5"
                      className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-[var(--surface-muted)] p-3 text-sm font-bold text-gray-800 outline-none focus:border-black focus:bg-white transition"
                    />
                  </div>
                  <div>
                    <label htmlFor="device-height" className="text-xs font-semibold text-gray-600">
                      Chiều rộng máy (cm)
                    </label>
                    <input
                      type="number"
                      required
                      step="0.1"
                      id="device-height"
                      value={height}
                      onChange={(e) => {
                        setHeight(e.target.value);
                        setSelectedPreset("");
                      }}
                      placeholder="Ví dụ: 22.0"
                      className="mt-1.5 w-full rounded-2xl border border-gray-200 bg-[var(--surface-muted)] p-3 text-sm font-bold text-gray-800 outline-none focus:border-black focus:bg-white transition"
                    />
                  </div>
                </div>

                <label className="mt-4 block text-xs font-semibold">Độ dày máy (cm)
                  <input required type="number" min="0.3" max="6" step="0.1" value={thickness} onChange={e => setThickness(e.target.value)} className="mt-2 w-full rounded-2xl border border-gray-200 p-3" />
                </label>
                {!measurements.isValid && <p role="status" className="mt-3 text-xs text-amber-800">Vui lòng nhập đầy đủ chiều dài, chiều rộng và độ dày hợp lệ trước khi chọn size.</p>}
                {numWidth > 0 && numHeight > 0 && (
                  <div className="mt-4 flex items-center justify-between text-xs">
                    <span className="text-gray-500">
                      Đang tìm bao vừa: <strong className="text-[var(--text-primary)]">{numWidth} × {numHeight} cm</strong>
                    </span>
                    <button
                      onClick={handleReset}
                      className="text-xs font-semibold text-red-500 hover:text-red-700"
                    >
                      Xóa nhập lại
                    </button>
                  </div>
                )}


              </div>
              {/* Presets Box */}
              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 md:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900 flex items-center gap-2">
                    Chọn nhanh theo model
                  </h2>
                </div>

                <div className="grid grid-cols-1 gap-2 max-h-[300px] overflow-y-auto pr-1 no-scrollbar">
                  {POPULAR_LAPTOPS.map((laptop) => (
                    <button
                      key={laptop.name}
                      onClick={() => applyPreset(laptop)}
                      className={`flex items-center justify-between rounded-2xl px-4 py-3 text-left transition text-xs ${
                        selectedPreset === laptop.name
                          ? "bg-[var(--secondary-soft)] text-[var(--text-primary)] font-bold ring-2 ring-[var(--secondary)]"
                          : "bg-[var(--surface-muted)] text-gray-700 hover:bg-[var(--soft-blue)]"
                      }`}
                    >
                      <div>
                        <p className="font-semibold">{laptop.name}</p>
                        <p className={`text-[10px] mt-0.5 ${selectedPreset === laptop.name ? "text-[var(--on-primary)]" : "text-gray-600"}`}>
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
            </div>

            {/* Right Column: Matched Products Results */}
            <div className="lg:col-span-7">
              {measurements.isValid ? (
                <div>
                  <div className="mb-6 flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-extrabold text-gray-900">
                        {matchedProducts.length} Mẫu Bao Phù Hợp Theo Số Đo
                      </h2>
                      <p className="text-xs text-gray-500 mt-1">
                        Sắp xếp theo độ vừa vặn ôm sát từ cao đến thấp
                      </p>
                    </div>
                  </div>

                  {matchedProducts.length > 0 ? (
                    <div className="grid gap-6 sm:grid-cols-2">
                      {matchedProducts.map((product) => {
                        const slackW = (product.maxWidth - Math.max(numWidth, numHeight)).toFixed(1);
                        const slackH = (product.maxHeight - Math.min(numWidth, numHeight)).toFixed(1);
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
                                {isSnugFit ? "✓ Gợi ý ôm sát" : "✓ Vừa vặn thoải mái"}
                              </span>
                              <span className="text-gray-600 font-mono">
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
                    <div className="py-20 text-center rounded-3xl bg-white border border-[var(--brand-border)] p-8 shadow-sm">
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
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--surface-muted)] text-3xl mb-4">
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
                        className="rounded-full bg-[var(--surface-muted)] px-3.5 py-1.5 text-xs font-semibold text-gray-700 hover:bg-[var(--brand-primary-hover)] hover:text-[var(--on-primary)] transition"
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

      <section aria-labelledby="reference-heading" className="border-t border-[var(--brand-border)] bg-[var(--brand-cream)] px-6 py-12 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 max-w-2xl">
            <span className="rounded-full bg-[var(--brand-blue)] px-3 py-1 text-xs font-semibold text-[var(--brand-ink)]">Chọn size · chọn màu · chọn nút</span>
            <h2 id="reference-heading" className="mt-4 text-2xl font-bold md:text-3xl">Một chiếc bao, theo màu bạn thích</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">Đối chiếu số đo máy trước, sau đó tham khảo bảng màu vải và màu nút. Màu trên màn hình có thể chênh lệch nhẹ; tùy chọn từng mẫu nằm ở trang sản phẩm.</p>
          </div>
          <article className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm md:p-8">
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">01 · Kích thước</span>
            <h3 className="mt-2 text-xl font-bold">Bảng size tham khảo</h3>
            <p className="mt-2 text-sm text-gray-600">Đo máy khi gập kín, tính cả chiều dài, chiều rộng và độ dày. Size 25 × 36 × 2 cm chỉ dành cho máy thân mỏng ≤ 2 cm.</p>
            <a href="/products/size_table.jpg" target="_blank" rel="noreferrer" className="mt-5 block overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white" aria-label="Mở bảng size đầy đủ">
              <div className="relative aspect-[4/3] sm:aspect-[5/2]"><Image src="/products/size_table.jpg" alt="Bảng 6 size bao CaseUp và thiết bị tương thích" fill sizes="(max-width: 768px) 100vw, 1100px" className="object-contain object-center" /></div>
            </a>
            <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map(p => <div key={p.id} className="rounded-2xl bg-[var(--brand-cream)] p-3 text-sm"><p className="font-bold">{p.maxHeight} × {p.maxWidth} × {p.maxThickness} cm</p><p className="mt-1 text-xs leading-relaxed text-gray-600">{p.name}</p></div>)}
            </div>
          </article>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {[
              { title: "Bảng màu vải", number: "02 · Màu vải", image: "/products/bang_mau.png", description: "Tham khảo baby blue, tím baby, green baby, be kem, hồng phấn cùng các tông màu trong bảng vải thực tế.", background: "bg-[var(--brand-pink)]" },
              { title: "Bảng màu nút", number: "03 · Màu nút", image: "/products/bang_mau_nut.jpg", description: "Phối nút baby blue, vàng, xanh bích, hồng, kem hoặc đỏ để hoàn thiện chiếc bao theo sở thích.", background: "bg-[var(--brand-blue)]" },
            ].map(card => <article key={card.image} className="rounded-3xl border border-[var(--brand-border)] bg-white p-5 shadow-sm md:p-8">
              <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)]">{card.number}</span>
              <h3 className="mt-2 text-xl font-bold">{card.title}</h3>
              <p className="mt-2 min-h-12 text-sm leading-relaxed text-gray-600">{card.description}</p>
              <a href={card.image} target="_blank" rel="noreferrer" aria-label={`Mở ${card.title.toLowerCase()} đầy đủ`} className={`mt-5 block rounded-2xl p-2 sm:p-4 ${card.background}`}>
                <Image src={card.image} alt={card.title + " CaseUp thực tế"} width={1280} height={1280} sizes="(max-width: 768px) 100vw, 550px" className="h-auto w-full rounded-xl object-contain" />
              </a>
              <p className="mt-3 text-xs text-gray-500">Nhấn vào ảnh để xem bảng đầy đủ.</p>
            </article>)}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-12 md:px-12 lg:px-20">
        <aside className="rounded-3xl border border-[var(--border)] bg-[var(--soft-blue)] p-6 text-sm leading-relaxed">
          <h2 className="font-bold">Lưu ý khi đo máy</h2>
          <p className="mt-2 text-[var(--text-primary)]">Gập kín máy, đặt trên mặt phẳng và đo viền ngoài cùng của chiều dài, chiều rộng và độ dày, tính cả phần vỏ cong hoặc ốp đang dùng. Không chọn size chỉ dựa vào số inch màn hình.</p>
          <p className="mt-2 font-medium">Size 25 × 36 × 2 cm chỉ dành cho máy thân mỏng có độ dày tối đa 2 cm.</p>
        </aside>
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
