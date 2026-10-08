"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function Navbar() {
  const { totalItems } = useCart();

  return (
    <header className="flex items-center justify-between border-b border-black/10 bg-white px-10 py-6">
      <Link href="/" className="text-2xl font-bold tracking-wide">
        SleeveAI
      </Link>

      <nav className="flex gap-8 text-sm font-medium">
        <Link href="/">Trang chủ</Link>
        <Link href="/products">Sản phẩm</Link>
        <Link href="/size-guide">Hướng dẫn chọn size</Link>
        <Link href="/about">Về chúng tôi</Link>
        <Link href="/cart">Giỏ hàng ({totalItems})</Link>
      </nav>
    </header>
  );
}
