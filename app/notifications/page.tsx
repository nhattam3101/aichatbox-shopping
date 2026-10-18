"use client";
import { useState } from "react";
import Link from "next/link";
import AccountPage from "@/components/AccountPage";
import { useCustomerNotifications } from "@/components/useCustomerNotifications";
import { markNotificationsRead } from "@/data/notifications";

export default function NotificationsPage() {
  const { notifications, loaded, unreadCount } = useCustomerNotifications();
  const [error, setError] = useState("");
  function markRead(ids: string[]) { setError(markNotificationsRead(ids) ? "" : "Không thể lưu trạng thái đã đọc. Vui lòng thử lại."); }
  return <AccountPage title="Thông báo" href="/notifications">
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><p role="status" className="text-sm text-[var(--text-secondary)]">{loaded ? `${unreadCount} thông báo chưa đọc` : "Đang tải thông báo..."}</p>
      <button type="button" disabled={!unreadCount} onClick={() => markRead(notifications.map(n => n.id))} className="min-h-11 rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold disabled:opacity-50">Đánh dấu tất cả đã đọc</button>
    </div>
    {error && <p role="alert" className="mb-4 text-sm text-red-800">{error}</p>}
    {loaded && notifications.length === 0 && <div className="rounded-2xl border border-[var(--border)] bg-white p-6 text-center">
      <h2 className="text-lg font-bold">Bạn chưa có thông báo</h2>
      <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">Thông tin đơn hàng và ưu đãi mới sẽ xuất hiện tại đây.</p>
      <Link href="/products" className="mt-4 inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 text-sm font-semibold">Khám phá sản phẩm</Link>
    </div>}
    <div className="space-y-3">{notifications.map(notification => <article key={notification.id} className={`rounded-2xl border p-5 shadow-sm ${notification.read ? "border-[var(--border)] bg-white" : "border-[var(--soft-blue)] bg-[var(--secondary-soft)]"}`}>
      <div className="flex items-start gap-3"><span aria-hidden="true" className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${notification.read ? "bg-gray-300" : "bg-[var(--secondary)]"}`} />
        <div className="min-w-0 flex-1"><h2 className="break-words text-sm font-bold">{notification.title}{!notification.read && <span className="ml-2 text-xs text-[var(--secondary-ink)]">Mới</span>}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{notification.description}</p>
          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2"><Link href={notification.href} onClick={() => markRead([notification.id])} className="inline-flex min-h-11 items-center text-sm font-bold text-[var(--secondary-ink)] underline underline-offset-4">Xem chi tiết</Link>
            {!notification.read && <button type="button" onClick={() => markRead([notification.id])} className="min-h-11 text-sm font-semibold">Đánh dấu đã đọc</button>}
          </div>
        </div>
      </div>
    </article>)}</div>
  </AccountPage>;
}
