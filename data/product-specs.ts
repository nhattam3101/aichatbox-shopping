import type { Product } from "@/data/products";

export function productDimensions(product: Product): string {
  return product.madeToMeasure ? "Theo số đo khách cung cấp" : product.kind === "sleeve"
    ? `${product.maxWidth} × ${product.maxHeight} × ${product.maxThickness ?? "—"} cm` : "Không áp dụng";
}
// No fallback to another product's physical specifications.
export function productSpecifications(product: Product): { label: string; value: string }[] {
  return [
    { label: "Phân loại", value: product.category },
    { label: "Kích thước phù hợp", value: product.size },
    { label: "Kích thước máy tối đa", value: productDimensions(product) },
    ...(product.material ? [{ label: "Chất liệu cấu tạo", value: product.material }] : []),
    ...(product.waterproof !== undefined ? [{ label: "Trượt nước", value: product.waterproof ? "Có" : "Không" }] : []),
    ...(product.weight ? [{ label: "Trọng lượng", value: product.weight }] : []),
    { label: "Màu sắc có sẵn", value: product.colors.join(", ") },
    ...(product.suitableFor.length ? [{ label: "Thiết bị phù hợp", value: product.suitableFor.join(", ") }] : []),
  ];
}
