import type { CustomDimensions } from "@/data/size-validation";
import { validateCustomDimensions } from "@/data/size-validation";

export const FREE_SHIPPING_THRESHOLD = 300000;
export const RETURN_POLICY_TITLE = "Đổi trả trong 3 ngày";
export function shippingEligibility(subtotal: number) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  return { free: subtotal >= FREE_SHIPPING_THRESHOLD, remaining,
    progress: Math.min(100, Math.max(0, subtotal / FREE_SHIPPING_THRESHOLD * 100)) };
}
export const priceRanges = [
  { label: "Tất cả", value: "Tất cả" },
  { label: "Dưới 120k", value: "under120" },
  { label: "120k–140k", value: "120to140" },
  { label: "Trên 140k", value: "above140" },
] as const;
export function matchesPriceRange(price: number, range: string) {
  return range === "under120" ? price < 120000 : range === "120to140" ? price >= 120000 && price <= 140000
    : range === "above140" ? price > 140000 : true;
}
export const CUSTOM_PRODUCT_ID = 18;
export const CUSTOM_BASE_PRICE = 149000;
export const CUSTOM_PRICE_NOTICE = "Giá cơ bản 149.000₫. Phụ thu theo số đo đang chờ quy tắc được xác nhận; giá hiển thị chưa bao gồm phụ thu nếu có.";
export function customSizeQuote(dimensions?: CustomDimensions) {
  const validation = dimensions ? validateCustomDimensions(String(dimensions.lengthCm), String(dimensions.widthCm), String(dimensions.thicknessCm)) : null;
  return { basePrice: CUSTOM_BASE_PRICE, price: CUSTOM_BASE_PRICE, valid: validation?.isValid ?? false,
    surcharge: null, surchargeStatus: "awaiting-confirmation" as const };
}
