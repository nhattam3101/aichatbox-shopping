export type PromotionCampaign = {
  id: string; title: string; description: string; voucherCode?: string;
  image?: string; imageAlt?: string; href: string; cta: string;
  frequency: "session" | "day";
};
export const homepageBanners = [
  { id: "ad5", image: "/products/ad5.png", title: "Freeship toàn quốc", alt: "Chương trình Freeship toàn quốc tại CaseUp", href: "/products" },
  { id: "ad6", image: "/products/ad6.png", title: "Chọn size dễ dàng", alt: "Chọn size có sẵn hoặc tùy chỉnh theo số đo cùng CaseUp", href: "/size-guide" },
] as const;
export type PromotionAd = {
  id: string; image: string; width: number; height: number; title: string;
  description: string; voucherCode?: string; href: string; cta: string;
};
// Only approved artwork without the retired first-order promotion is displayed.
export const promotionAds: readonly PromotionAd[] = homepageBanners.map(banner => ({
  id: banner.id, image: banner.image, width: 1672, height: 941, title: banner.title,
  description: banner.alt, href: banner.href, cta: "Khám phá ngay",
}));
export function selectPromotion(ads: readonly PromotionAd[] = promotionAds, random = Math.random()): PromotionAd | null {
  return ads[Math.min(ads.length - 1, Math.max(0, Math.floor(random * ads.length)))] ?? null;
}
export const homepageCampaign: PromotionCampaign = {
  id: "caseup-back-to-school", title: "CaseUp Back To School",
  description: "Chuẩn bị mùa tựu trường cùng những thiết kế mang dấu ấn của bạn.",
  voucherCode: "BACKTOSCHOOL", href: "/vouchers", cta: "Xem ưu đãi", frequency: "session",
};

// Reserve on display, so revisiting the homepage never reopens the same campaign.
export function claimPromotion(campaign: PromotionCampaign, now = Date.now()): boolean {
  if (typeof window === "undefined") return false;
  try {
    const storage = campaign.frequency === "day" ? localStorage : sessionStorage;
    const key = `caseup_promotion:${campaign.id}`;
    const previous = storage.getItem(key);
    if (previous !== null && (campaign.frequency === "session" || now - Number(previous) < 86400000)) return false;
    storage.setItem(key, String(now));
    return true;
  } catch { return false; }
}
