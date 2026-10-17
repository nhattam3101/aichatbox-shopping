import { getOrderStatus, loadStoredOrders, notifyCustomerData, type Order } from "@/data/orders";
import { vouchers } from "@/data/vouchers";

export type CustomerNotification = { id: string; title: string; description: string; href: string; read: boolean };
const READ_KEY = "caseup_notification_reads";
function readIds(): string[] {
  try { const value: unknown = JSON.parse(localStorage.getItem(READ_KEY) ?? "[]"); return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : []; }
  catch { return []; }
}
export function getNotifications(now: number, orders: Order[] = loadStoredOrders()): CustomerNotification[] {
  const read = new Set(readIds());
  const notifications = [
    ...orders.map(order => {
      const status = getOrderStatus(order, now);
      return { id: `order:${order.orderId}:${status.id}`, title: `Đơn hàng ${order.orderId}: ${status.title}`, description: status.desc, href: `/orders?id=${encodeURIComponent(order.orderId)}` };
    }),
    ...vouchers.map(voucher => ({ id: `voucher:${voucher.id}`, title: voucher.code ? `Bạn có voucher ${voucher.code}.` : voucher.title, description: voucher.description, href: "/vouchers" })),
  ];
  return notifications.map(notification => ({ ...notification, read: read.has(notification.id) }));
}
export function markNotificationsRead(ids: string[]): boolean {
  try { localStorage.setItem(READ_KEY, JSON.stringify([...new Set([...readIds(), ...ids])])); notifyCustomerData(); return true; }
  catch { return false; }
}
