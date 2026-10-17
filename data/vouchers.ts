import { FREE_SHIPPING_THRESHOLD } from "@/data/business";

export const returningCustomerOffer = {
  id: "returning-customer", code: null, discountPercent: 0.05,
  title: "Mã quay lại - giảm 5%", description: "Giảm 5% cho khách quay lại. Liên hệ CaseUp để nhận mã quay lại.", href: "/about",
} as const;
export type Voucher = { id: string; code: string | null; title: string; description: string; href: string };
export const vouchers: Voucher[] = [
  returningCustomerOffer,
  { id: "shipping", code: "FREESHIP", title: "Miễn phí vận chuyển", description: "Freeship toàn quốc cho đơn từ 300.000₫.", href: "/cart" },
];
// A returning-customer public code/eligibility rule has not been confirmed.
// Never infer a code or automatically grant the informational 5% offer.
export function evaluateVoucher(code: string, subtotal: number) {
  if (code.trim().toUpperCase() === "FREESHIP") return subtotal >= FREE_SHIPPING_THRESHOLD
    ? { success: true, code: "FREESHIP", discountPercent: 0, message: "Bạn đã được Freeship toàn quốc." }
    : { success: false, code: null, discountPercent: 0, message: "Freeship chỉ áp dụng cho đơn từ 300.000₫." };
  return { success: false, code: null, discountPercent: 0, message: "Mã chưa được xác nhận hoặc không còn áp dụng. Vui lòng liên hệ CaseUp." };
}
