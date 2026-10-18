"use client";
import AntigravityBackground from "@/components/AntigravityBackground";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import ButtonSelector from "@/components/ButtonSelector";
import CustomSizeSelector from "@/components/CustomSizeSelector";
import ReturnPolicyModal from "@/components/ReturnPolicyModal";
import AiMockupGenerator from "@/components/AiMockupGenerator";
import { products, accessories, services, customMadeProduct, type Product } from "@/data/products";
import { type ButtonName } from "@/data/customization";
import { validateCustomDimensions } from "@/data/size-validation";
import { customSizeQuote, CUSTOM_PRICE_NOTICE } from "@/data/business";
import { useCart } from "@/components/CartContext";

// Sleeves available for customization
const sleeveProducts = products.filter((p) => p.kind === "sleeve");
const embroideryService = services.find((p) => p.id === 7)!;

export default function CustomStudio() {
  const { addToCart } = useCart();

  // Step 1: Chọn thiết bị / kích thước
  const [selectedProduct, setSelectedProduct] = useState<Product>(customMadeProduct);

  // Step 2: Kích thước tiêu chuẩn hoặc custom
  const [sizeMode, setSizeMode] = useState<"standard" | "custom">("custom");
  const [customLength, setCustomLength] = useState("");
  const [customWidth, setCustomWidth] = useState("");
  const [customThickness, setCustomThickness] = useState("");
  const [customTouched, setCustomTouched] = useState(false);

  // Step 3: Chọn màu vải
  const [selectedColor, setSelectedColor] = useState<string>(
    selectedProduct.colors[0] ?? ""
  );

  // Step 4: Chọn mẫu cúc / nút
  const [selectedButton, setSelectedButton] = useState<ButtonName>("Baby Blue");

  // Step 5: Chọn phụ kiện
  const [selectedAccessoryId, setSelectedAccessoryId] = useState<number | null>(null);

  // Step 6: Thêu tên
  const [embroidery, setEmbroidery] = useState<boolean>(false);
  const [embroideryText, setEmbroideryText] = useState<string>("");

  // Modals & UI states
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Validation
  const customValidation = validateCustomDimensions(customLength, customWidth, customThickness);

  // Active accessory product
  const selectedAccessory = selectedAccessoryId
    ? accessories.find((a) => a.id === selectedAccessoryId)
    : null;

  // Price calculation
  const customQuote = customSizeQuote(customValidation.dimensions);
  const basePrice = selectedProduct.madeToMeasure ? customQuote.price : selectedProduct.price;
  const embroideryPrice = embroidery ? embroideryService.price : 0;
  const accessoryPrice = selectedAccessory ? selectedAccessory.price : 0;
  const totalPrice = basePrice + embroideryPrice + accessoryPrice;

  function handleSelectDevice(prod: Product) {
    setSelectedProduct(prod);
    setSizeMode(prod.madeToMeasure ? "custom" : "standard");
    // If the currently selected color is not in the new product's colors, pick its first
    if (!prod.colors.includes(selectedColor)) {
      setSelectedColor(prod.colors[0] ?? "");
    }
  }

  function handleAddToCart() {
    if (sizeMode === "custom") {
      setCustomTouched(true);
      if (!customValidation.isValid || !customValidation.dimensions) {
        // Scroll to custom size section
        const el = document.getElementById("custom-size-step");
        if (el) {
          el.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
          requestAnimationFrame(() => el.querySelector<HTMLInputElement>('input[aria-invalid="true"]')?.focus({ preventScroll: true }));
        }
        return;
      }
    }

    // 1. Add customized sleeve
    addToCart({
      id: selectedProduct.id,
      name: selectedProduct.name,
      price: selectedProduct.price,
      image: selectedProduct.image,
      size: selectedProduct.size,
      quantity: 1,
      selectedColor,
      selectedButton,
      embroidery,
      embroideryText: embroidery ? embroideryText.trim() : undefined,
      sizeMode,
      customDimensions: sizeMode === "custom" ? customValidation.dimensions : undefined,
    });

    // 2. Add embroidery service line item if checked
    if (embroidery) {
      addToCart(
        {
          id: embroideryService.id,
          name: embroideryText.trim()
            ? `Dịch vụ thêu tên: "${embroideryText.trim()}"`
            : embroideryService.name,
          price: embroideryService.price,
          image: embroideryService.image,
          size: embroideryService.size,
          quantity: 1,
        },
        false
      );
    }

    // 3. Add accessory if selected
    if (selectedAccessory) {
      addToCart(
        {
          id: selectedAccessory.id,
          name: selectedAccessory.name,
          price: selectedAccessory.price,
          image: selectedAccessory.image,
          size: selectedAccessory.size,
          quantity: 1,
        },
        false
      );
    }

    setAddedSuccess(true);
    setTimeout(() => setAddedSuccess(false), 3000);
  }

  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)]">
      <Navbar />

      {/* Header Banner */}
      <section className="relative isolate overflow-hidden border-b border-[var(--brand-border)] bg-white py-10 md:py-14">
        <AntigravityBackground stronger />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-12 lg:px-20 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-800">
            <span>✨ Tự Thiết Kế CaseUp Handmade</span>
          </div>
          <h1 id="main-content" tabIndex={-1} className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900">
            Cá Nhân Hóa Chiếc Bao Của Bạn
          </h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Chọn thiết bị, đo số đo riêng của máy, tự do phối màu vải, chọn mẫu nút cúc và thêu tên cá nhân. CaseUp sẽ may thủ công tỉ mỉ theo đúng gu của bạn.
          </p>
        </div>
      </section>

      {/* Main Studio Area */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 md:px-12 lg:px-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
          {/* Left Column: Interactive Configuration Steps */}
          <div className="space-y-10">
            {/* ───── BƯỚC 1: CHỌN THIẾT BỊ / KÍCH THƯỚC ───── */}
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--on-primary)]">
                    1
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Chọn sản phẩm tiêu chuẩn hoặc may theo số đo
                  </h2>
                </div>
                <span className="text-xs text-gray-500">Bước 1 / 6</span>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {sleeveProducts.map((p) => {
                  const isSelected = selectedProduct.id === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => handleSelectDevice(p)}
                      aria-pressed={isSelected}
                      className={`min-h-[44px] text-left rounded-2xl p-4 transition-all border ${
                        isSelected
                          ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)] shadow-sm"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-[var(--surface-muted)] mb-3">
                        <Image
                          src={p.image}
                          alt={p.name}
                          fill
                          className="object-contain p-2"
                        />
                      </div>
                      <p className="text-xs font-bold text-gray-900 line-clamp-1">
                        {p.name}
                      </p>
                      <p className="text-[11px] text-gray-500 mt-0.5">
                        {p.madeToMeasure ? "Nhập ba số đo riêng" : `${p.maxWidth} × ${p.maxHeight} × ${p.maxThickness} cm`}
                      </p>
                      <p className="price-text text-xs font-extrabold mt-2">
                        {p.price.toLocaleString("vi-VN")}₫
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ───── BƯỚC 2: CHỌN SIZE TIÊU CHUẨN HOẶC CUSTOM DIMENSIONS ───── */}
            <div id="custom-size-step" className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--on-primary)]">
                    2
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Kích thước máy
                  </h2>
                </div>
                <span className="text-xs text-gray-500">Bước 2 / 6</span>
              </div>

              <div className="mt-4">
                <CustomSizeSelector
                  sizeMode={sizeMode}
                  customOnly={!!selectedProduct.madeToMeasure}
                  onSizeModeChange={mode => { if (mode === "custom") handleSelectDevice(customMadeProduct); else setSizeMode("standard"); }}
                  length={customLength}
                  width={customWidth}
                  thickness={customThickness}
                  onLengthChange={(val) => {
                    setCustomLength(val);
                    setCustomTouched(true);
                  }}
                  onWidthChange={(val) => {
                    setCustomWidth(val);
                    setCustomTouched(true);
                  }}
                  onThicknessChange={(val) => {
                    setCustomThickness(val);
                    setCustomTouched(true);
                  }}
                  standardDimensionsText={`${selectedProduct.maxWidth} × ${selectedProduct.maxHeight} × ${selectedProduct.maxThickness ?? 2} cm (${selectedProduct.size})`}
                  validation={customValidation}
                  isSubmittedOrTouched={customTouched}
                />
              </div>
            </div>

            {/* ───── BƯỚC 3: CHỌN MÀU VẢI ───── */}
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--on-primary)]">
                    3
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Chọn màu vải yêu thích
                  </h2>
                </div>
                <span className="text-xs text-gray-500">Bước 3 / 6</span>
              </div>

              <div className="mt-5">
                <p className="text-xs text-gray-500 mb-3">
                  Màu vải đang chọn: <strong className="text-gray-900 text-sm">{selectedColor}</strong>
                </p>
                <div className="flex flex-wrap gap-2.5">
                  {selectedProduct.colors.map((color) => {
                    const isChosen = selectedColor === color;
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        aria-pressed={isChosen}
                        className={`min-h-[44px] rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all ${
                          isChosen
                            ? "border-2 border-[var(--secondary)] bg-[var(--secondary-soft)] text-[var(--secondary-ink)] shadow-sm"
                            : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ───── BƯỚC 4: CHỌN MẪU CÚC / NÚT ───── */}
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--on-primary)]">
                    4
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Chọn mẫu cúc / nút bấm
                  </h2>
                </div>
                <span className="text-xs text-gray-500">Bước 4 / 6</span>
              </div>

              <div className="mt-5">
                <ButtonSelector value={selectedButton} onChange={setSelectedButton} />
              </div>
            </div>

            {/* ───── BƯỚC 5: CHỌN PHỤ KIỆN ───── */}
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--on-primary)]">
                    5
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Chọn phụ kiện kèm theo (tùy chọn)
                  </h2>
                </div>
                <span className="text-xs text-gray-500">Bước 5 / 6</span>
              </div>

              <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Không chọn option */}
                <button
                  type="button"
                  onClick={() => setSelectedAccessoryId(null)}
                  aria-pressed={selectedAccessoryId === null}
                  className={`min-h-[44px] rounded-2xl p-3 text-center border transition ${
                    selectedAccessoryId === null
                      ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)]"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex h-12 w-full items-center justify-center text-gray-400 text-lg">
                    🚫
                  </div>
                  <p className="text-xs font-bold text-gray-800 mt-1">Không chọn</p>
                  <p className="text-[11px] text-gray-400">+0₫</p>
                </button>

                {accessories.map((acc) => {
                  const isSelected = selectedAccessoryId === acc.id;
                  return (
                    <button
                      key={acc.id}
                      type="button"
                      onClick={() => setSelectedAccessoryId(acc.id)}
                      aria-pressed={isSelected}
                      className={`min-h-[44px] rounded-2xl p-3 text-left border transition ${
                        isSelected
                          ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)] shadow-sm"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-[var(--surface-muted)] mb-2">
                        <Image
                          src={acc.image}
                          alt={acc.name}
                          fill
                          className="object-contain p-1"
                        />
                      </div>
                      <p className="text-xs font-bold text-gray-900 truncate" title={acc.name}>
                        {acc.name}
                      </p>
                      <p className="price-text text-[11px] font-extrabold mt-0.5">
                        +{acc.price.toLocaleString("vi-VN")}₫
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ───── BƯỚC 6: THÊU TÊN ───── */}
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-xs font-bold text-[var(--on-primary)]">
                    6
                  </span>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900">
                    Thêu tên cá nhân theo yêu cầu
                  </h2>
                </div>
                <span className="text-xs text-gray-500">Bước 6 / 6</span>
              </div>

              <div className="mt-5 space-y-4">
                <label className="flex min-h-[44px] items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-xs sm:text-sm cursor-pointer transition hover:bg-white">
                  <input
                    type="checkbox"
                    checked={embroidery}
                    onChange={(e) => setEmbroidery(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 accent-[var(--primary)]"
                  />
                  <span className="font-semibold text-gray-800">
                    Thêu tên riêng lên bao (+{embroideryService.price.toLocaleString("vi-VN")}₫)
                  </span>
                </label>

                {embroidery && (
                  <div className="animate-fade-in-up">
                    <label htmlFor="custom-embroidery-name" className="block text-xs font-bold text-gray-700 mb-1">
                      Nội dung tên muốn thêu (tối đa 15 ký tự):
                    </label>
                    <input
                      id="custom-embroidery-name"
                      type="text"
                      maxLength={15}
                      value={embroideryText}
                      onChange={(e) => setEmbroideryText(e.target.value)}
                      placeholder="VD: Phuong Uyen, Sarah N., Duy..."
                      className="w-full min-h-[44px] rounded-2xl border border-gray-300 bg-white px-4 py-2 text-sm font-semibold outline-none focus:border-[var(--primary-ink)]"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Nghệ nhân CaseUp sẽ thêu chỉ nổi đồng điệu với tone màu bạn đã chọn.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Clean Live Summary Panel */}
          <div className="min-w-0 h-fit space-y-6">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-md">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-base font-extrabold text-gray-900 flex items-center gap-2">
                  <span>🎨</span> Thiết kế của bạn
                </h3>
                <span className="rounded-full bg-[var(--primary-soft)] px-2.5 py-0.5 text-xs font-bold text-[var(--primary-ink)]">
                  Live Preview
                </span>
              </div>

              {/* Product Visual */}
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)] mt-4 border border-[var(--brand-border)]">
                <Image
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  fill
                  className="object-contain p-4"
                />
              </div>

              {/* Specifications Summary List */}
              <div className="mt-5 space-y-2.5 text-xs sm:text-sm text-gray-700 divide-y divide-gray-100">
                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">• Thiết bị:</span>
                  <span className="font-bold text-gray-900 text-right">{selectedProduct.name}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">• Kích thước:</span>
                  <span className="font-bold text-gray-900 text-right">
                    {sizeMode === "custom"
                      ? customValidation.isValid && customValidation.dimensions
                        ? `Kích thước riêng: ${customValidation.dimensions.lengthCm} × ${customValidation.dimensions.widthCm} × ${customValidation.dimensions.thicknessCm} cm`
                        : "Chưa hoàn tất đo riêng"
                      : `${selectedProduct.maxWidth} × ${selectedProduct.maxHeight} × ${selectedProduct.maxThickness ?? 2} cm (${selectedProduct.size})`}
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">• Màu vải:</span>
                  <span className="font-bold text-gray-900">{selectedColor}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">• Cúc/nút:</span>
                  <span className="font-bold text-gray-900">{selectedButton}</span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">• Thêu tên:</span>
                  <span className="font-bold text-gray-900">
                    {embroidery
                      ? `Có (+29.000₫)${embroideryText.trim() ? ` · "${embroideryText.trim()}"` : ""}`
                      : "Không thêu"}
                  </span>
                </div>

                <div className="flex justify-between pt-2">
                  <span className="text-gray-500">• Phụ kiện:</span>
                  <span className="font-bold text-gray-900">
                    {selectedAccessory
                      ? `${selectedAccessory.name} (+${selectedAccessory.price.toLocaleString("vi-VN")}₫)`
                      : "Không chọn"}
                  </span>
                </div>
              </div>

              {/* Custom Size Price Notice */}
              {sizeMode === "custom" && (
                <div className="mt-4 rounded-2xl bg-amber-50 border border-amber-200 p-3 text-xs text-amber-900 leading-relaxed">
                  <strong>{CUSTOM_PRICE_NOTICE}</strong>
                </div>
              )}

              {/* Total Calculation */}
              <div className="mt-5 border-t border-gray-100 pt-4 space-y-2">
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Giá bao tiêu chuẩn:</span>
                  <span className="price-text font-semibold">{basePrice.toLocaleString("vi-VN")}₫</span>
                </div>
                {embroideryPrice > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Dịch vụ thêu tên:</span>
                    <span className="price-text font-semibold">+{embroideryPrice.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
                {accessoryPrice > 0 && (
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>Phụ kiện kèm theo:</span>
                    <span className="price-text font-semibold">+{accessoryPrice.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-2 border-t border-gray-100">
                  <span className="text-sm font-bold text-gray-900">Tổng cộng:</span>
                  <span className="price-text text-2xl font-extrabold">{totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 space-y-2.5">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="w-full min-h-[48px] rounded-full bg-[var(--primary)] px-6 py-3.5 text-sm font-bold text-[var(--on-primary)] shadow-md transition hover:bg-[var(--brand-primary-hover)] hover:shadow-lg hover-lift flex items-center justify-center gap-2"
                >
                  <span>Thêm thiết kế vào giỏ hàng</span>
                  <span>🛒</span>
                </button>

                {addedSuccess && (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-2.5 text-center text-xs font-bold text-emerald-800 animate-fade-in-up">
                    ✓ Đã thêm thiết kế vào giỏ hàng thành công!
                  </div>
                )}

                <Link
                  href="/cart"
                  className="w-full min-h-[44px] rounded-full border border-gray-300 bg-white px-6 py-2.5 text-xs font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 flex items-center justify-center gap-1.5"
                >
                  <span>Xem giỏ hàng & thanh toán</span>
                  <span>→</span>
                </Link>
              </div>

              {/* Compact Return Policy trigger */}
              <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                <span>Đổi Trả Trong 3 Ngày</span>
                <button
                  type="button"
                  onClick={() => setIsReturnPolicyOpen(true)}
                  className="font-semibold text-[var(--secondary-ink)] hover:underline"
                >
                  Xem chính sách
                </button>
              </div>
            </div>
            <AiMockupGenerator
              configuration={{ productId: selectedProduct.id, sizeMode,
                customDimensions: sizeMode === "custom" ? customValidation.dimensions : undefined,
                selectedColor, selectedButton, embroidery, embroideryText: embroidery ? embroideryText : "",
                selectedAccessoryId }}
              valid={sizeMode === "standard" || customValidation.isValid}
              changeKey={JSON.stringify([sizeMode, customLength, customWidth, customThickness, embroidery, embroideryText])}
            />
          </div>
        </div>
      </section>

      {/* Return Policy Lightbox Modal */}
      <ReturnPolicyModal
        isOpen={isReturnPolicyOpen}
        onClose={() => setIsReturnPolicyOpen(false)}
      />

      <ChatBox />
    </main>
  );
}
