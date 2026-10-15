import { products } from "./products";

export function recommendSizes(length: number, width: number, thickness?: number) {
  if (![length, width].every(v => Number.isFinite(v) && v > 0) ||
      (thickness !== undefined && (!Number.isFinite(thickness) || thickness <= 0))) return [];
  const long = Math.max(length, width), short = Math.min(length, width);
  return products.filter(p => p.kind === "sleeve" && p.maxWidth >= long && p.maxHeight >= short &&
    (thickness === undefined || (p.maxThickness !== undefined && p.maxThickness >= thickness)))
    .sort((a,b) => a.maxWidth * a.maxHeight - b.maxWidth * b.maxHeight);
}
