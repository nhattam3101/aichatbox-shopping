"use client";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import AccountDialog from "@/components/AccountDialog";
import { claimPromotion, selectPromotion, type PromotionAd, type PromotionCampaign } from "@/data/promotions";

export default function PromotionPopup({ campaign }: { campaign: PromotionCampaign }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [ad, setAd] = useState<PromotionAd | null>(null);
  const checked = useRef(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active || checked.current || pathname !== "/") return;
      checked.current = true;
      if (claimPromotion(campaign)) { setAd(selectPromotion()); setOpen(true); }
    });
    return () => { active = false; setOpen(false); };
  }, [campaign, pathname]);
  if (!open || !ad || pathname !== "/") return null;
  return <AccountDialog title={ad.title} onClose={() => setOpen(false)}>
    <div className="overflow-hidden rounded-2xl bg-[var(--background)]">
      <Image src={ad.image} alt={ad.title} width={ad.width} height={ad.height} sizes="(max-width: 640px) 90vw, 456px" className="mx-auto h-auto max-h-[50dvh] w-auto max-w-full object-contain" />
    </div>
    <p className="mt-4 text-sm leading-relaxed text-[var(--text-secondary)]">{ad.description}</p>
    <p className="mt-4 rounded-xl border border-dashed border-[var(--border)] p-3 text-sm">Mã ưu đãi: <strong className="select-all break-all font-mono">{ad.voucherCode}</strong></p>
    <Link href={ad.href} onClick={() => setOpen(false)} className="mt-5 flex min-h-11 items-center justify-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-bold">{ad.cta}</Link>
  </AccountDialog>;
}
