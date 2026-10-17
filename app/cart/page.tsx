"use client";

import { shippingEligibility, CUSTOM_PRICE_NOTICE } from "@/data/business";
import { returningCustomerOffer } from "@/data/vouchers";
import { allProducts } from "@/data/products";
import { contact } from "@/data/contact";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { useCart } from "@/components/CartContext";
import { cartVariantKey } from "@/data/customization";
import { useDialogFocus } from "@/components/useDialogFocus";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import { type Order, createStoredOrder } from "@/data/orders";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
    appliedCoupon,
    discountAmount,
    applyCoupon,
    removeCoupon,
  } = useCart();

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const submitLock = useRef(false);
  const checkoutRef = useDialogFocus(isCheckoutOpen, () => { if (!submitLock.current) setIsCheckoutOpen(false); });
  const [customerName, setCustomerName] = useState("Nguyễn Ngọc Phương Uyên");
  const [phone, setPhone] = useState<string>(contact.phone);
  const [address, setAddress] = useState("Cam Ranh, Khánh Hòa");
  const [note, setNote] = useState("Giao giờ hành chính, gọi trước khi đến");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking">("cod");

  // Coupon input state
  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [checkoutError, setCheckoutError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const showSuccess = placedOrder !== null && cart.length === 0;

  function handleOpenCheckout() {
    if (cart.length === 0) return;
    submitLock.current = false;
    setCheckoutError("");
    setIsCheckoutOpen(true);
  }

  function handleApplyCoupon(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    setCouponFeedback(res);
    if (res.success) {
      setCouponCode("");
    }
  }

  async function handleConfirmOrder(e: React.FormEvent) {
    e.preventDefault();
    if (submitLock.current || cart.length === 0) return;
    submitLock.current = true;
    setSubmitting(true);
    setCheckoutError("");
    const now = Date.now();

    const newOrder: Omit<Order, "orderId"> = {
      items: cart.map(item => ({ ...item, customDimensions: item.customDimensions ? { ...item.customDimensions } : undefined })),
      total: totalPrice,
      totalQuantity: totalItems,
      customerName: customerName.trim() || "Khách hàng",
      phone: phone.trim() || contact.phone,
      address: address.trim() || "Địa chỉ mẫu",
      note: note.trim(),
      paymentMethod,
      discountAmount,
      createdAt: now,
      createdAtDisplay: new Date(now).toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    try {
      const savedOrder = await createStoredOrder(newOrder);
      setPlacedOrder(savedOrder);
      clearCart();
      setIsCheckoutOpen(false);
    } catch {
      submitLock.current = false;
      setCheckoutError("Không thể lưu đơn hàng. Giỏ hàng của bạn vẫn được giữ nguyên. Vui lòng thử lại.");
    } finally {
      setSubmitting(false);
    }
  }

  // Freeship threshold: 300,000₫
  const rawSubtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const remainingForFreeship = shippingEligibility(rawSubtotal).remaining;
  const freeshipProgress = shippingEligibility(rawSubtotal).progress;

  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-12 lg:px-20">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          {showSuccess ? "Đặt hàng thành công!" : "Giỏ Hàng Của Bạn"}
        </h1>
        {!showSuccess && <Link href="/orders" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--secondary)] underline underline-offset-4">Đơn hàng của tôi</Link>}
        <p className="mt-1 text-sm text-gray-500">
          {showSuccess
            ? "CaseUp đã tiếp nhận đơn hàng của bạn."
            : "Quản lý sản phẩm, kích thước đo riêng, nhập mã voucher và tiến hành thanh toán."}
        </p>

        {/* Freeship Progress Bar */}
        {cart.length > 0 && (
          <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
              <span className="flex items-center gap-1.5">
                🚚
                {remainingForFreeship === 0 ? (
                  <span>Bạn đã được <strong>Freeship toàn quốc</strong></span>
                ) : (
                  <span>Mua thêm <strong className="price-text">{remainingForFreeship.toLocaleString("vi-VN")}₫</strong> để được <strong>FREESHIP toàn quốc!</strong></span>
                )}
              </span>
              <span className="font-bold">{freeshipProgress}%</span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-amber-200/50">
              <div
                className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
                style={{ width: `${freeshipProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Checkout confirmation */}
        {showSuccess && placedOrder ? (
          <div className="mx-auto mt-8 max-w-xl rounded-3xl border border-[var(--brand-border)] bg-white p-6 text-center shadow-sm sm:p-10" role="status">
            <Image src="/products/done_product.png" alt="Minh họa đặt hàng thành công"
              width={1254} height={1254} sizes="(min-width: 640px) 176px, 144px"
              className="mx-auto h-auto w-36 rounded-2xl object-contain sm:w-44" />
            <h2 className="mt-5 text-xl font-bold">Cảm ơn bạn, {placedOrder.customerName}!</h2>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href={`/orders?id=${encodeURIComponent(placedOrder.orderId)}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-[var(--primary)] px-6 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--secondary)]">Xem đơn hàng</Link>
              <Link href="/products" className="inline-flex min-h-11 items-center justify-center rounded-full border border-[var(--border)] px-6 py-3 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--secondary)]">Tiếp tục mua sắm</Link>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* ───── TRƯỜNG HỢP 2: GIỎ TRỐNG ───── */
          <div className="mt-12 rounded-3xl border border-[var(--brand-border)] bg-white p-8 sm:p-12 text-center shadow-sm max-w-xl mx-auto">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner">
              🛍️
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
            <p className="mt-2 text-xs md:text-sm text-gray-500 max-w-sm mx-auto">
              Chưa có sản phẩm nào được chọn. Hãy khám phá bộ sưu tập hoặc trải nghiệm tự thiết kế bao theo máy!
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href="/products"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[var(--primary)] px-6 py-3 text-xs sm:text-sm font-bold text-[var(--on-primary)] shadow-md hover:bg-[var(--brand-primary-hover)] transition"
              >
                <span>Khám phá sản phẩm</span>
                <span>→</span>
              </Link>
              <Link
                href="/custom"
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-xs sm:text-sm font-bold text-gray-800 shadow-sm hover:bg-gray-50 transition"
              >
                <span>🎨 Tự thiết kế</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ───── TRƯỜNG HỢP 3: CÓ SẢN PHẨM ───── */
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cột trái: Danh sách mặt hàng */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={cartVariantKey(item)}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 rounded-3xl border border-[var(--brand-border)] bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-24 w-24 sm:h-28 sm:w-28 shrink-0 overflow-hidden rounded-2xl bg-[var(--surface-muted)] border border-[var(--brand-border)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.id}`}
                          className="text-base font-bold text-gray-900 hover:text-amber-600 transition"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedColor, item.selectedButton, item.embroidery, item.sizeMode, item.customDimensions, item.embroideryText)}
                          className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center text-xs font-semibold text-rose-500 hover:text-rose-700 transition"
                          aria-label={`Xóa ${item.name} khỏi giỏ`}
                        >
                          Xóa
                        </button>
                      </div>

                      <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        {item.sizeMode === "custom" && item.customDimensions ? (
                          <div className="w-full space-y-1">
                            <span className="inline-block rounded-lg bg-[var(--secondary-soft)] px-2.5 py-1 text-xs font-bold text-[var(--secondary-ink)]">
                              Kích thước riêng: {item.customDimensions.lengthCm} × {item.customDimensions.widthCm} × {item.customDimensions.thicknessCm} cm
                            </span>
                            <p className="text-[11px] text-gray-500 italic">
                              CaseUp sẽ xác nhận giá nếu kích thước yêu cầu nằm ngoài mẫu tiêu chuẩn.
                            </p>
                          </div>
                        ) : (
                          <span className="rounded bg-black/5 px-2 py-0.5 font-medium text-gray-700">
                            {item.size}
                          </span>
                        )}

                        {item.embroidery && (
                          <span className="rounded bg-[var(--surface-muted)] px-2 py-0.5 font-medium text-gray-700">
                            {item.embroideryText ? `Thêu: ${item.embroideryText}` : "Có thêu tên"}
                          </span>
                        )}
                        {item.selectedButton && (
                          <span className="rounded bg-[var(--surface-muted)] px-2 py-0.5 font-medium text-[var(--primary-ink)]">
                            Nút: {item.selectedButton}
                          </span>
                        )}
                        {item.selectedColor && (
                          <span className="rounded bg-black/5 px-2 py-0.5 font-medium text-gray-700">
                            Màu: {item.selectedColor}
                          </span>
                        )}
                      </div>

                      <p className="price-text mt-3 font-bold text-base sm:text-lg">
                        {item.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id, item.selectedColor, item.selectedButton, item.embroidery, item.sizeMode, item.customDimensions, item.embroideryText)}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                          aria-label="Giảm số lượng"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-bold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id, item.selectedColor, item.selectedButton, item.embroidery, item.sizeMode, item.customDimensions, item.embroideryText)}
                          className="flex h-11 w-11 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                          aria-label="Tăng số lượng"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-gray-700">
                        Thành tiền:{" "}
                        <strong className="price-text text-sm">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cột phải: Voucher & Tóm tắt thanh toán */}
            <div className="space-y-4">
              {/* Voucher Box */}
              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-1.5">
                  🎟️ Mã giảm giá / Voucher
                </h3>

                {appliedCoupon ? (
                  <div className="flex items-center justify-between rounded-2xl bg-emerald-50 p-3 border border-emerald-200 text-xs">
                    <div>
                      <p className="font-bold text-emerald-800">
                        Đang áp dụng: {appliedCoupon}
                      </p>
                      <p className="price-text text-[11px]">
                        Giảm {discountAmount.toLocaleString("vi-VN")}₫
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="min-h-[44px] px-2 text-xs font-bold text-rose-500 hover:text-rose-700"
                    >
                      Bỏ mã
                    </button>
                  </div>
                ) : (
                  <div>
                    <form onSubmit={handleApplyCoupon} className="flex gap-2">
                      <input
                        type="text"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        placeholder="Nhập mã được CaseUp cung cấp"
                        className="flex-1 min-h-[44px] rounded-2xl border border-gray-200 bg-[var(--background)] px-3.5 py-2 text-xs uppercase font-bold outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="min-h-[44px] rounded-2xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-[var(--on-primary)] hover:bg-[var(--brand-primary-hover)] transition"
                      >
                        Áp dụng
                      </button>
                    </form>

                    {couponFeedback && (
                      <p
                        className={`mt-2 text-xs font-semibold ${
                          couponFeedback.success ? "text-emerald-700" : "text-rose-600"
                        }`}
                      >
                        {couponFeedback.message}
                      </p>
                    )}

                    <div className="mt-3 text-xs text-[var(--text-secondary)]">{returningCustomerOffer.title}. {returningCustomerOffer.description}</div>
                  </div>
                )}
              </div>

              {cart.some(item => allProducts.find(p => p.id === item.id)?.madeToMeasure) && <p className="rounded-2xl bg-[var(--secondary-soft)] p-4 text-sm">{CUSTOM_PRICE_NOTICE}</p>}
              {/* Tóm tắt thanh toán */}
              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-gray-900 border-b border-gray-100 pb-3">
                  Tóm tắt đơn hàng ({totalItems} món)
                </h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="flex justify-between">
                    <span>Tạm tính:</span>
                    <span className="price-text font-semibold">
                      {rawSubtotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700">
                      <span>Giảm giá ({appliedCoupon}):</span>
                      <span className="price-text font-bold">
                        -{discountAmount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <span>Phí vận chuyển toàn quốc:</span>
                    <span className="price-text font-semibold">
                      {shippingEligibility(rawSubtotal).free ? "0₫ (Freeship)" : "Chờ xác nhận phí giao hàng"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-gray-900">Tạm tính thanh toán:</span>
                  <span className="price-text text-2xl font-extrabold">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="w-full min-h-[48px] rounded-full bg-[var(--primary)] px-6 py-3.5 text-sm font-bold text-[var(--on-primary)] shadow-md hover:bg-[var(--brand-primary-hover)] transition hover-lift flex items-center justify-center gap-2"
                >
                  <span>Tiến hành đặt hàng COD</span>
                  <span>→</span>
                </button>

                <p className="text-center text-[11px] text-gray-500">
                  🛡️ Đổi Trả 3 Ngày · Không vừa size đổi ngay
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="checkout-modal-title"
          ref={checkoutRef}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
        >
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => { if (!submitLock.current) setIsCheckoutOpen(false); }}
            aria-hidden="true"
          />

          <div className="relative z-10 w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 id="checkout-modal-title" className="text-lg font-extrabold text-gray-900">
                  Xác nhận đặt hàng COD
                </h3>
                <p className="text-xs text-gray-500">Kiểm tra thông tin giao nhận tận tay</p>
              </div>
              <button
                type="button"
                onClick={() => { if (!submitLock.current) setIsCheckoutOpen(false); }}
                aria-label="Đóng thanh toán"
                className="flex h-11 w-11 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-2 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
              <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider">
                Mặt hàng đã chọn:
              </h4>
              {cart.map((item) => (
                <div key={cartVariantKey(item)} className="text-xs leading-relaxed border-b border-gray-100 last:border-none pb-2 last:pb-0">
                  <p className="font-semibold text-gray-900">{item.name} × {item.quantity}</p>
                  <p className="text-[var(--text-secondary)]">
                    {item.sizeMode === "custom" && item.customDimensions
                      ? `Kích thước riêng: ${item.customDimensions.lengthCm} × ${item.customDimensions.widthCm} × ${item.customDimensions.thicknessCm} cm`
                      : item.size}
                    {item.selectedColor ? ` · Màu ${item.selectedColor}` : ""}
                    {item.selectedButton ? ` · Nút: ${item.selectedButton}` : ""}
                    {item.embroidery ? " · Có thêu tên" : ""}
                  </p>
                </div>
              ))}
              <p className="text-[11px] text-[var(--secondary-ink)] font-semibold pt-1">
                ✓ Đổi Trả 3 Ngày · Không vừa size đổi ngay
              </p>
            </div>

            <form onSubmit={handleConfirmOrder} className="mt-5 space-y-4 text-xs">
              <div>
                <label htmlFor="checkout-name" className="block font-semibold text-gray-700 mb-1">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  id="checkout-name"
                  autoComplete="name"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="checkout-phone" className="block font-semibold text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  id="checkout-phone"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="checkout-address" className="block font-semibold text-gray-700 mb-1">
                  Địa chỉ giao hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  id="checkout-address"
                  autoComplete="street-address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full min-h-[44px] rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label htmlFor="checkout-note" className="block font-semibold text-gray-700 mb-1">
                  Ghi chú cho xưởng may CaseUp (tùy chọn)
                </label>
                <input
                  type="text"
                  id="checkout-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="VD: Giao giờ hành chính, gọi trước khi đến"
                  className="w-full min-h-[44px] rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <span className="block font-semibold text-gray-700 mb-2">Hình thức thanh toán</span>
                <div className="grid grid-cols-2 gap-3">
                  <label
                    className={`flex min-h-[44px] items-center gap-2.5 rounded-2xl border p-3 cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)]"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-[var(--primary)]"
                    />
                    <span className="font-semibold text-gray-800">💵 Trả tiền khi nhận (COD)</span>
                  </label>

                  <label
                    className={`flex min-h-[44px] items-center gap-2.5 rounded-2xl border p-3 cursor-pointer transition ${
                      paymentMethod === "banking"
                        ? "border-2 border-[var(--primary)] bg-[var(--primary-soft)]"
                        : "border-gray-200"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="banking"
                      checked={paymentMethod === "banking"}
                      onChange={() => setPaymentMethod("banking")}
                      className="accent-[var(--primary)]"
                    />
                    <span className="font-semibold text-gray-800">🏦 Chuyển khoản QR</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex justify-between items-baseline text-sm">
                <span className="font-semibold text-gray-700">Tổng thanh toán:</span>
                <span className="price-text text-xl font-extrabold">{totalPrice.toLocaleString("vi-VN")}₫</span>
              </div>

              <button
                type="submit"
                disabled={submitting}
                aria-busy={submitting}
                className="w-full min-h-[48px] rounded-full bg-[var(--primary)] py-3.5 text-sm font-bold text-[var(--on-primary)] shadow-md hover:bg-[var(--brand-primary-hover)] transition hover-lift"
              >
                {submitting ? "Đang lưu đơn hàng..." : "Xác nhận hoàn tất đơn hàng"}
              </button>
              {checkoutError && <p role="alert" className="text-sm text-red-800">{checkoutError}</p>}
            </form>
          </div>
        </div>
      )}

      <ChatBox />
    </main>
  );
}
