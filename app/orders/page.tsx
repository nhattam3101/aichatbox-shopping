"use client";

import { Suspense, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import OrderTrackingTimeline from "@/components/OrderTrackingTimeline";
import OrderActions from "@/components/OrderActions";
import { type Order, type OrderFilter, CUSTOMER_DATA_EVENT, ORDER_FILTERS, loadStoredOrders, getOrderStatus, matchesOrderFilter, formatOrderDate } from "@/data/orders";
import type { CartItem } from "@/components/CartContext";
import { DEMO_ORDER_POLICY } from "@/data/demo-orders";
import QrPaymentPanel from "@/components/QrPaymentPanel";
import { paymentMethodLabel, paymentStatusLabel } from "@/data/payment";

const action = "inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-sm font-bold transition focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--secondary)]";
const surface = "rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7";
const money = (amount: number) => `${amount.toLocaleString("vi-VN")}₫`;

function StatusBadge({ order, now }: { order: Order; now: number }) {
  const status = getOrderStatus(order, now);
  return <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${status.id === "cancelled"
    ? "bg-red-50 text-red-800" : "bg-[var(--secondary-soft)] text-[var(--secondary)]"}`}>
    <span aria-hidden="true">{status.id === "delivered" ? "✓" : status.id === "cancelled" ? "×" : "●"}</span>{status.title}
  </span>;
}

function OrderItem({ item }: { item: CartItem }) {
  return <div className="flex items-start gap-3 py-4 sm:gap-4">
    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)]">
      <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-1" />
    </div>
    <div className="min-w-0 flex-1">
      <h3 className="break-words text-sm font-bold sm:text-base">{item.name}</h3>
      <p className="mt-1 break-words text-xs leading-relaxed text-[var(--text-secondary)]">
        {item.sizeMode === "custom" && item.customDimensions
          ? `Kích thước riêng: ${item.customDimensions.lengthCm} × ${item.customDimensions.widthCm} × ${item.customDimensions.thicknessCm} cm` : item.size}
        {item.selectedColor && ` · Màu: ${item.selectedColor}`}
        {item.selectedButton && ` · Nút: ${item.selectedButton}`}
        {item.embroidery && (item.embroideryText ? ` · Thêu: ${item.embroideryText}` : " · Thêu tên")}
      </p>
      <div className="mt-2 flex flex-wrap justify-between gap-2 text-sm">
        <span className="text-[var(--text-secondary)]">Số lượng: {item.quantity}</span>
        <span className="font-semibold">{money(item.price * item.quantity)}</span>
      </div>
    </div>
  </div>;
}

function OrdersContent() {
  const params = useSearchParams();
  const orderId = params.get("id");
  const requestedFilter = params.get("status");
  const filter: OrderFilter = ORDER_FILTERS.find(f => f.id === requestedFilter)?.id ?? "all";
  const [orders, setOrders] = useState<Order[]>([]);
  const [now, setNow] = useState(0);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    const refresh = () => { if (active) { setOrders(loadStoredOrders()); setNow(Date.now()); setLoaded(true); } };
    queueMicrotask(refresh);
    const interval = setInterval(refresh, DEMO_ORDER_POLICY.refreshMs);
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    window.addEventListener(CUSTOMER_DATA_EVENT, refresh);
    return () => { active = false; clearInterval(interval); window.removeEventListener("storage", refresh); window.removeEventListener("focus", refresh); window.removeEventListener(CUSTOMER_DATA_EVENT, refresh); };
  }, []);
  const selectedOrder = orders.find(order => order.orderId === orderId);
  const filtered = orders.filter(order => matchesOrderFilter(order, filter, now));
  const listHref = filter === "all" ? "/orders" : `/orders?status=${filter}`;
  function refreshOrders() { setOrders(loadStoredOrders()); setNow(Date.now()); }

  return <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]">
    <Navbar />
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <nav aria-label="Đường dẫn" className="mb-6 flex flex-wrap gap-2 text-sm text-[var(--text-secondary)]">
        <Link href="/" className="hover:underline">Trang chủ</Link><span aria-hidden="true">/</span>
        <Link href={listHref} aria-current={!orderId ? "page" : undefined} className="hover:underline">Đơn hàng của tôi</Link>
        {orderId && <><span aria-hidden="true">/</span><span className="break-all">{orderId}</span></>}
      </nav>
      {!loaded ? <p role="status" className={`${surface} text-sm`}>Đang tải đơn hàng...</p> : orderId ? selectedOrder ? <div className="space-y-6">
        <Link href={listHref} className={`${action} border border-[var(--border)] bg-white`}>← Danh sách đơn hàng</Link>
        <header className={surface}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h1 id="main-content" tabIndex={-1} className="break-all text-xl font-extrabold sm:text-2xl">Đơn {selectedOrder.orderId}</h1>
            <StatusBadge order={selectedOrder} now={now} />
          </div>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Ngày đặt hàng: {formatOrderDate(selectedOrder.createdAt)}</p>
          <p role="status" aria-live="polite" className="mt-4 text-sm font-medium text-[var(--secondary)]">{getOrderStatus(selectedOrder, now).desc}</p>
          <div className="mt-4"><OrderActions order={selectedOrder} now={now} onChange={refreshOrders} /></div>
        </header>
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="min-w-0 space-y-6">
            <section className={surface}>
              <h2 className="text-lg font-bold">Sản phẩm trong đơn</h2>
              <div className="divide-y divide-[var(--border)]">{selectedOrder.items.map((item, i) => <OrderItem key={i} item={item} />)}</div>
              <div className="space-y-3 border-t border-[var(--border)] pt-4 text-sm">
                {!!selectedOrder.discountAmount && <p className="flex flex-wrap justify-between gap-2"><span>Giảm giá</span><span>−{money(selectedOrder.discountAmount)}</span></p>}
                <p className="flex flex-wrap items-baseline justify-between gap-2"><span>Tổng thanh toán</span><strong className="text-xl">{money(selectedOrder.total)}</strong></p>
              </div>
            </section>
            <section className={`${surface} space-y-5 break-words text-sm`}>
              <div><h2 className="text-lg font-bold">Địa chỉ nhận hàng</h2>
                <p className="mt-3 font-semibold">{selectedOrder.customerName}</p><p className="mt-1">{selectedOrder.phone}</p>
                <p className="mt-2 leading-relaxed text-[var(--text-secondary)]">{selectedOrder.address}</p>
                {selectedOrder.note && <p className="mt-2 text-[var(--text-secondary)]">Ghi chú: {selectedOrder.note}</p>}
              </div>
              <div className="border-t border-[var(--border)] pt-4"><h2 className="font-bold">Thanh toán</h2>
                <p className="mt-2">Phương thức thanh toán: {paymentMethodLabel(selectedOrder.paymentMethod)}</p>
                <p className="mt-2">Trạng thái thanh toán: {paymentStatusLabel(selectedOrder.paymentStatus ?? (selectedOrder.paymentMethod === "qr" ? "awaiting_payment" : "pending"))}</p>
                {selectedOrder.paymentMethod === "qr" && <QrPaymentPanel order={selectedOrder} />}
              </div>
            </section>
          </div>
          <div className="min-w-0"><OrderTrackingTimeline order={selectedOrder} currentTime={now} /></div>
        </div>
      </div> : <div className={`${surface} text-center`}>
        <h1 id="main-content" tabIndex={-1} className="text-xl font-bold">Không tìm thấy đơn hàng</h1><p className="mt-2 text-sm text-[var(--text-secondary)]">Vui lòng kiểm tra mã đơn hoặc quay lại danh sách.</p>
        <Link href="/orders" className={`${action} mt-5 bg-[var(--primary)]`}>Đơn hàng của tôi</Link>
      </div> : <div className="space-y-6">
        <header><p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--secondary)]">CaseUp · Mua sắm cùng bạn</p>
          <h1 id="main-content" tabIndex={-1} className="text-2xl font-extrabold tracking-tight sm:text-3xl">Đơn hàng của tôi</h1>
          <p className="mt-3 text-sm text-[var(--text-secondary)]">Xem lại sản phẩm yêu thích và theo dõi hành trình đơn hàng của bạn.</p>
        </header>
        <nav aria-label="Lọc đơn hàng theo trạng thái" className="max-w-full overflow-x-auto rounded-2xl border border-[var(--border)] bg-white p-1.5 shadow-sm">
          <div className="flex w-max min-w-full gap-1">
            {ORDER_FILTERS.map(tab => <Link key={tab.id} href={tab.id === "all" ? "/orders" : `/orders?status=${tab.id}`} scroll={false}
              aria-current={filter === tab.id ? "page" : undefined}
              className={`${action} shrink-0 gap-2 whitespace-nowrap ${filter === tab.id ? "bg-[var(--secondary)] text-white" : "text-[var(--text-secondary)] hover:bg-[var(--surface-muted)]"}`}>
              {tab.label}<span className="text-xs">({orders.filter(order => matchesOrderFilter(order, tab.id, now)).length})</span>
            </Link>)}
          </div>
        </nav>
        <div aria-live="polite" className="sr-only">{filtered.length} đơn hàng trong mục {ORDER_FILTERS.find(f => f.id === filter)?.label}</div>
        {filtered.length ? <div className="space-y-4">{filtered.map(order => <article key={order.orderId} className={surface}>
          <header className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-4">
            <div><h2 className="break-all text-sm font-bold">Đơn {order.orderId}</h2><p className="mt-1 text-xs text-[var(--text-secondary)]">Ngày đặt: {formatOrderDate(order.createdAt)}</p></div>
            <StatusBadge order={order} now={now} />
          </header>
          <div className="divide-y divide-[var(--border)]">{order.items.map((item, i) => <OrderItem key={i} item={item} />)}</div>
          <footer className="flex flex-col gap-4 border-t border-[var(--border)] pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex flex-wrap items-baseline gap-2 text-sm">Tổng tiền <strong className="text-xl">{money(order.total)}</strong></p>
            <Link href={`/orders?id=${encodeURIComponent(order.orderId)}&status=${filter}`} aria-label={`Xem chi tiết đơn hàng ${order.orderId}`} className={`${action} bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--primary-hover)]`}>Xem chi tiết đơn hàng</Link>
          </footer>
          <div className="mt-3"><OrderActions order={order} now={now} onChange={refreshOrders} /></div>
        </article>)}</div> : <div className={`${surface} py-12 text-center`}>
          <h2 className="text-lg font-bold">Chưa có đơn hàng ở mục này</h2><p className="mt-2 text-sm text-[var(--text-secondary)]">Các đơn hàng bạn đặt sẽ xuất hiện tại đây.</p>
          <Link href="/products" className={`${action} mt-6 bg-[var(--primary)]`}>Khám phá sản phẩm</Link>
        </div>}
      </div>}
    </section><ChatBox />
  </main>;
}

export default function OrdersPage() {
  return <Suspense fallback={<p role="status" className="p-8">Đang tải đơn hàng...</p>}><OrdersContent /></Suspense>;
}
