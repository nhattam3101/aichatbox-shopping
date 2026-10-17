"use client";
import { useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import AccountDialog from "@/components/AccountDialog";
import ReturnPolicyModal from "@/components/ReturnPolicyModal";
import { allProducts } from "@/data/products";
import { type Order, CANCELLATION_REASONS, canCancelOrder, cancelOrder, getOrderStatus, isReviewableItem, submitOrderReview } from "@/data/orders";

const button = "min-h-11 rounded-full border border-[var(--border)] px-4 py-2.5 text-sm font-bold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--secondary)] disabled:opacity-50";
export default function OrderActions({ order, now, onChange }: { order: Order; now: number; onChange: () => void }) {
  const { addToCart } = useCart();
  const [dialog, setDialog] = useState<"cancel" | "review" | null>(null);
  const [reason, setReason] = useState("");
  const [itemIndex, setItemIndex] = useState("");
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [repurchased, setRepurchased] = useState(false);
  const [policyOpen, setPolicyOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const savingLock = useRef(false);
  const delivered = getOrderStatus(order, now).id === "delivered";
  const pendingReviews = order.items.map((item, index) => ({ item, index })).filter(({ item, index }) => isReviewableItem(item) && !order.reviews?.[index]);
  async function saveAction(kind: "cancel" | "review") {
    if (savingLock.current) return;
    savingLock.current = true; setSaving(true); setError("");
    try {
      const result = kind === "cancel" ? await cancelOrder(order.orderId, reason)
        : await submitOrderReview(order.orderId, Number(itemIndex), rating, text);
      onChange();
      if (result.success) { setMessage(result.message); setDialog(null); } else setError(result.message);
    } catch { setError("Không thể lưu thay đổi. Vui lòng thử lại."); }
    finally { savingLock.current = false; setSaving(false); }
  }
  function openReview() {
    setItemIndex(String(pendingReviews[0]?.index ?? "")); setRating(0); setText(""); setError(""); setDialog("review");
  }
  function repurchase() {
    if (order.items.some(item => !allProducts.some(p => p.id === item.id && p.priceConfirmed !== false))) {
      setMessage("Một số sản phẩm cần được xác nhận lại. Vui lòng xem danh mục trước khi mua."); return;
    }
    order.items.forEach(item => addToCart({ ...item, customDimensions: item.customDimensions ? { ...item.customDimensions } : undefined }, false));
    setRepurchased(true); setMessage("Đã thêm sản phẩm vào giỏ hàng. Bạn có thể kiểm tra lại trước khi thanh toán.");
  }
  return <div className="space-y-3">
    <div className="flex flex-wrap gap-2">
      {canCancelOrder(order, now) && <button type="button" className={`${button} text-red-800 hover:bg-red-50`} onClick={() => { setReason(""); setError(""); setDialog("cancel"); }}>Hủy đơn</button>}
      {delivered && <>
        {pendingReviews.length ? <button type="button" className={`${button} bg-[var(--secondary-soft)] text-[var(--secondary-ink)]`} onClick={openReview}>Đánh giá sản phẩm</button>
          : <span className="self-center text-sm text-[var(--secondary-ink)]">Đã đánh giá sản phẩm</span>}
        <button type="button" className={button} onClick={repurchase}>Mua lại</button>
        <button type="button" className={button} onClick={() => setPolicyOpen(true)}>Xem chính sách đổi trả</button>
      </>}
      {repurchased && <Link href="/cart" className={`${button} bg-[var(--primary)]`}>Xem giỏ hàng</Link>}
    </div>
    {message && <p role="status" className="text-sm text-[var(--secondary-ink)]">{message}</p>}
    {order.cancellationReason && <p className="text-sm text-[var(--text-secondary)]">Lý do hủy: {order.cancellationReason}</p>}
    {dialog === "cancel" && <AccountDialog title="Hủy đơn hàng" onClose={() => setDialog(null)}>
      <p className="mb-4 text-sm text-[var(--text-secondary)]">Bạn muốn hủy đơn {order.orderId}? Vui lòng chọn một lý do.</p>
      <form aria-busy={saving} onSubmit={async e => { e.preventDefault(); await saveAction("cancel"); }}>
        <fieldset className="space-y-2"><legend className="mb-3 text-sm font-bold">Lý do hủy đơn</legend>
          {CANCELLATION_REASONS.map(value => <label key={value} className="flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border border-[var(--border)] p-3 text-sm">
            <input type="radio" name={`reason-${order.orderId}`} value={value} checked={reason === value} onChange={() => setReason(value)} required className="accent-[var(--secondary)]" />{value}
          </label>)}
        </fieldset>
        {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
        <div className="mt-6 flex flex-wrap justify-end gap-2"><button type="button" onClick={() => setDialog(null)} className={button}>Quay lại</button><button type="submit" disabled={!reason || saving} className={`${button} border-red-200 bg-red-50 text-red-800`}>Xác nhận hủy</button></div>
      </form>
    </AccountDialog>}
    {dialog === "review" && <AccountDialog title="Đánh giá sản phẩm" onClose={() => setDialog(null)}>
      <form aria-busy={saving} onSubmit={async e => { e.preventDefault(); await saveAction("review"); }}>
        <label className="block text-sm font-bold" htmlFor={`review-item-${order.orderId}`}>Sản phẩm</label>
        <select id={`review-item-${order.orderId}`} value={itemIndex} onChange={e => { setItemIndex(e.target.value); setRating(0); setText(""); }} required className="mt-2 min-h-11 w-full min-w-0 rounded-xl border border-[var(--border)] bg-white px-3 text-sm">
          {pendingReviews.map(({ item, index }) => <option key={index} value={index}>{item.name} · {item.selectedColor} · #{index + 1}</option>)}
        </select>
        <fieldset className="mt-5"><legend className="text-sm font-bold">Mức độ hài lòng</legend>
          <div className="mt-2 flex flex-wrap gap-1">{[1, 2, 3, 4, 5].map(star => <label key={star} className="relative flex h-11 w-11 cursor-pointer items-center justify-center rounded-xl border border-[var(--border)] has-focus-visible:outline-2 has-focus-visible:outline-[var(--secondary)]">
            <input type="radio" name={`rating-${order.orderId}`} value={star} checked={rating === star} onChange={() => setRating(star)} required aria-label={`${star} sao`} className="absolute inset-0 cursor-pointer opacity-0" />
            <span aria-hidden="true" className={`text-3xl ${star <= rating ? "text-amber-700" : "text-gray-400"}`}>★</span>
          </label>)}</div>
        </fieldset>
        <label htmlFor={`review-text-${order.orderId}`} className="mt-5 block text-sm font-bold">Nhận xét (không bắt buộc)</label>
        <textarea id={`review-text-${order.orderId}`} maxLength={1000} value={text} onChange={e => setText(e.target.value)} rows={4} className="mt-2 w-full rounded-xl border border-[var(--border)] p-3 text-sm" />
        {error && <p role="alert" className="mt-3 text-sm text-red-800">{error}</p>}
        <div className="mt-5 flex flex-wrap justify-end gap-2"><button type="button" className={button} onClick={() => setDialog(null)}>Quay lại</button><button type="submit" disabled={!rating || itemIndex === "" || saving} className={`${button} bg-[var(--primary)]`}>Gửi đánh giá</button></div>
      </form>
    </AccountDialog>}
    <ReturnPolicyModal isOpen={policyOpen} onClose={() => setPolicyOpen(false)} />
  </div>;
}
