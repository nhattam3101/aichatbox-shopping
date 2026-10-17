import { type Order, ORDER_STATUS_STEPS, getOrderStatus } from "@/data/orders";

export default function OrderTrackingTimeline({ order, currentTime }: { order: Order; currentTime: number }) {
  const status = getOrderStatus(order, currentTime);
  const currentIndex = ORDER_STATUS_STEPS.findIndex(step => step.id === status.id);
  return <section aria-label="Hành trình đơn hàng" className="rounded-3xl border border-[var(--border)] bg-white p-5 shadow-sm sm:p-7">
    <h2 className="text-lg font-bold">Hành trình đơn hàng</h2>
    {status.id === "cancelled" ? <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 p-4 text-red-800" role="status">
      <p className="font-bold">Đã hủy</p><p className="mt-1 text-sm">{status.desc}</p>
    </div> : <ol className="mt-6">
      {ORDER_STATUS_STEPS.slice(0, 6).map((step, index) => {
        const completed = index < currentIndex;
        const current = index === currentIndex;
        return <li key={step.id} aria-current={current ? "step" : undefined} className="relative flex gap-4 pb-7 last:pb-0">
          {index < 5 && <span aria-hidden="true" className={`absolute bottom-0 left-[15px] top-8 w-0.5 ${completed ? "bg-[var(--secondary)]" : "bg-gray-200"}`} />}
          <span aria-hidden="true" className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 ${completed
            ? "border-[var(--secondary)] bg-[var(--secondary)] text-white" : current
            ? "border-[var(--secondary)] bg-[var(--secondary-soft)] text-[var(--secondary)] ring-4 ring-[var(--secondary-soft)]"
            : "border-gray-200 bg-gray-50 text-gray-500"}`}>
            {completed ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-4 w-4"><path d="m5 12 4 4L19 6" /></svg> : current ? "●" : "○"}
          </span>
          <div className={`min-w-0 flex-1 rounded-xl px-3 py-2 ${current ? "bg-[var(--secondary-soft)]" : ""}`}>
            <p className={`text-sm ${current ? "font-extrabold text-[var(--secondary)]" : completed ? "font-semibold" : "text-gray-500"}`}>
              {step.title}{current && <span className="ml-2 text-xs font-medium">Hiện tại</span>}
              {completed && <span className="sr-only"> — Đã hoàn tất</span>}
              {!completed && !current && <span className="sr-only"> — Chưa đến</span>}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-[var(--text-secondary)]">{step.desc}</p>
          </div>
        </li>;
      })}
    </ol>}
  </section>;
}
