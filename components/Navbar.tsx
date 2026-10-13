"use client";

import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/components/CartContext";
import { useState } from "react";

export default function Navbar() {
  const { totalItems } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3 md:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="overflow-hidden rounded-full border border-black/5 shadow-sm">
            <Image
              src="/logoShop.png"
              alt="CaseUp"
              width={40}
              height={40}
              className="object-cover"
              priority
            />
          </div>
          <span className="text-lg font-bold tracking-tight">CaseUp</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/products", label: "Sản phẩm" },
            { href: "/size-guide", label: "Chọn size" },
            { href: "/about", label: "Về chúng tôi" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2 text-sm font-medium text-gray-600 transition-all hover:bg-black/5 hover:text-black"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          {/* Search icon */}
          <button className="hidden rounded-lg p-2 text-gray-500 transition-colors hover:bg-black/5 hover:text-black md:flex">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
          </button>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative flex items-center gap-2 rounded-full bg-black px-5 py-2.5 text-sm font-medium text-white transition-all hover:bg-gray-800 hover:shadow-lg"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
            Giỏ hàng
            {totalItems > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-bold text-black">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile menu */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gray-600 md:hidden"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <nav className="border-t border-black/5 bg-white px-6 py-4 md:hidden">
          {[
            { href: "/", label: "Trang chủ" },
            { href: "/products", label: "Sản phẩm" },
            { href: "/size-guide", label: "Chọn size" },
            { href: "/about", label: "Về chúng tôi" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="block rounded-lg px-4 py-3 text-sm font-medium text-gray-600 transition-colors hover:bg-black/5"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
