"use client";

import { QRCodeSVG } from "qrcode.react";
import type { Order } from "@/data/orders";
import { PAYMENT_CONFIG, paymentPayload, transferContent } from "@/data/payment";

export default function QrPaymentPanel({ order }: { order: Order }) {
  const configured = Object.values(PAYMENT_CONFIG).every(Boolean);
  return <section aria-label="Thông tin chuyển khoản QR" className="mt-5 rounded-2xl border border-[var(--brand-border)] bg-[var(--surface-muted)] p-4 text-left">
    <h3 className="font-bold">Chuyển khoản bằng QR</h3>
    {!configured && <p role="alert" className="mt-2 text-sm text-amber-900">Thông tin tài khoản thanh toán chưa được cấu hình.</p>}
    <p className="mt-2 text-sm">Mã QR xem trước chứa thông tin đơn hàng, chưa phải mã VietQR để chuyển tiền. Việc tạo hoặc quét mã không xác nhận đã thanh toán.</p>
    <QRCodeSVG value={paymentPayload(order)} size={200} marginSize={4} title={`QR xem trước cho đơn ${order.orderId}`} className="mx-auto my-4 h-auto max-w-full rounded-lg bg-white" />
    <dl className="space-y-2 break-words text-sm">
      {[["Mã đơn", order.orderId], ["Số tiền", `${order.total.toLocaleString("vi-VN")}₫`], ["Ngân hàng", PAYMENT_CONFIG.bankName || "Chưa cấu hình"], ["Số tài khoản", PAYMENT_CONFIG.accountNumber || "Chưa cấu hình"], ["Chủ tài khoản", PAYMENT_CONFIG.accountHolder || "Chưa cấu hình"], ["Nội dung chuyển khoản", order.paymentContent ?? transferContent(order.orderId)]].map(([label, value]) => <div key={label}><dt className="text-[var(--text-secondary)]">{label}</dt><dd className="font-semibold">{value}</dd></div>)}
    </dl>
    {order.status === "cancelled" && <p className="mt-3 font-semibold">Đơn đã hủy. Vui lòng không chuyển khoản.</p>}
  </section>;
}
