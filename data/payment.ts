import type { Order } from "./orders";

// Public receiving details only. Replace the preview payload adapter with VietQR
// when a real receiving account and payment confirmation service are available.
export const PAYMENT_CONFIG = { bankName: "", accountNumber: "", accountHolder: "" };
export type PaymentMethod = "cod" | "qr";
export type PaymentStatus = "pending" | "awaiting_payment" | "paid" | "failed";
export const paymentMethodLabel = (method: PaymentMethod) => method === "qr" ? "Chuyển khoản QR" : "Thanh toán khi nhận hàng";
export const paymentStatusLabel = (status: PaymentStatus) => status === "paid" ? "Đã thanh toán" : status === "failed" ? "Thanh toán thất bại" : "Chờ thanh toán";
export const transferContent = (id: string) => `CASEUP ${id.replace(/[^A-Za-z0-9]/g, "")}`;
export function paymentPayload(order: Order): string {
  return JSON.stringify({ type: "caseup-payment-preview", version: 1, currency: "VND", orderId: order.orderId,
    amount: order.total, paymentMethod: order.paymentMethod, reference: order.paymentReference ?? order.orderId,
    content: order.paymentContent ?? transferContent(order.orderId), ...PAYMENT_CONFIG });
}
