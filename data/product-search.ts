import type { Product } from "./products";

export function matchesProduct(product: Product, query: string) {
  const normalize = (value: string) => value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").toLowerCase();
  const text = normalize([product.name, product.size, product.category, product.description, product.material, ...product.colors, ...product.suitableFor].join(" "));
  return normalize(query.trim()).split(/\s+/).every(word => text.includes(word));
}
