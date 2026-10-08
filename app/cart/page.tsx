"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";
import Navbar from "@/components/Navbar";
export default function CartPage() {
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    totalItems,
    totalPrice,
  } = useCart();

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#1f1f1f]">
      {/* Header */}
      <Navbar />

      <section className="px-10 py-14 md:px-20">
        <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
          Shopping Cart
        </p>

        <h1 className="mt-2 text-4xl font-bold">Giỏ hàng của bạn</h1>
      </section>

      <section className="px-10 pb-16 md:px-20">
        {cart.length === 0 ? (
          <div className="rounded-3xl bg-white p-10 text-center">
            <p className="text-lg font-medium">Giỏ hàng đang trống.</p>

            <Link
              href="/products"
              className="mt-5 inline-block rounded-full bg-black px-6 py-3 text-white"
            >
              Xem sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
            {/* Cart items */}
            <div className="space-y-5">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-5 rounded-3xl bg-white p-5"
                >
                  <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="128px"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">{item.name}</h2>

                      <p className="mt-1 text-sm text-gray-500">{item.size}</p>

                      <p className="mt-2 font-semibold">
                        {item.price.toLocaleString("vi-VN")}đ
                      </p>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="h-9 w-9 rounded-full border border-black/20"
                        >
                          −
                        </button>

                        <span className="min-w-6 text-center">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="h-9 w-9 rounded-full border border-black/20"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-sm text-red-600 underline"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="h-fit rounded-3xl bg-white p-6">
              <h2 className="text-xl font-semibold">Tóm tắt đơn hàng</h2>

              <div className="mt-6 space-y-4 border-b border-black/10 pb-6">
                <div className="flex justify-between text-sm">
                  <span>Số lượng</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Tạm tính</span>
                  <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span>Phí vận chuyển</span>
                  <span>Miễn phí</span>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-lg font-bold">
                <span>Tổng cộng</span>
                <span>{totalPrice.toLocaleString("vi-VN")}đ</span>
              </div>

              <button className="mt-6 w-full rounded-full bg-black px-6 py-4 font-medium text-white">
                Thanh toán
              </button>

              <p className="mt-3 text-center text-xs text-gray-500">
                Chức năng thanh toán chỉ dùng cho demo.
              </p>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
