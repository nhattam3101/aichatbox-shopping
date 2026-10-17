import Link from "next/link";
import AccountPage from "@/components/AccountPage";
import CopyVoucherButton from "@/components/CopyVoucherButton";
import { vouchers } from "@/data/vouchers";

export default function VouchersPage() {
  return <AccountPage title="Voucher của tôi" href="/vouchers">
    <p className="mb-6 text-sm text-[var(--text-secondary)]">Lưu mã yêu thích và kiểm tra ưu đãi áp dụng tại giỏ hàng.</p>
    <div className="grid min-w-0 gap-5 md:grid-cols-2">{vouchers.map(voucher => <article key={voucher.id} className="min-w-0 overflow-hidden rounded-3xl border border-[var(--border)] bg-white shadow-sm">
      <div className="border-b border-dashed border-[var(--border)] bg-[var(--secondary-soft)] px-5 py-4"><p className="select-all break-all text-lg font-extrabold text-[var(--secondary-ink)]">{voucher.code ?? "Mã quay lại"}</p></div>
      <div className="p-5"><h2 className="text-lg font-bold">{voucher.title}</h2><p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">{voucher.description}</p>
        <div className="mt-5 flex flex-wrap items-start gap-3">{voucher.code && <CopyVoucherButton code={voucher.code} />}<Link href={voucher.href} className="inline-flex min-h-11 items-center rounded-full bg-[var(--primary)] px-5 py-2.5 text-sm font-bold">{voucher.code ? "Dùng ngay" : "Liên hệ nhận mã"}</Link></div>
      </div>
    </article>)}</div>
  </AccountPage>;
}
