import type { CartItem } from "@/components/CartContext";
import { allProducts } from "@/data/products";
import { DEMO_ORDER_POLICY } from "@/data/demo-orders";

export type OrderStatus = "placed" | "pending" | "preparing" | "handed_over" | "shipping" | "delivered" | "cancelled";
export type OrderReview = { rating: number; text: string; submittedAt: number };
export const CANCELLATION_REASONS = ["Đặt nhầm sản phẩm", "Muốn thay đổi sản phẩm", "Muốn thay đổi địa chỉ", "Không còn nhu cầu", "Lý do khác"] as const;
export const CUSTOMER_DATA_EVENT = "caseup-customer-data";
export function notifyCustomerData() {
  if (typeof window !== "undefined" && typeof window.dispatchEvent === "function") window.dispatchEvent(new Event(CUSTOMER_DATA_EVENT));
}
export type Order = {
  orderId: string; items: CartItem[]; total: number; totalQuantity: number;
  customerName: string; phone: string; address: string; note: string;
  paymentMethod: "cod" | "banking"; createdAt: number; createdAtDisplay: string;
  discountAmount?: number; status?: OrderStatus;
  cancellationReason?: string; cancelledAt?: number; reviews?: Record<string, OrderReview>;
  demo?: boolean; completedAt?: number;
};
export const ORDER_STATUS_STEPS = [
  { id: "placed", title: "Đã đặt hàng", desc: "CaseUp đã tiếp nhận đơn hàng." },
  { id: "pending", title: "Chờ xử lý", desc: "Đơn hàng đang chờ CaseUp xác nhận." },
  { id: "preparing", title: "Đang chuẩn bị", desc: "CaseUp đang chuẩn bị và đóng gói sản phẩm." },
  { id: "handed_over", title: "Đã giao đơn vị vận chuyển", desc: "Đơn hàng đã được bàn giao cho đối tác vận chuyển." },
  { id: "shipping", title: "Đang giao hàng", desc: "Đơn hàng đang trên đường giao đến bạn." },
  { id: "delivered", title: "Đã giao thành công", desc: "Đơn hàng đã được giao thành công." },
  { id: "cancelled", title: "Đã hủy", desc: "Đơn hàng đã được hủy và sẽ không tiếp tục giao." },
] as const;
export const ORDER_FILTERS = [
  { id: "all", label: "Tất cả" }, { id: "pending", label: "Chờ xử lý" },
  { id: "preparing", label: "Đang chuẩn bị" }, { id: "shipping", label: "Đang giao" },
  { id: "delivered", label: "Hoàn thành" }, { id: "cancelled", label: "Đã hủy" },
] as const;
export type OrderFilter = (typeof ORDER_FILTERS)[number]["id"];

// Internal progression only; explicit persisted statuses override it.
export function getOrderStatusIndex(createdAt: number, now: number = Date.now()): number {
  return Math.min(5, Math.max(0, Math.floor((now - createdAt) / (DEMO_ORDER_POLICY.fulfillmentDurationMs / 5))));
}
export function getOrderStatus(order: Order, now: number) {
  return ORDER_STATUS_STEPS.find(step => step.id === order.status) ?? ORDER_STATUS_STEPS[getOrderStatusIndex(order.createdAt, now)];
}
export function matchesOrderFilter(order: Order, filter: OrderFilter, now: number): boolean {
  const status = getOrderStatus(order, now).id;
  return filter === "all" || (filter === "pending" ? status === "placed" || status === "pending"
    : filter === "preparing" ? status === "preparing" || status === "handed_over" : status === filter);
}
export function formatOrderDate(createdAt: number): string {
  return new Intl.DateTimeFormat("vi-VN", { dateStyle: "medium", timeZone: "Asia/Ho_Chi_Minh" }).format(createdAt);
}
const ORDERS_STORAGE_KEY = "caseup_orders";
const LEGACY_ORDER_KEY = "caseup_demo_order";
const ORDER_RECORD_PREFIX = "caseup_order_record:";
let mutationQueue: Promise<unknown> = Promise.resolve();

// Serialize same-origin mutations across tabs where Web Locks is available.
// The queue also protects repeated actions in browsers without Web Locks.
function mutateOrders<T>(mutation: () => T): Promise<T> {
  const run = () => typeof navigator !== "undefined" && navigator.locks
    ? navigator.locks.request("caseup-orders", mutation) : Promise.resolve().then(mutation);
  const next = mutationQueue.then(run, run);
  mutationQueue = next.catch(() => undefined);
  return next;
}

function storedRecordKeys(): string[] {
  const keys: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.startsWith(ORDER_RECORD_PREFIX)) keys.push(key);
  }
  return keys;
}
function readOrder(value: unknown): Order | null {
  if (!value || typeof value !== "object") return null;
  const order = value as Order;
  const createdAt = typeof order.createdAt === "string" ? Date.parse(order.createdAt) : order.createdAt;
  if (typeof order.orderId !== "string" || !Number.isFinite(createdAt) ||
      !Array.isArray(order.items) || !order.items.length || typeof order.total !== "number" || !Number.isFinite(order.total) ||
      !order.items.every(item => item && typeof item.name === "string" && typeof item.image === "string" &&
        typeof item.quantity === "number" && typeof item.price === "number")) return null;
  return { ...order, createdAt };
}
export function loadStoredOrders(now = Date.now()): Order[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_STORAGE_KEY);
    let parsed: unknown = null;
    try { parsed = raw === null ? null : JSON.parse(raw); } catch { /* Recover from independent records below. */ }
    const records = new Map<string, Order>();
    if (Array.isArray(parsed)) for (const value of parsed) {
      const order = readOrder(value);
      if (order && !records.has(order.orderId)) records.set(order.orderId, order);
    }
    // Independent records survive an array snapshot written concurrently by another tab.
    for (const key of storedRecordKeys()) {
      try { const order = readOrder(JSON.parse(localStorage.getItem(key) ?? "null")); if (order) records.set(order.orderId, order); }
      catch { /* Ignore only the malformed record. */ }
    }
    if (raw !== null || records.size) return cleanupCompletedDemoOrders([...records.values()], now).sort((a, b) => b.createdAt - a.createdAt);
    const legacy = localStorage.getItem(LEGACY_ORDER_KEY);
    const order = legacy ? readOrder(JSON.parse(legacy)) : null;
    if (order) { saveStoredOrders([order]); return cleanupCompletedDemoOrders([order], now); }
  } catch { /* Unavailable browser storage must not break the page. */ }
  return [];
}

export function demoCompletionTime(order: Order, now: number): number | null {
  // Unmarked legacy records with automatic progression are also local demo orders.
  // An explicit non-demo flag or an unmarked externally supplied status is protected.
  const demo = order.demo === true || (order.demo !== false && order.status === undefined);
  if (!demo || getOrderStatus(order, now).id !== "delivered") return null;
  return typeof order.completedAt === "number" && Number.isFinite(order.completedAt)
    ? order.completedAt : order.createdAt + DEMO_ORDER_POLICY.fulfillmentDurationMs;
}

export function cleanupCompletedDemoOrders(orders: Order[], now: number): Order[] {
  if (!DEMO_ORDER_POLICY.cleanupEnabled) return orders;
  const expired = orders.filter(order => {
    const completedAt = demoCompletionTime(order, now);
    return completedAt !== null && now - completedAt >= DEMO_ORDER_POLICY.completedRetentionMs;
  });
  if (!expired.length) return orders;
  const expiredIds = new Set(expired.map(order => order.orderId));
  const remaining = orders.filter(order => !expiredIds.has(order.orderId));
  try {
    // Remove only expired records; independent active-order recovery records are untouched.
    for (const id of expiredIds) localStorage.removeItem(`${ORDER_RECORD_PREFIX}${id}`);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(remaining));
    const legacy = localStorage.getItem(LEGACY_ORDER_KEY);
    if (legacy && expiredIds.has(JSON.parse(legacy)?.orderId)) localStorage.removeItem(LEGACY_ORDER_KEY);
  } catch { /* Hide expired records now; retry persistence on the next load. */ }
  return remaining;
}
export function saveStoredOrders(orders: Order[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    // Explicit whole-list replacement, used for migration/verification only.
    for (const key of storedRecordKeys()) localStorage.removeItem(key);
    notifyCustomerData(); return true;
  }
  catch { return false; }
}
export function addStoredOrder(order: Order): Order[] {
  // Existing-record updates must use cancellation/review helpers, never checkout.
  const updated = [order, ...loadStoredOrders().filter(o => o.orderId !== order.orderId)];
  if (!persistOrder(order, updated)) throw new Error("order_storage_unavailable");
  return updated;
}

function persistOrder(order: Order, snapshot?: Order[]): boolean {
  try {
    localStorage.setItem(`${ORDER_RECORD_PREFIX}${order.orderId}`, JSON.stringify(order));
  } catch { return false; }
  // The per-order record is authoritative if writing the compatible array snapshot fails.
  try { localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(snapshot ?? loadStoredOrders())); } catch { /* Record was saved. */ }
  notifyCustomerData(); return true;
}

export function createStoredOrder(input: Omit<Order, "orderId">): Promise<Order> {
  return mutateOrders(() => {
    const existing = loadStoredOrders();
    const randomId = typeof crypto.randomUUID === "function" ? crypto.randomUUID()
      : [...crypto.getRandomValues(new Uint8Array(16))].map(byte => byte.toString(16).padStart(2, "0")).join("");
    let id = `#CU-${randomId.replaceAll("-", "").slice(0, 12).toUpperCase()}`;
    // Also defend against a broken/mocked random source rather than replacing an existing order.
    while (existing.some(order => order.orderId === id)) id += "-N";
    const createdAt = existing.reduce((latest, order) => Math.max(latest, order.createdAt + 1), input.createdAt);
    const order: Order = JSON.parse(JSON.stringify({ ...input, demo: input.demo ?? true, createdAt, orderId: id }));
    if (!persistOrder(order, [order, ...existing])) throw new Error("order_storage_unavailable");
    return order;
  });
}

export function canCancelOrder(order: Order, now: number): boolean {
  return ["placed", "pending", "preparing"].includes(getOrderStatus(order, now).id);
}
export function isReviewableItem(item: CartItem): boolean {
  return allProducts.some(product => product.id === item.id && product.kind !== "service");
}
export function cancelOrder(orderId: string, reason: string, now?: number) {
  return mutateOrders(() => cancelOrderUnlocked(orderId, reason, now ?? Date.now()));
}
function cancelOrderUnlocked(orderId: string, reason: string, now: number): { success: boolean; message: string } {
  const orders = loadStoredOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!CANCELLATION_REASONS.some(r => r === reason)) return { success: false, message: "Vui lòng chọn lý do hủy đơn." };
  if (!order || !canCancelOrder(order, now)) return { success: false, message: "Đơn hàng này không còn có thể hủy. Vui lòng kiểm tra trạng thái mới nhất." };
  const updated: Order = { ...order, status: "cancelled", cancellationReason: reason, cancelledAt: now };
  return persistOrder(updated, orders.map(o => o.orderId === orderId ? updated : o))
    ? { success: true, message: "Đã hủy đơn hàng." } : { success: false, message: "Không thể lưu thay đổi. Vui lòng thử lại." };
}
export function submitOrderReview(orderId: string, itemIndex: number, rating: number, text: string, now?: number) {
  return mutateOrders(() => submitOrderReviewUnlocked(orderId, itemIndex, rating, text, now ?? Date.now()));
}
function submitOrderReviewUnlocked(orderId: string, itemIndex: number, rating: number, text: string, now: number): { success: boolean; message: string } {
  const orders = loadStoredOrders();
  const order = orders.find(o => o.orderId === orderId);
  if (!order || getOrderStatus(order, now).id !== "delivered" || !Number.isInteger(itemIndex) || !order.items[itemIndex] || !isReviewableItem(order.items[itemIndex]))
    return { success: false, message: "Chỉ có thể đánh giá sản phẩm trong đơn đã giao thành công." };
  if (order.reviews?.[itemIndex]) return { success: false, message: "Bạn đã đánh giá sản phẩm này." };
  if (!Number.isInteger(rating) || rating < 1 || rating > 5 || text.length > 1000)
    return { success: false, message: "Vui lòng chọn từ 1 đến 5 sao và nhập tối đa 1.000 ký tự." };
  const updated = { ...order, reviews: { ...order.reviews, [itemIndex]: { rating, text: text.trim(), submittedAt: now } } };
  return persistOrder(updated, orders.map(o => o.orderId === orderId ? updated : o))
    ? { success: true, message: "Cảm ơn bạn đã đánh giá CaseUp!" } : { success: false, message: "Không thể lưu đánh giá. Vui lòng thử lại." };
}
