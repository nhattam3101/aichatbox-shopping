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
};

const COUNTDOWN_SECONDS = 25; // Thời gian mô phỏng đơn hàng tự động mất đi

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  // Checkout modal state
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [customerName, setCustomerName] = useState("Nguyễn Văn Anh");
  const [phone, setPhone] = useState("0988 123 456");
  const [address, setAddress] = useState("123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội");
  const [note, setNote] = useState("Giao giờ hành chính, gọi trước khi đến");
  const [paymentMethod, setPaymentMethod] = useState<"cod" | "banking">("cod");

  // Simulated Order state
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [timeLeft, setTimeLeft] = useState(COUNTDOWN_SECONDS);
  const [justReset, setJustReset] = useState(false);

  // Countdown effect when order is placed
  useEffect(() => {
    if (!placedOrder) return;

    setTimeLeft(COUNTDOWN_SECONDS);

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
      createdAt: new Date().toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      }),
    };

    setPlacedOrder(newOrder);
    clearCart();
    setIsCheckoutOpen(false);
    setJustReset(false);
  }

  function handleResetOrderNow() {
    setPlacedOrder(null);
    setJustReset(true);
  }

  return (
    <main className="min-h-screen bg-[#fafaf8] text-[#1a1a1a]">
      {/* Header */}
      <Navbar />

      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-20">
        <p className="text-xs uppercase tracking-[0.2em] font-bold text-amber-600">
          Shopping Cart
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight md:text-4xl">
          Giỏ hàng của bạn
        </h1>

        {/* ───── TRƯỜNG HỢP 1: ĐÃ ĐẶT ĐƠN HÀNG THÀNH CÔNG (MÔ PHỎNG COD & ĐẾM LÙI) ───── */}
        {placedOrder ? (
          <div className="mt-8 space-y-8 animate-toast-in">
            {/* Banner Thông báo đếm lùi tự động mất đơn */}
            <div className="relative overflow-hidden rounded-3xl border border-amber-300 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3.5">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-white shadow-md">
                    <span className="text-xl">⏱️</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-bold text-amber-700">
                        Chế độ demo thử nghiệm
                      </span>
                      <span className="text-xs font-semibold text-gray-500">
                        Mã đơn: <strong className="text-gray-900">{placedOrder.orderId}</strong>
                      </span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-800">
                      Đơn hàng đã được ghi nhận. Đơn này sẽ{" "}
                      <span className="font-bold text-amber-700">
                        tự động hết hạn và làm trống giỏ hàng sau {timeLeft}s
                      </span>
                      .
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-2 border border-amber-200 shadow-sm">
                    <span className="text-xs text-gray-500">Đếm ngược:</span>
                    <span className="font-mono text-lg font-extrabold text-amber-600">
                      {timeLeft < 10 ? `0${timeLeft}` : timeLeft}s
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetOrderNow}
                    className="rounded-full bg-gray-900 px-4 py-2 text-xs font-semibold text-white transition hover:bg-black"
                  >
                    Làm mới giỏ ngay
                  </button>
                </div>
              </div>

              {/* Progress bar đếm ngược */}
              <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-amber-200/60">
                <div
                  className="h-full bg-amber-500 transition-all duration-1000 ease-linear"
                  style={{ width: `${(timeLeft / COUNTDOWN_SECONDS) * 100}%` }}
                />
              </div>
            </div>

            {/* Chi tiết đơn hàng */}
            <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
              {/* Cột trái: Trạng thái & Danh sách sản phẩm */}
              <div className="space-y-6">
                {/* Stepper trạng thái */}
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        Đặt hàng thành công!
                      </h2>
                      <p className="text-xs text-gray-500">
                        Cảm ơn bạn, CaseUp đã tiếp nhận đơn hàng lúc {placedOrder.createdAt}
                      </p>
                    </div>
                  </div>

                  {/* Tiến trình giao hàng */}
                  <div className="mt-6 border-t border-gray-100 pt-6">
                    <div className="grid grid-cols-4 gap-2 text-center text-xs">
                      <div className="space-y-2">
                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-white text-xs font-bold shadow-sm">
                          ✓
                        </div>
                        <p className="font-semibold text-emerald-600">Đã đặt đơn</p>
                      </div>
                      <div className="space-y-2">
                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-white text-xs font-bold shadow-sm animate-pulse">
                          📦
                        </div>
                        <p className="font-semibold text-amber-600">Chuẩn bị hàng</p>
                      </div>
                      <div className="space-y-2">
                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
                          🚚
                        </div>
                        <p className="text-gray-400">Đang giao</p>
                      </div>
                      <div className="space-y-2">
                        <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-400 text-xs font-bold">
                          💵
                        </div>
                        <p className="text-gray-400">Thu COD</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Danh sách món hàng đã đặt */}
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900">
                    Sản phẩm trong đơn ({placedOrder.totalQuantity})
                  </h3>
                  <div className="mt-4 divide-y divide-gray-100">
                    {placedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 py-3">
                        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-[#f5f1eb]">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-contain p-1.5"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate font-semibold text-sm text-gray-900">
                            {item.name}
                          </h4>
                          <p className="text-xs text-gray-500">
                            {item.size}
                            {item.selectedColor ? ` • Màu: ${item.selectedColor}` : ""}
                          </p>
                          <p className="text-xs text-gray-500">Số lượng: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-amber-600">
                            {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cột phải: Thông tin nhận hàng & Thanh toán */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
                  <h3 className="font-bold text-gray-900">Thông tin nhận hàng</h3>
                  <div className="mt-4 space-y-3 text-sm">
                    <div>
                      <p className="text-xs text-gray-400">Người nhận</p>
                      <p className="font-semibold text-gray-900">
                        {placedOrder.customerName} ({placedOrder.phone})
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Địa chỉ giao hàng</p>
                      <p className="text-gray-700">{placedOrder.address}</p>
                    </div>
                    {placedOrder.note && (
                      <div>
                        <p className="text-xs text-gray-400">Ghi chú</p>
                        <p className="text-gray-600 italic">"{placedOrder.note}"</p>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs text-gray-400">Phương thức thanh toán</p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-bold text-emerald-700 border border-emerald-200">
                          {placedOrder.paymentMethod === "cod"
                            ? "💵 Thanh toán khi nhận hàng (COD)"
                            : "📲 Chuyển khoản QR ngân hàng"}
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-gray-500">
                        Shipper sẽ mang bưu phẩm đến và thu đúng số tiền trên hóa đơn.
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 border-t border-gray-100 pt-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Tổng thanh toán:</span>
                      <span className="text-xl font-extrabold text-amber-600">
                        {placedOrder.total.toLocaleString("vi-VN")}₫
                      </span>
                    </div>
                  </div>

                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="block w-full rounded-full border border-gray-200 py-3 text-center text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                    >
                      Tiếp tục xem sản phẩm khác
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : cart.length === 0 ? (
          /* ───── TRƯỜNG HỢP 2: GIỎ HÀNG ĐANG TRỐNG ───── */
          <div className="mt-8 rounded-3xl border border-black/5 bg-white p-12 text-center shadow-sm max-w-xl mx-auto">
            {justReset ? (
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
                <span>✓</span> Đơn hàng demo trước đó đã kết thúc và làm mới giỏ hàng.
              </div>
            ) : null}
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fafaf8] text-4xl shadow-inner">
              🛍️
            </div>
            <h2 className="mt-4 text-xl font-bold text-gray-900">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="mt-2 text-sm text-gray-500 max-w-sm mx-auto">
              Chưa có sản phẩm nào được chọn. Hãy khám phá ngay bộ sưu tập bao laptop chất lượng cao từ CaseUp!
            </p>
            <div className="mt-6">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                <span>Khám phá sản phẩm ngay</span>
                <span>→</span>
              </Link>
            </div>
          </div>
        ) : (
          /* ───── TRƯỜNG HỢP 3: CÓ SẢN PHẨM TRONG GIỎ HÀNG ───── */
          <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
            {/* Danh sách sản phẩm */}
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.selectedColor || "default"}`}
                  className="flex gap-4 sm:gap-6 rounded-3xl border border-black/5 bg-white p-4 sm:p-6 shadow-sm transition hover:shadow-md"
                >
                  <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-2xl bg-[#f2eee9] border border-black/5">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="112px"
                      className="object-contain p-2"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h2 className="text-base font-bold text-gray-900 sm:text-lg">
                          {item.name}
                        </h2>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.selectedColor)}
                          className="text-xs font-medium text-red-500 hover:text-red-700 hover:underline transition"
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

                      <p className="mt-2 font-bold text-amber-600 sm:text-base">
                        {item.price.toLocaleString("vi-VN")}₫
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => decreaseQuantity(item.id, item.selectedColor)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                          aria-label="Giảm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center text-sm font-semibold">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => increaseQuantity(item.id, item.selectedColor)}
                          className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-300 text-gray-600 transition hover:bg-gray-100"
                          aria-label="Tăng"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-gray-700">
                        Thành tiền:{" "}
                        <strong className="text-gray-900">
                          {(item.price * item.quantity).toLocaleString("vi-VN")}₫
                        </strong>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tóm tắt & Nút thanh toán */}
            <div className="h-fit rounded-3xl border border-black/5 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-900">Tóm tắt đơn hàng</h2>

              <div className="mt-4 space-y-3 border-b border-gray-100 pb-4 text-sm">
                <div className="flex justify-between text-gray-600">
                  <span>Số lượng sản phẩm:</span>
                  <span className="font-medium text-gray-900">{totalItems} món</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Tạm tính:</span>
                  <span className="font-semibold text-gray-900">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Phí vận chuyển:</span>
                  <span className="font-semibold text-emerald-600">Miễn phí toàn quốc</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <span className="text-base font-bold text-gray-900">Tổng thanh toán:</span>
                <span className="text-2xl font-extrabold text-amber-600">
                  {totalPrice.toLocaleString("vi-VN")}₫
                </span>
              </div>

              {/* Nút mở modal thanh toán */}
              <button
                type="button"
                onClick={handleOpenCheckout}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 font-semibold text-white shadow-md transition-all hover:bg-gray-800 hover:shadow-lg"
              >
                <span>📦 Thanh toán khi nhận hàng (COD)</span>
              </button>

              <div className="mt-4 rounded-2xl bg-[#fafaf8] p-3 text-center border border-black/5">
                <p className="text-xs text-gray-500">
                  🛡️ Hỗ trợ kiểm tra hàng thoải mái trước khi nhận và trả tiền cho shipper.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ───── MODAL THANH TOÁN (COD / CHUYỂN KHOẢN) ───── */}
      {isCheckoutOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-up"
        >
          <div className="relative w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header modal */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  Xác nhận đặt hàng
                </h3>
                <p className="text-xs text-gray-500">
                  Mô phỏng thanh toán khi nhận hàng (COD)
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsCheckoutOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConfirmOrder} className="mt-5 space-y-4">
              {/* Họ tên */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Họ và tên người nhận <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Ví dụ: Nguyễn Văn Anh"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Số điện thoại */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ví dụ: 0988 123 456"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Địa chỉ nhận hàng */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Địa chỉ giao hàng chi tiết <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Ví dụ: 123 Đường Cầu Giấy, Quận Cầu Giấy, Hà Nội"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Ghi chú */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Ghi chú cho shipper (tuỳ chọn)
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi đến"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-black"
                />
              </div>

              {/* Phương thức thanh toán */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Phương thức thanh toán
                </label>
                <div className="space-y-2.5">
                  {/* COD */}
                  <label
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                      paymentMethod === "cod"
                        ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={() => setPaymentMethod("cod")}
                      className="mt-1 accent-amber-600"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-gray-900">
                          💵 Thanh toán khi nhận hàng (COD)
                        </span>
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-700">
                          Khuyên dùng
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Kiểm tra hàng thoải mái trước khi trả tiền cho shipper. An tâm 100%.
                      </p>
                    </div>
                  </label>

                  {/* Chuyển khoản QR */}
                  <label
                    className={`flex items-start gap-3 rounded-2xl border p-3.5 cursor-pointer transition ${
                      paymentMethod === "banking"
                        ? "border-amber-500 bg-amber-50/50 ring-1 ring-amber-500"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="banking"
                      checked={paymentMethod === "banking"}
                      onChange={() => setPaymentMethod("banking")}
                      className="mt-1 accent-amber-600"
                    />
                    <div className="flex-1">
                      <span className="font-bold text-sm text-gray-900">
                        📲 Chuyển khoản VietQR
                      </span>
                      <p className="mt-0.5 text-xs text-gray-500">
                        Quét mã QR qua app ngân hàng hoặc ví điện tử.
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Tóm tắt số tiền */}
              <div className="rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Tổng tiền hàng ({totalItems} sản phẩm):</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}₫</span>
                </div>
                <div className="mt-1 flex justify-between text-xs text-gray-600">
                  <span>Phí ship:</span>
                  <span className="font-semibold text-emerald-600">0₫ (Freeship)</span>
                </div>
                <div className="mt-2 flex justify-between border-t border-gray-200 pt-2 text-sm font-bold text-gray-900">
                  <span>Cần thanh toán:</span>
                  <span className="text-base text-amber-600 font-extrabold">
                    {totalPrice.toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="mt-6 flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsCheckoutOpen(false)}
                  className="flex-1 rounded-full border border-gray-300 py-3 text-xs font-semibold text-gray-700 transition hover:bg-gray-100"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-black py-3 text-xs font-semibold text-white shadow-md transition hover:bg-gray-800"
                >
                  Xác nhận đặt hàng COD
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating Chat */}
      <ChatBox />
    </main>
  );
}
