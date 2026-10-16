"use client";

import ButtonSelector from "@/components/ButtonSelector";
import { productGallery, type ButtonName } from "@/data/customization";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { services, accessories, type Product } from "@/data/products";

import BenefitIcon from "@/components/BenefitIcon";
import Navbar from "@/components/Navbar";
import ChatBox from "@/components/ChatBox";
import OpenChatButton from "@/components/OpenChatButton";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useCompare } from "@/components/ProductCompareModal";

type Props = {
  product: Product;
  relatedProducts: Product[];
};

export default function ProductDetailClient({ product, relatedProducts }: Props) {
  const router = useRouter();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isInCompare, toggleCompare } = useCompare();

  const [selectedImage, setSelectedImage] = useState(product.gallery?.[0] || product.image);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || "");
  const [embroidery, setEmbroidery] = useState(false);
  const embroideryService = services.find(p => p.id === 7)!;
  const accessory = accessories[0];
  const [selectedButton, setSelectedButton] = useState<ButtonName>("Baby Blue");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"description" | "details" | "reviews">("description");

  const isFavorite = isInWishlist(product.id);
  const isCompared = isInCompare(product.id);

  // Gallery images (main product image + alternate views)
  const galleryImages = productGallery(product);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  function handleAdd() {
    if (product.priceConfirmed === false) return;
    addToCart({ ...product, quantity, selectedColor, selectedButton, embroidery });
    if (embroidery && product.supportsEmbroidery) addToCart({ ...embroideryService, quantity }, false);
  }

  function handleBuyNow() {
    if (product.priceConfirmed === false) return;
    if (embroidery && product.supportsEmbroidery) addToCart({ ...embroideryService, quantity }, false);
    addToCart(
      {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        size: product.size,
        quantity,
        selectedColor,
        selectedButton,
        embroidery,
      },
      false
    );
    router.push("/cart");
  }

  const guarantees = [
    { icon: "🚚", title: "Freeship toàn quốc", desc: "Đơn từ 300k" },
    { icon: "🔄", title: "Đổi Trả 3 Ngày", desc: "Không vừa size đổi ngay" },
    { icon: "🛡️", title: "Chống va đập", desc: "Đệm khí an tâm" },
    { icon: "🤖", title: "AI tư vấn 24/7", desc: "Hỗ trợ chọn size chuẩn" },
  ];

  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)]">
      {/* Navigation */}
      <Navbar />

      {/* Main Product Section */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs sm:text-sm text-gray-500">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Trang chủ
            </Link>
            <span>/</span>
            <Link href="/products" className="hover:text-amber-600 transition-colors">
              Sản phẩm
            </Link>
            <span>/</span>
            <span className="font-semibold text-gray-900 line-clamp-1">{product.name}</span>
          </nav>

          <div className="grid gap-12 lg:grid-cols-2">
            {/* Left: Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-[var(--surface-muted)] shadow-sm border border-[var(--brand-border)]">
                <Image
                  src={selectedImage}
                  alt={selectedImage.includes("bang_mau_nut") ? "Bảng màu nút CaseUp" : selectedImage.includes("bang_mau") ? "Bảng màu vải CaseUp" : product.name}
                  sizes="(max-width: 1023px) 100vw, 50vw"
                  fill
                  priority
                  className="object-contain p-6 transition-all duration-300"
                />

                {/* Badges */}
                <div className="absolute left-4 top-4 flex flex-col gap-2">
                  {product.badge && (
                    <span className={`rounded-full px-3.5 py-1 text-xs font-bold text-[var(--text-primary)] shadow-sm ${product.badge === "Mới" ? "bg-[var(--soft-blue)]" : product.badge === "Hot" ? "bg-[var(--primary)]" : "bg-[var(--yellow)]"}`}>
                      {product.badge}
                    </span>
                  )}
                  {discountPercent && (
                    <span className="rounded-full bg-[var(--yellow)] px-3 py-1 text-xs font-bold text-[var(--text-primary)] shadow-sm">
                      -{discountPercent}%
                    </span>
                  )}
                </div>

                {/* Top right quick buttons: Wishlist & Compare */}
                <div className="absolute right-4 top-4 flex flex-col gap-2 z-10">
                  <button
                    onClick={() => toggleWishlist(product)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] shadow-sm transition hover:scale-[1.02] ${
                      isFavorite
                        ? "bg-white text-[var(--primary-ink)] hover:bg-[var(--soft-blue)]"
                        : "bg-white text-gray-600 hover:bg-[var(--soft-blue)] hover:text-[var(--text-primary)]"
                    }`}
                    title={isFavorite ? "Bỏ yêu thích" : "Lưu vào yêu thích"}
                  >
                    <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </button>

                  <button
                    onClick={() => toggleCompare(product)}
                    className={`flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] shadow-sm transition hover:scale-[1.02] ${
                      isCompared
                        ? "bg-[var(--primary)] text-[var(--on-primary)]"
                        : "bg-white text-gray-600 hover:bg-[var(--soft-blue)] hover:text-amber-600"
                    }`}
                    title="So sánh với sản phẩm khác"
                  >
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                    </svg>
                  </button>
                </div>
              </div>

              <a href={selectedImage} target="_blank" rel="noreferrer" className="inline-block min-h-10 text-sm font-medium text-[var(--primary-ink)] underline underline-offset-4">Mở ảnh đầy đủ để xem chi tiết</a>
              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => {
                  const isSelected = selectedImage === img;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      aria-pressed={isSelected}
                      aria-label={`Xem ${img.includes("bang_mau_nut") ? "bảng màu nút" : img.includes("bang_mau") ? "bảng màu vải" : `ảnh ${idx + 1}`}`}
                      className={`relative aspect-square overflow-hidden rounded-xl border-2 bg-[var(--surface-muted)] transition-all ${
                        isSelected
                          ? "border-[var(--secondary)] ring-2 ring-[var(--secondary-soft)]"
                          : "border-black/10 hover:border-black/30"
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} view ${idx + 1}`}
                        fill
                        className="object-contain p-2"
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Info & Actions */}
            <div className="flex flex-col justify-between space-y-6">
              <div>
                {/* Name */}
                <h1 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl text-gray-900">
                  {product.name}
                </h1>

                {/* Price */}
                <div className="mt-4 flex items-baseline gap-3">
                  <span className="price-text text-3xl font-extrabold md:text-4xl">
                    {product.priceConfirmed === false ? "Giá chờ xác nhận" : product.price.toLocaleString("vi-VN") + "₫"}
                  </span>
                  {product.originalPrice && (
                    <span className="text-lg text-gray-400 line-through">
                      {product.originalPrice.toLocaleString("vi-VN")}₫
                    </span>
                  )}
                  {discountPercent && (
                    <span className="rounded-full bg-[var(--surface-muted)] px-2 py-0.5 text-xs font-bold text-rose-600">
                      Tiết kiệm {discountPercent}%
                    </span>
                  )}
                </div>

                {/* Description summary */}
                <p className="mt-4 text-base leading-relaxed text-gray-600">
                  {product.description}
                </p>

                {/* Rating & Sold count */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 border border-amber-200">
                    <span className="text-sm font-bold text-amber-700">★ {product.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500">
                    Đã bán <strong className="text-gray-800">{product.sold}</strong>
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="rounded-md bg-amber-100/60 px-2.5 py-0.5 text-xs font-bold text-amber-800">
                    {product.category}
                  </span>
                  <span className="text-gray-300">•</span>
                  <span className="rounded-md bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
                    {product.size}
                  </span>
                </div>

                {/* Quick Spec Pills */}
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs bg-[var(--surface-muted)] p-3.5 rounded-2xl border border-[var(--brand-border)]">
                  <div>
                    <span className="text-gray-400">Máy tối đa:</span>
                    <span className="ml-1.5 font-bold text-gray-800">{product.kind === "sleeve" ? `${product.maxWidth} × ${product.maxHeight} × ${product.maxThickness ?? "—"} cm` : "Không áp dụng"}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Chất liệu:</span>
                    <span className="ml-1.5 font-bold text-gray-800">{product.material}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Chống nước:</span>
                    <span className={`ml-1.5 font-bold ${product.waterproof ? "text-[var(--secondary-ink)]" : "text-gray-600"}`}>
                      {product.waterproof ? "Có" : "Kháng bụi nhẹ"}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-400">Trọng lượng:</span>
                    <span className="ml-1.5 font-bold text-gray-800">{product.weight}</span>
                  </div>
                </div>

                {/* Color Selection */}
                {product.colors && product.colors.length > 0 && (
                  <div className="mt-6 border-t border-[var(--brand-border)] pt-5">
                    <span className="text-sm font-semibold text-gray-800">
                      {product.kind === "sleeve" ? "Chọn màu vải" : "Màu sắc"}: <span className="font-normal text-gray-600">{selectedColor}</span>
                    </span>
                    <div className="mt-3 flex flex-wrap gap-2.5">
                      {product.colors.map((color) => {
                        const isChosen = selectedColor === color;
                        return (
                          <button
                            key={color}
                            type="button"
                            onClick={() => setSelectedColor(color)}
                            aria-pressed={selectedColor === color}
                            className={`min-h-11 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                              isChosen
                                ? "border-2 border-[var(--secondary)] bg-[var(--secondary-soft)] text-[var(--text-primary)] shadow-sm"
                                : "border border-gray-200 bg-white text-gray-700 hover:border-gray-400"
                            }`}
                          >
                            {color}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {product.kind === "sleeve" && <ButtonSelector value={selectedButton} onChange={setSelectedButton} />}

                {product.supportsEmbroidery && <label className="mt-5 flex min-h-12 items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 text-sm"><input type="checkbox" checked={embroidery} onChange={e => setEmbroidery(e.target.checked)} />Thêu tên +{embroideryService.price.toLocaleString("vi-VN")}₫ / bao</label>}
                {product.priceConfirmed === false && <p className="mt-3 text-sm text-amber-800">Giá size này chưa được xác nhận. Vui lòng liên hệ trước khi mua.</p>}
                {product.supportsEmbroidery && <p className="mt-4 rounded-2xl border border-[var(--border)] p-4 text-sm leading-relaxed">Phụ kiện mua kèm (giá riêng): <Link className="underline" href={`/products/${accessory.id}`}>{accessory.name} · {accessory.price.toLocaleString("vi-VN")}₫</Link></p>}
                {/* Quantity Selector */}
                <div className="mt-6 border-t border-[var(--brand-border)] pt-5">
                  <span className="text-sm font-semibold text-gray-800">Số lượng:</span>
                  <div className="mt-3 flex items-center gap-4">
                    <div className="flex items-center rounded-full border border-gray-300 bg-white p-1 shadow-sm">
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        disabled={quantity <= 1}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 disabled:opacity-30"
                        aria-label="Giảm số lượng"
                      >
                        <span className="text-lg font-bold">−</span>
                      </button>
                      <span className="w-12 text-center text-sm font-bold text-gray-900">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="flex h-11 w-11 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100"
                        aria-label="Tăng số lượng"
                      >
                        <span className="text-lg font-bold">+</span>
                      </button>
                    </div>
                    <span className="text-xs font-medium text-[var(--secondary-ink)]">✓ Còn hàng sẵn sàng đóng gói</span>
                  </div>
                </div>

                {/* Add to Cart and Buy Now */}
                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <div className="flex-1">
                    <button onClick={handleAdd} disabled={product.priceConfirmed === false} className="w-full rounded-full bg-[var(--primary)] px-6 py-4 font-semibold text-[var(--on-primary)] transition-colors hover:bg-[var(--brand-primary-hover)] disabled:opacity-40">Thêm vào giỏ hàng</button>
                  </div>
                  <button
                    type="button"
                    onClick={handleBuyNow}
                    className="flex-1 rounded-full bg-[var(--soft-blue)] px-6 py-4 font-semibold text-[var(--text-primary)] transition-all hover:bg-[var(--secondary-soft)] hover:shadow-lg flex items-center justify-center gap-2"
                  >
                    <span>⚡ Mua ngay COD</span>
                  </button>
                </div>

                {/* Guarantees */}
                <div className="mt-8 grid grid-cols-2 gap-3 border-t border-[var(--brand-border)] pt-6 sm:grid-cols-4">
                  {guarantees.map((item, idx) => (
                    <div key={idx} className="flex flex-col items-center rounded-2xl bg-white p-3 text-center border border-[var(--brand-border)] shadow-sm">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]"><BenefitIcon kind={item.icon} /></span>
                      <span className="mt-1 text-xs font-semibold text-gray-800">{item.title}</span>
                      <span className="text-[11px] text-gray-500">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Details / Reviews Tabs */}
          <div className="mt-16 rounded-3xl bg-white p-6 md:p-10 shadow-sm border border-[var(--brand-border)]">
            <div className="flex border-b border-gray-200">
              <button
                type="button"
                onClick={() => setActiveTab("description")}
                className={`border-b-2 pb-4 text-sm font-semibold transition-colors ${
                  activeTab === "description"
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Mô tả chi tiết
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("details")}
                className={`ml-8 border-b-2 pb-4 text-sm font-semibold transition-colors ${
                  activeTab === "details"
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Thông số kỹ thuật
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`ml-8 border-b-2 pb-4 text-sm font-semibold transition-colors ${
                  activeTab === "reviews"
                    ? "border-[var(--primary)] bg-[var(--primary-soft)] text-[var(--text-primary)]"
                    : "border-transparent text-gray-500 hover:text-gray-900"
                }`}
              >
                Đánh giá khách hàng ({product.sold})
              </button>
            </div>

            <div className="mt-6">
              {activeTab === "description" && (
                <div className="space-y-4 text-gray-700 leading-relaxed max-w-3xl text-sm">
                  <p>{product.description}</p>
                  <p>
                    Dòng bao chống sốc <strong>{product.name}</strong> được thiết kế theo tiêu chuẩn công thái học hiện đại, bảo vệ toàn diện cho laptop khi bạn đi làm, đi học hoặc công tác xa.
                  </p>
                  {product.features && (
                    <div className="mt-4">
                      <h4 className="font-bold text-gray-900 mb-2">Đặc điểm nổi bật:</h4>
                      <ul className="list-disc pl-5 space-y-1.5 text-gray-600">
                        {product.features.map((feat, i) => (
                          <li key={i}>{feat}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "details" && (
                <div className="max-w-xl space-y-3">
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Phân loại dòng máy</span>
                    <span className="font-semibold text-gray-900">{product.category}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Kích thước phù hợp</span>
                    <span className="font-semibold text-gray-900">{product.size}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Kích thước máy tối đa</span>
                    <span className="font-semibold text-gray-900">
                      {product.kind === "sleeve" ? `${product.maxWidth} × ${product.maxHeight} × ${product.maxThickness ?? "—"} cm` : "Không áp dụng"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Chất liệu cấu tạo</span>
                    <span className="font-semibold text-gray-900">{product.material}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Kháng nước</span>
                    <span className="font-semibold text-gray-900">
                      {product.waterproof ? "Có (Chống tia nước văng)" : "Kháng bụi nhẹ"}
                    </span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Trọng lượng siêu nhẹ</span>
                    <span className="font-semibold text-gray-900">{product.weight}</span>
                  </div>
                  <div className="flex justify-between border-b border-gray-100 py-2.5 text-sm">
                    <span className="text-gray-500">Màu sắc có sẵn</span>
                    <span className="font-semibold text-gray-900">{product.colors.join(", ")}</span>
                  </div>
                  <div className="flex justify-between py-2.5 text-sm">
                    <span className="text-gray-500">Thích hợp cho</span>
                    <span className="font-semibold text-gray-900">{product.suitableFor.join(", ")}</span>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-amber-50 p-4 text-center border border-amber-200">
                      <span className="text-3xl font-extrabold text-amber-600">{product.rating}</span>
                      <div className="text-amber-500 text-sm">★★★★★</div>
                      <span className="text-xs text-gray-500">{product.sold} đánh giá</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="font-medium text-gray-900">98% khách hàng đánh giá 5 sao về độ vừa vặn và bảo vệ chống va đập.</p>
                      <p className="mt-1 text-xs text-gray-500">Tất cả đánh giá đều từ người mua hàng thực tế tại CaseUp.</p>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-gray-100">
                    <div className="rounded-2xl bg-[var(--brand-cream)] p-4 border border-[var(--brand-border)]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Trần Hoàng Long</span>
                        <span className="text-xs text-gray-400">1 ngày trước</span>
                      </div>
                      <div className="text-amber-500 text-xs mt-1">★★★★★</div>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        Bao vừa khít máy, lớp lót nhung bên trong sờ êm tay cực kỳ. Màu sắc đẹp đúng như ảnh, đóng gói kỹ!
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[var(--brand-cream)] p-4 border border-[var(--brand-border)]">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">Nguyễn Mai Phương</span>
                        <span className="text-xs text-gray-400">3 ngày trước</span>
                      </div>
                      <div className="text-amber-500 text-xs mt-1">★★★★★</div>
                      <p className="mt-2 text-xs sm:text-sm text-gray-600">
                        Nhờ AI tư vấn kích thước nên đặt về vừa như in cho con Macbook 14 inch. Rất hài lòng với dịch vụ shop!
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="bg-white py-14 border-t border-[var(--brand-border)]">
          <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-20">
            <div className="mb-8 flex items-end justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                  Gợi ý thêm
                </span>
                <h2 className="mt-1 text-2xl font-bold text-gray-900 md:text-3xl">
                  Sản phẩm tương tự cùng kích thước
                </h2>
              </div>
              <Link
                href="/products"
                className="text-sm font-semibold text-amber-600 hover:text-amber-700 transition"
              >
                Xem tất cả các mẫu →
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item) => (
                <Link
                  key={item.id}
                  href={`/products/${item.id}`}
                  className="group block rounded-3xl bg-[var(--brand-cream)] p-4 transition-all hover:-translate-y-1 hover:shadow-lg border border-[var(--brand-border)]"
                >
                  <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 25vw"
                      className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                    {item.badge && (
                      <span className="absolute left-2.5 top-2.5 rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold text-[var(--on-primary)]">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <div className="mt-3">
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{item.size}</span>
                      <span className="text-amber-600 font-semibold">★ {item.rating}</span>
                    </div>
                    <h3 className="mt-1 text-sm font-bold text-gray-900 line-clamp-1 group-hover:text-amber-600 transition-colors">
                      {item.name}
                    </h3>
                    <p className="price-text mt-1 text-sm font-extrabold">
                      {item.priceConfirmed === false ? "Giá chờ xác nhận" : item.price.toLocaleString("vi-VN") + "₫"}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* AI Help Banner */}
      <section className="mx-auto max-w-7xl px-6 py-10 md:px-12 lg:px-20">
        <div className="relative overflow-hidden rounded-3xl bg-[var(--primary)] p-8 text-[var(--on-primary)] shadow-xl md:p-12">
          <div className="relative z-10 max-w-2xl">
            <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-sm">
              Trợ lý thông minh
            </span>
            <h3 className="mt-3 text-2xl font-bold md:text-3xl">
              Bạn phân vân không biết máy mình vừa size nào?
            </h3>
            <p className="mt-2 text-sm text-[var(--on-primary)] md:text-base">
              Chỉ cần nhập tên đời máy hoặc kích thước dài × rộng, AI CaseUp sẽ tính toán và tư vấn chính xác chiếc bao phù hợp nhất.
            </p>
            <div className="mt-6">
              <OpenChatButton />
            </div>
          </div>
        </div>
      </section>

      {/* Floating Chat */}
      <ChatBox />
    </main>
  );
}
