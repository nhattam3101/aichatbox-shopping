import { allProducts, type Product } from "@/data/products";

export const buttonOptions = [
  { name: "Baby Blue", color: "#b9dfea" },
  { name: "Vàng", color: "#f5ea90" },
  { name: "Bích", color: "#367f9d" },
  { name: "Hồng", color: "#e9b6c4" },
  { name: "Kem", color: "#f3e9d3" },
  { name: "Đỏ", color: "#b94949" },
] as const;

import { type CustomDimensions } from "@/data/size-validation";

export type { CustomDimensions };
export type ButtonName = (typeof buttonOptions)[number]["name"];
export type CartVariant = {
  id: number;
  selectedColor?: string;
  selectedButton?: string;
  embroidery?: boolean;
  sizeMode?: "standard" | "custom";
  customDimensions?: CustomDimensions;
};

export function normalizeButton(product: Product, value?: string): ButtonName | undefined {
  if (product.kind !== "sleeve") return undefined;
  return buttonOptions.find(option => option.name === value)?.name ?? buttonOptions[0].name;
}

/** Old carts and quick-add actions use the visibly documented default button. */
export function sameCartVariant(a: CartVariant, b: CartVariant): boolean {
  const product = allProducts.find(p => p.id === a.id);
  if (a.id !== b.id || a.selectedColor !== b.selectedColor || !product) return false;
  if (product.supportsEmbroidery ? !!a.embroidery !== !!b.embroidery : false) return false;
  if (normalizeButton(product, a.selectedButton) !== normalizeButton(product, b.selectedButton)) return false;

  const aIsCustom = a.sizeMode === "custom" && !!a.customDimensions;
  const bIsCustom = b.sizeMode === "custom" && !!b.customDimensions;
  if (aIsCustom !== bIsCustom) return false;
  if (aIsCustom && bIsCustom) {
    return (
      a.customDimensions!.lengthCm === b.customDimensions!.lengthCm &&
      a.customDimensions!.widthCm === b.customDimensions!.widthCm &&
      a.customDimensions!.thicknessCm === b.customDimensions!.thicknessCm
    );
  }

  return true;
}

export function cartVariantKey(item: CartVariant): string {
  const customKey = item.sizeMode === "custom" && item.customDimensions
    ? `c:${item.customDimensions.lengthCm}x${item.customDimensions.widthCm}x${item.customDimensions.thicknessCm}`
    : "";
  return JSON.stringify([item.id, item.selectedColor ?? "", item.selectedButton ?? "", !!item.embroidery, customKey]);
}

export function productGallery(product: Product): string[] {
  const base = [product.image, ...(product.gallery ?? [])];
  return [...new Set(product.kind === "sleeve"
    ? [...base.filter(image => image !== "/products/bang_mau_nut.jpg"), "/products/bang_mau.png", "/products/bang_mau_nut.jpg"]
    : base)];
}
