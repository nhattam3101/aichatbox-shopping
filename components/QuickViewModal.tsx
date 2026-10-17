"use client";

import ButtonSelector from "@/components/ButtonSelector";
import { useDialogFocus } from "@/components/useDialogFocus";
import { productGallery, type ButtonName } from "@/data/customization";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { productDimensions } from "@/data/product-specs";
import type { Product } from "@/data/products";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";

type Props = {
  product: Product | null;
  onClose: () => void;
};

export default function QuickViewModal({ product, onClose }: Props) {
  if (!product) return null;

  return <QuickViewDialog key={product.id} product={product} onClose={onClose} />;
}

function QuickViewDialog({ product, onClose }: { product: Product; onClose: () => void }) {
  const dialogRef = useDialogFocus(true, onClose);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [activeImage, setActiveImage] = useState<string>(product.gallery?.[0] || product.image);
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || "");
  const [selectedButton, setSelectedButton] = useState<ButtonName>("Baby Blue");
  const [quantity, setQuantity] = useState<number>(1);
  const [isAdded, setIsAdded] = useState(false);

    const gallery = productGallery(product);

  const isFavorite = isInWishlist(product.id);

  function handleAddToCart() {
    if (product.priceConfirmed === false || product.madeToMeasure) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      quantity,
      selectedColor,
      selectedButton,
    });
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  }

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-md transition-opacity animate-fade-in"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-label={product.name} tabIndex={-1} className="relative z-10 w-full max-w-3xl overflow-y-auto rounded-3xl bg-white shadow-2xl transition-all max-h-[92vh] flex flex-col md:flex-row border border-[var(--brand-border)] animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-600 hover:bg-[var(--soft-blue)] shadow-md backdrop-blur-sm hover:bg-[var(--brand-primary-hover)] hover:text-[var(--on-primary)] transition"
          aria-label="Đóng"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Left: Image Gallery */}
        <div className="w-full md:w-1/2 bg-[var(--surface-muted)] p-6 flex flex-col justify-between">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-white shadow-inner border border-[var(--brand-border)]">
            <Image
              src={activeImage || product.image}
              alt={product.name}
              fill
              className="object-contain p-4 transition-all duration-300"
            />
            {product.badge && (
              <span className={`absolute left-3 top-3 min-h-11 rounded-full px-3 py-2 text-xs font-bold text-[var(--text-primary)] shadow-sm ${product.badge === "Mới" ? "bg-[var(--soft-blue)]" : product.badge === "Hot" ? "bg-[var(--primary)]" : "bg-[var(--yellow)]"}`}>
                {product.badge}
              </span>
            )}
            {discountPercent && (
              <span className="absolute right-3 top-3 rounded-full bg-[var(--yellow)] px-2.5 py-1 text-xs font-bold text-[var(--text-primary)] shadow-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Thumbnails */}
          <div className="mt-4 flex flex-wrap gap-2.5 justify-center">
            {gallery.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImage(img)}
                aria-label={`Xem ${img.includes("bang_mau_nut") ? "bảng màu nút" : img.includes("bang_mau") ? "bảng màu vải" : `ảnh ${idx + 1}`}`}
                aria-pressed={activeImage === img}
                className={`relative h-14 w-14 overflow-hidden rounded-xl border-2 bg-white transition ${
                  activeImage === img ? "border-[var(--secondary)] ring-2 ring-[var(--secondary-soft)] shadow-sm" : "border-[var(--brand-border)] hover:border-[var(--secondary)]"
                }`}
              >
                <Image src={img} alt="" fill className="object-contain p-1" />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Info & Actions */}
        <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col justify-between overflow-y-auto">
          <div>
            <div className="flex items-center justify-between gap-3">
              <span className="inline-block rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {product.category}
              </span>
              <button
                onClick={() => toggleWishlist(product)}
                className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
                  isFavorite
                    ? "bg-rose-50 text-rose-500"
                    : "bg-gray-100 text-gray-400 hover:text-[var(--text-primary)]"
                }`}
                title="Lưu yêu thích"
              >
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>
            </div>

            <h3 className="mt-3 text-2xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h3>

            {/* Rating & Sold */}
            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
              <div className="flex items-center text-amber-500">
                <span>★</span>
                <span className="ml-1 font-bold text-gray-800">{product.rating}</span>
              </div>
              <span>•</span>
              <span>Đã bán {product.sold}</span>
              <span>•</span>
              <span className="text-[var(--secondary-ink)] font-medium">Còn hàng</span>
            </div>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="price-text text-2xl font-extrabold">
                {product.priceConfirmed === false ? "Giá chờ xác nhận" : product.price.toLocaleString("vi-VN") + "₫"}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-400 line-through">
                  {product.originalPrice.toLocaleString("vi-VN")}₫
                </span>
              )}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-gray-600 line-clamp-3">
              {product.description}
            </p>

            {/* Spec Highlights */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs bg-gray-50 rounded-xl p-3 border border-gray-100">
              <div>
                <span className="text-gray-400">Kích cỡ:</span>
                <span className="ml-1 font-semibold text-gray-800">{product.size}</span>
              </div>
              <div>
                <span className="text-gray-400">Tối đa:</span>
                <span className="ml-1 font-semibold text-gray-800">{productDimensions(product)}</span>
              </div>
              <div>
                <span className="text-gray-400">Trượt nước:</span>
                <span className={`ml-1 font-semibold ${product.waterproof ? "text-[var(--secondary-ink)]" : "text-gray-600"}`}>
                  {product.waterproof === undefined ? "Chưa có thông tin xác nhận" : product.waterproof ? "Có" : "Không"}
                </span>
              </div>
              <div>
                <span className="text-gray-400">Trọng lượng:</span>
                <span className="ml-1 font-semibold text-gray-800">{product.weight ?? "Chưa có thông tin xác nhận"}</span>
              </div>
            </div>

            {/* Color selection */}
            <div className="mt-4">
              <label className="text-xs font-semibold text-gray-700">Màu sắc:</label>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                            aria-pressed={selectedColor === color}
                    className={`min-h-11 rounded-full px-3 py-2 text-xs font-medium transition ${
                      selectedColor === color
                        ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-sm"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {product.kind === "sleeve" && <ButtonSelector value={selectedButton} onChange={setSelectedButton} />}

            {/* Quantity */}
            <div className="mt-4 flex items-center gap-3">
              <label className="text-xs font-semibold text-gray-700">Số lượng:</label>
              <div className="flex items-center rounded-full border border-gray-200 bg-white">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-[var(--text-primary)] transition"
                >
                  -
                </button>
                <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-sm font-semibold text-gray-600 hover:text-[var(--text-primary)] transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 space-y-2 pt-4 border-t border-gray-100">
            <button
              onClick={handleAddToCart}
              className={`w-full rounded-full py-3.5 px-6 text-sm font-semibold transition flex items-center justify-center gap-2 shadow-lg ${
                isAdded ? "bg-[var(--secondary-soft)] text-[var(--text-primary)] ring-1 ring-[var(--secondary)]" : "bg-[var(--primary)] text-[var(--on-primary)] hover:bg-[var(--brand-primary-hover)]"
              }`}
            >
              {isAdded ? (
                <>
                  <svg className="h-4 w-4 text-[var(--secondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Đã thêm vào giỏ hàng!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Thêm vào giỏ hàng
                </>
              )}
            </button>

            <Link
              href={`/products/${product.id}`}
              onClick={onClose}
              className="block w-full text-center text-xs font-semibold text-gray-500 hover:text-[var(--text-primary)] py-2 transition"
            >
              {product.madeToMeasure ? "Nhập số đo và tùy chỉnh →" : "Xem trang chi tiết đầy đủ & đánh giá →"}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
