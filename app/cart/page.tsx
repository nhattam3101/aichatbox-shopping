"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart, CartItem } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";

type Order = {
  orderId: string;
  items: CartItem[];
  total: number;
  totalQuantity: number;
  customerName: string;
  phone: string;
  address: string;
  note: string;
  paymentMethod: "cod" | "banking";
  createdAt: string;
  discountAmount?: number;
};

const COUNTDOWN_SECONDS = 30; // Thời gian mô phỏng đơn hàng tự động hoàn tất

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
  const [customerName, setCustomerName] = useState("Nguyễn Ngọc Phương Uyên");
  const [phone, setPhone] = useState("0988 123 456");
  const [address, setAddress] = useState("Cam Ranh, Khánh Hòa");
  const [note, setNote] = useState("Giao giờ hành chính, gọi trước khi đến");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking">("cod");

  // Coupon input state
  const [couponCode, setCouponCode] = useState("");
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Simulated Order state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [justReset, setJustReset] = useState(false);

  // Countdown timer for simulated order
  useEffect(() => {
    if (!placedOrder) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setPlacedOrder(null);
          setJustReset(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [placedOrder]);

  function handleOpenCheckout() {
    if (cart.length === 0) return;
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

  function handleQuickCoupon(code: string) {
    const res = applyCoupon(code);
    setCouponFeedback(res);
  }

  function handleConfirmOrder(e: React.FormEvent) {
    e.preventDefault();

    const newOrder: Order = {
      orderId: `#CU-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      total: totalPrice,
      totalQuantity: totalItems,
      customerName: customerName.trim() || "Khách hàng",
      phone: phone.trim() || "0988 123 456",
      address: address.trim() || "Địa chỉ mẫu",
      note: note.trim(),
      paymentMethod,
      discountAmount,
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setTimeLeft(COUNTDOWN_SECONDS);
    setPlacedOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
  }

  // Freeship threshold: 300,000₫
  const FREESHIP_THRESHOLD = 300000;
  const rawSubtotal = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const remainingForFreeship = Math.max(0, FREESHIP_THRESHOLD - rawSubtotal);
  const freeshipProgress = Math.min(100, Math.round((rawSubtotal / FREESHIP_THRESHOLD) * 100));

  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[#1a1a1a]">
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-20">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
          Giỏ Hàng Của Bạn
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Quản lý sản phẩm, nhập mã voucher và tiến hành thanh toán COD tiện lợi.
        </p>

        {/* Freeship Progress Bar */}
        {cart.length > 0 && !placedOrder && (
          <div className="mt-6 rounded-2xl border border-amber-200/60 bg-amber-50/60 p-4">
            <div className="flex items-center justify-between text-xs font-semibold text-amber-900">
              <span className="flex items-center gap-1.5">
                🚚
                {remainingForFreeship === 0 ? (
                  <span>Chúc mừng! Bạn đã nhận được <strong>Miễn phí giao hàng toàn quốc</strong> 🎉</span>
                ) : (
                  <span>Mua thêm <strong className="price-text">{remainingForFreeship.toLocaleString("vi-VN")}₫</strong> để được <strong>FREESHIP toàn quốc!</strong></span>
                )}
              </span>
              <span className="font-bold">{freeshipProgress}%</span>
            </div>
            <div className="mt-2.5 h-2 w-full overflow-hidden rounded-full bg-amber-200/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                style={{ width: `${freeshipProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* ───── TRƯỜNG HỢP 1: ĐÃ ĐẶT HÀNG (MÔ PHỎNG ORDER THÀNH CÔNG) ───── */}
        {placedOrder ? (
          <div className="mt-8 space-y-8 animate-fade-in-up">
            {/* Banner chúc mừng */}
            <div className="relative overflow-hidden rounded-3xl border border-emerald-200/60 bg-[#f5f8f2] p-6 md:p-10 shadow-lg">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 text-2xl">
                    ✓
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-100 px-3 py-0.5 text-xs font-bold text-emerald-800">
                        Đặt hàng thành công
                      </span>
                      <span className="text-xs text-gray-500">Mã đơn: {placedOrder.orderId}</span>
                    </div>
                    <h2 className="mt-2 text-2xl md:text-3xl font-extrabold text-gray-900">
                      Cảm ơn bạn, {placedOrder.customerName}!
                    </h2>
                    <p className="mt-1 text-sm text-gray-600 max-w-lg">
                      Đơn hàng đã được tiếp nhận vào lúc {placedOrder.createdAt}. Nhân viên CaseUp sẽ đóng gói và bàn giao bưu tá giao tận tay bạn.
                    </p>
                  </div>
                </div>

                {/* Hộp đếm ngược tự reset demo */}
                <div className="rounded-2xl border border-black/10 bg-white/90 p-4 shadow-sm backdrop-blur-md text-center shrink-0 min-w-[200px]">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    Tự động làm mới sau
                  </p>
                  <p className="text-3xl font-extrabold text-stone-700 font-mono my-1">
                    00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                  </p>
                  <p className="text-[10px] text-gray-400">để bạn có thể trải nghiệm lại</p>
                  <button
                    onClick={() => {
                      setPlacedOrder(null);
                      setJustReset(true);
                    }}
                    className="mt-2 text-xs font-semibold text-gray-600 hover:text-black underline"
                  >
                    Bỏ qua đếm ngược
                  </button>
                </div>
              </div>

              {/* Progress Steps */}
              <div className="mt-8 border-t border-[var(--brand-border)] pt-6">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="space-y-1.5">
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-800 font-bold">
                      ✓
                    </div>
                    <p className="font-bold text-emerald-700">Đã nhận đơn</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#efe4d6] text-[#70543c] font-bold">
                      📦
                    </div>
                    <p className="font-bold text-[#70543c]">Đang đóng gói</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 font-bold">
                      🚚
                    </div>
                    <p className="text-gray-400">Đang vận chuyển</p>
                  </div>
                  <div className="space-y-1.5">
                    <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 font-bold">
                      💵
                    </div>
                    <p className="text-gray-400">Thanh toán COD</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Chi tiết đơn */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4">Sản phẩm ({placedOrder.totalQuantity})</h3>
                <div className="divide-y divide-gray-100">
                  {placedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 py-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                        <Image src={item.image} alt={item.name} fill className="object-contain p-1" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-gray-900 truncate">{item.name}</h4>
                        <p className="text-[11px] text-gray-400">{item.size} • Số lượng: {item.quantity}</p>
                      </div>
                      <span className="price-text font-bold text-xs">
                        {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm space-y-4 text-sm leading-relaxed">
                <h3 className="font-bold text-gray-900 text-sm mb-3">Thông tin nhận hàng</h3>
                <div>
                  <span className="text-gray-600">Khách hàng:</span>
                  <span className="ml-2 font-bold text-gray-800">{placedOrder.customerName} ({placedOrder.phone})</span>
                </div>
                <div>
                  <span className="text-gray-600">Địa chỉ:</span>
                  <span className="ml-2 text-gray-700">{placedOrder.address}</span>
                </div>
                {placedOrder.note && (
                  <div>
                    <span className="text-gray-600">Ghi chú:</span>
                    <span className="ml-2 italic text-gray-600">&ldquo;{placedOrder.note}&rdquo;</span>
                  </div>
                )}
                <div>
                  <span className="text-gray-600">Thanh toán:</span>
                  <span className="ml-2 font-semibold text-gray-800">
                    {placedOrder.paymentMethod === "cod" ? "Tiền mặt khi nhận hàng (COD)" : "Chuyển khoản VietQR"}
                  </span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex flex-wrap justify-between items-baseline gap-2 text-sm font-bold">
                  <span>Tổng thanh toán:</span>
                  <span className="price-text text-xl font-extrabold">{placedOrder.total.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* ───── TRƯỜNG HỢP 2: GIỎ TRỐNG ───── */
          <div className="mt-12 rounded-3xl border border-[var(--brand-border)] bg-white p-12 text-center shadow-sm max-w-xl mx-auto">
            {justReset && (
              <div className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                ✓ Đơn hàng trước đã hoàn thành và hệ thống đã làm mới giỏ hàng.
              </div>
            )}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-50 text-4xl shadow-inner">
              🛍️
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">Giỏ hàng của bạn đang trống</h2>
            <p className="mt-2 text-xs md:text-sm text-gray-500 max-w-sm mx-auto">
              Chưa có sản phẩm nào được chọn. Hãy khám phá bộ sưu tập các mẫu bao laptop cao cấp ngay hôm nay!
            </p>
            <Link
              href="/products"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-7 py-3.5 text-xs md:text-sm font-semibold text-white shadow-md hover:bg-[var(--brand-primary-hover)] transition"
            >
              <span>Khám phá sản phẩm ngay</span>
              <span>→</span>
            </Link>
          </div>
        ) : (
          /* ───── TRƯỜNG HỢP 3: CÓ SẢN PHẨM ───── */
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Cột trái: Danh sách mặt hàng */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor || "default"}`}
                  className="flex gap-4 sm:gap-6 rounded-3xl border border-[var(--brand-border)] bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#f2eee9] border border-[var(--brand-border)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
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
                          onClick={() => removeFromCart(item.id, item.selectedColor)}
                          className="text-xs font-semibold text-rose-500 hover:text-rose-700 transition"
                        >
                          Xóa
                        </button>
                      </div>

                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                        <span className="rounded bg-black/5 px-2 py-0.5 font-medium text-gray-700">
                          {item.size}
                        </span>
                        {item.selectedColor && (
                          <span className="rounded bg-black/5 px-2 py-0.5 font-medium text-gray-700">
                            Màu: {item.selectedColor}
                          </span>
                        )}
                      </div>

                      <p className="price-text mt-2 font-bold text-sm sm:text-base">
                        {item.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id, item.selectedColor)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                        >
                          −
                        </button>
                        <span className="w-6 text-center text-xs font-bold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id, item.selectedColor)}
                          className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-gray-700">
                        Thành tiền:{" "}
                        <strong className="price-text">
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
                      onClick={removeCoupon}
                      className="text-xs font-bold text-rose-500 hover:text-rose-700"
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
                        placeholder="Nhập mã (CASEUP10, VIP20)"
                        className="flex-1 rounded-2xl border border-gray-200 bg-[#f9f8f6] px-3.5 py-2 text-xs uppercase font-bold outline-none focus:border-black"
                      />
                      <button
                        type="submit"
                        className="rounded-2xl bg-[var(--primary)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--brand-primary-hover)] transition"
                      >
                        Áp dụng
                      </button>
                    </form>

                    {couponFeedback && (
                      <p className={`mt-2 text-xs font-medium ${couponFeedback.success ? "text-emerald-600" : "text-rose-600"}`}>
                        {couponFeedback.message}
                      </p>
                    )}

                    {/* Quick Voucher Chips */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon("CASEUP10")}
                        className="rounded-full bg-amber-50 px-2.5 py-1 text-[10px] font-bold text-amber-800 border border-amber-200 hover:bg-amber-100 transition"
                      >
                        ⚡ CASEUP10 (-10%)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleQuickCoupon("VIP20")}
                        className="rounded-full bg-purple-50 px-2.5 py-1 text-[10px] font-bold text-purple-800 border border-purple-200 hover:bg-purple-100 transition"
                      >
                        👑 VIP20 (-20%)
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Summary Box */}
              <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-6 shadow-sm">
                <h2 className="text-base font-bold text-gray-900">Tóm tắt đơn hàng</h2>

                <div className="mt-4 space-y-2.5 border-b border-gray-100 pb-4 text-xs sm:text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Số lượng:</span>
                    <span className="font-semibold text-gray-900">{totalItems} món</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Tạm tính:</span>
                    <span className="price-text font-semibold">
                      {rawSubtotal.toLocaleString("vi-VN")}₫
                    </span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600">
                      <span>Giảm giá ({appliedCoupon}):</span>
                      <span className="price-text font-bold">
                        -{discountAmount.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Phí vận chuyển:</span>
                    <span className="price-text font-semibold">
                      {remainingForFreeship === 0 ? "0₫ (Freeship)" : "Miễn phí toàn quốc"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-gray-900">Tổng thanh toán:</span>
                  <span className="price-text text-2xl font-extrabold">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>

                {/* Checkout Trigger */}
                <button
                  type="button"
                  onClick={handleOpenCheckout}
                  className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--primary)] py-4 text-sm font-bold text-white shadow-md transition-all hover:bg-[var(--brand-primary-hover)] hover:shadow-xl active:scale-98"
                >
                  <span>📦 Đặt Hàng Nhận COD</span>
                </button>

                <p className="mt-3 text-center text-[11px] text-gray-400">
                  🛡️ Miễn phí kiểm tra hàng trước khi thanh toán.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ───── MODAL THANH TOÁN COD ───── */}
      {isCheckoutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Xác nhận thông tin giao hàng</h3>
                <p className="text-xs text-gray-500">Thanh toán khi nhận hàng (COD)</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="mt-5 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Địa chỉ giao hàng <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1">
                  Ghi chú cho shipper (tùy chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 p-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-1.5">
                  Hình thức thanh toán
                </label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 rounded-2xl border p-3 cursor-pointer border-amber-500 bg-amber-50/50">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="accent-amber-600"
                    />
                    <div>
                      <span className="font-bold text-gray-900 text-sm">💵 Thanh toán khi nhận hàng (COD)</span>
                      <p className="text-[11px] text-gray-500">Kiểm tra bao laptop vừa vặn trước khi trả tiền</p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tóm tắt tiền */}
              <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100 space-y-1">
                <div className="flex justify-between text-gray-600">
                  <span>Tổng tiền hàng ({totalItems} món):</span>
                  <span className="price-text">{rawSubtotal.toLocaleString("vi-VN")}₫</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span>Mã giảm giá ({appliedCoupon}):</span>
                    <span className="price-text">-{discountAmount.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Phí ship:</span>
                  <span className="price-text font-bold">0₫ (Freeship)</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-sm text-gray-900">
                  <span>Thanh toán:</span>
                  <span className="price-text text-base font-extrabold">{totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>
              </div>

              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 rounded-full border border-gray-300 py-3 text-xs font-semibold text-gray-700 hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-[var(--primary)] py-3 text-xs font-semibold text-white shadow-md hover:bg-[var(--brand-primary-hover)]"
                >
                  Xác nhận đặt hàng COD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ChatBox />
    </main>
  );
}
