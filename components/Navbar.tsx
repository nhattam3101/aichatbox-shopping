"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useState } from "react";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import WishlistDrawer from "@/components/WishlistDrawer";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/size-guide", label: "Chọn size" },
    { href: "/about", label: "Về chúng tôi" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-black/5 bg-white/80 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3.5 md:px-12">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="overflow-hidden rounded-2xl border border-black/5 shadow-sm transition group-hover:scale-105">
              <Image
                src="/logoShop.png"
                alt="CaseUp"
                width={40}
                height={40}
                className="object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-amber-600 transition">
                CaseUp
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-amber-600 uppercase ml-2 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Premium
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300 hover-scale hover-lift ${
                    isActive
                      ? "bg-black text-white shadow-sm"
                      : "text-gray-600 hover:bg-black/5 hover:text-black"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2.5">
            {/* Search Button */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50/80 px-3.5 py-2 text-xs font-medium text-gray-500 transition hover:border-gray-400 hover:bg-white hover:text-black hover:shadow-sm"
              title="Tìm kiếm (ESC để đóng)"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <span className="hidden lg:inline">Tìm kiếm...</span>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-rose-500 shadow-sm"
              aria-label="Danh sách yêu thích"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              className="relative flex items-center gap-2 rounded-full bg-black px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg active:scale-95"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="hidden sm:inline">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-extrabold text-black animate-pulse">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="rounded-full p-2 text-gray-700 hover:bg-gray-100 md:hidden"
              aria-label="Menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <nav className="border-t border-black/5 bg-white px-6 py-4 md:hidden space-y-1 animate-fade-in-up">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive ? "bg-black text-white" : "text-gray-700 hover:bg-black/5"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsSearchOpen(true);
                }}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 text-center"
              >
                🔍 Tìm kiếm sản phẩm
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="flex-1 rounded-xl bg-rose-50 py-2.5 text-xs font-semibold text-rose-600 text-center"
              >
                ❤️ Yêu thích ({wishlistCount})
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* Global Modals */}
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      <WishlistDrawer />
    </>
  );
}
