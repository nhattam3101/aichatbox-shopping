"use client";

import Image from "next/image";
import Link from "next/link";
import { useWishlist } from "@/components/WishlistContext";
import { useCart } from "@/components/CartContext";
import { useDialogFocus } from "@/components/useDialogFocus";

export default function WishlistDrawer() {
  const { wishlist, isWishlistOpen, setIsWishlistOpen, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();
  const dialogRef = useDialogFocus(isWishlistOpen, () => setIsWishlistOpen(false));

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
        <div ref={dialogRef} role="dialog" aria-modal="true" aria-label="Danh sách yêu thích" tabIndex={-1} className="w-screen max-w-md transform bg-white shadow-2xl transition ease-in-out duration-300 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-500">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </span>
              <h2 className="text-lg font-bold text-gray-900">Danh sách yêu thích ({wishlist.length})</h2>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
              aria-label="Đóng"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlist.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-12">
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-rose-50 text-rose-300 mb-4">
                  <svg className="h-10 w-10 fill-current" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-lg">Chưa có sản phẩm yêu thích</h3>
                <p className="mt-2 text-sm text-gray-500 max-w-xs">
                  Nhấn vào biểu tượng trái tim ở bất kỳ sản phẩm nào để lưu lại xem sau.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="mt-6 rounded-full bg-[var(--primary)] px-6 py-2.5 text-sm font-medium text-[var(--on-primary)] transition hover:bg-[var(--brand-primary-hover)]"
                >
                  Khám phá sản phẩm ngay
                </button>
              </div>
            ) : (
              wishlist.map((item) => (
                <div
                  key={item.id}
                  className="group relative flex gap-4 rounded-2xl border border-gray-100 bg-white p-3 shadow-sm hover:border-gray-200 hover:shadow-md transition"
                >
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-50 border border-gray-100">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-contain p-1 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.id}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="font-medium text-gray-900 text-sm hover:text-amber-600 transition truncate"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeFromWishlist(item.id)}
                          className="text-gray-300 hover:text-[var(--text-primary)] transition shrink-0"
                          title="Xóa khỏi yêu thích"
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mt-0.5">{item.size} • {item.category}</p>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="price-text font-bold text-sm">
                        {item.priceConfirmed === false ? "Giá chờ xác nhận" : item.price.toLocaleString("vi-VN") + "₫"}
                      </span>
                      <button
                        onClick={() => {
                          addToCart({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            image: item.image,
                            size: item.size,
                            quantity: 1,
                            selectedColor: item.colors[0],
                          });
                        }}
                        className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)] px-3 py-1.5 text-xs font-medium text-[var(--on-primary)] hover:bg-[var(--brand-primary-hover)] transition"
                      >
                        <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                        </svg>
                        Thêm vào giỏ
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer actions */}
          {wishlist.length > 0 && (
            <div className="border-t border-gray-100 p-6 bg-gray-50/50 space-y-3">
              <button
                onClick={() => {
                  wishlist.forEach((item) => {
                    addToCart(
                      {
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        image: item.image,
                        size: item.size,
                        quantity: 1,
                        selectedColor: item.colors[0],
                      },
                      false
                    );
                  });
                  clearWishlist();
                  setIsWishlistOpen(false);
                }}
                className="w-full rounded-full bg-[var(--primary)] py-3.5 text-sm font-semibold text-[var(--on-primary)] shadow-md hover:bg-[var(--brand-primary-hover)] transition flex items-center justify-center gap-2"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
                Thêm tất cả vào giỏ hàng
              </button>

              <button
                onClick={clearWishlist}
                className="w-full text-center text-xs font-medium text-gray-400 hover:text-red-500 transition py-1"
              >
                Xóa tất cả danh sách yêu thích
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
