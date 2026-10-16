import { allProducts, type Product } from "@/data/products";

export const buttonOptions = [
  { name: "Baby Blue", color: "#b9dfea" },
  { name: "Vàng", color: "#f5ea90" },
  { name: "Bích", color: "#367f9d" },
  { name: "Hồng", color: "#e9b6c4" },
  { name: "Kem", color: "#f3e9d3" },
  { name: "Đỏ", color: "#b94949" },
] as const;

export type ButtonName = (typeof buttonOptions)[number]["name"];
export type CartVariant = { id: number; selectedColor?: string; selectedButton?: string; embroidery?: boolean };

export function normalizeButton(product: Product, value?: string): ButtonName | undefined {
  if (product.kind !== "sleeve") return undefined;
  return buttonOptions.find(option => option.name === value)?.name ?? buttonOptions[0].name;
}

/** Old carts and quick-add actions use the visibly documented default button. */
export function sameCartVariant(a: CartVariant, b: CartVariant): boolean {
  const product = allProducts.find(p => p.id === a.id);
  return a.id === b.id && a.selectedColor === b.selectedColor && !!product &&
    (product.supportsEmbroidery ? !!a.embroidery === !!b.embroidery : true) &&
    normalizeButton(product, a.selectedButton) === normalizeButton(product, b.selectedButton);
}

export function cartVariantKey(item: CartVariant): string {
  return JSON.stringify([item.id, item.selectedColor ?? "", item.selectedButton ?? "", !!item.embroidery]);
}

export function productGallery(product: Product): string[] {
  const base = [product.image, ...(product.gallery ?? [])];
  return [...new Set(product.kind === "sleeve"
    ? [...base.filter(image => image !== "/products/bang_mau_nut.jpg"), "/products/bang_mau.png", "/products/bang_mau_nut.jpg"]
    : base)];
}
