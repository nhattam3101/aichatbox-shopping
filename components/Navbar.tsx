"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { useWishlist } from "@/components/WishlistContext";
import { useState } from "react";
import GlobalSearchModal from "@/components/GlobalSearchModal";
import WishlistDrawer from "@/components/WishlistDrawer";
import { accountLinks } from "@/data/account-navigation";
import { useCustomerNotifications } from "@/components/useCustomerNotifications";

export default function Navbar() {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { wishlistCount, setIsWishlistOpen } = useWishlist();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { unreadCount } = useCustomerNotifications();

  const navLinks = [
    { href: "/", label: "Trang chủ" },
    { href: "/products", label: "Sản phẩm" },
    { href: "/custom", label: "Tự thiết kế" },
    { href: "/size-guide", label: "Chọn size" },
    { href: "/about", label: "Về chúng tôi" },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[var(--brand-border)] bg-[var(--background)]/95 backdrop-blur-xl transition-all">
        <div className="mx-auto flex max-w-7xl flex-nowrap items-center justify-between gap-2 px-4 py-3 sm:gap-3 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link href="/" className="group flex shrink-0 items-center gap-2 whitespace-nowrap sm:gap-3">
            <div className="overflow-hidden rounded-2xl border border-[var(--brand-border)] shadow-sm transition group-hover:scale-105">
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
              <span className="hidden 2xl:inline-block text-[10px] font-semibold tracking-wider text-amber-600 uppercase ml-2 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                Premium
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav aria-label="Điều hướng chính" className="hidden shrink-0 flex-nowrap items-center gap-0.5 whitespace-nowrap xl:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`shrink-0 whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-sm"
                      : "text-gray-600 hover:bg-black/5 hover:text-[var(--text-primary)]"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <details className="relative shrink-0" onKeyDown={e => { if (e.key === "Escape") { e.currentTarget.open = false; e.currentTarget.querySelector("summary")?.focus(); } }}>
              <summary className="flex min-h-11 cursor-pointer items-center gap-1 whitespace-nowrap rounded-full px-3 text-sm font-semibold text-gray-600 focus-visible:outline-2 focus-visible:outline-[var(--secondary)]">Tài khoản{unreadCount > 0 && <span aria-label={`${unreadCount} thông báo chưa đọc`} className="h-2 w-2 rounded-full bg-[var(--secondary)]" />}</summary>
              <div className="absolute right-0 top-full z-50 mt-2 w-52 rounded-2xl border border-[var(--border)] bg-white p-2 shadow-lg">
                {accountLinks.map(link => <Link key={link.href} href={link.href} className="block rounded-xl px-4 py-3 text-sm font-semibold hover:bg-[var(--secondary-soft)]">{link.label}{link.href === "/notifications" && unreadCount > 0 && <span className="ml-2 rounded-full bg-[var(--secondary-soft)] px-2 py-1 text-xs text-[var(--secondary-ink)]">{unreadCount}</span>}</Link>)}
              </div>
            </details>
          </nav>

          {/* Action Icons */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            {/* Search Button */}
            <button
              onClick={() => { setMobileOpen(false); setIsSearchOpen(true); }}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-[var(--surface-muted)] text-gray-600 transition hover:border-[var(--secondary)] hover:bg-white"
              title="Tìm kiếm (ESC để đóng)"
              aria-label="Tìm kiếm sản phẩm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Wishlist Button */}
            <button
              onClick={() => { setMobileOpen(false); setIsWishlistOpen(true); }}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 transition hover:border-rose-300 hover:bg-rose-50 hover:text-[var(--text-primary)] shadow-sm"
              aria-label="Danh sách yêu thích"
            >
              <svg className="h-4.5 w-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-[var(--yellow)] text-[10px] font-bold text-[var(--text-primary)] shadow">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <Link
              href="/cart"
              aria-label={`Giỏ hàng (${totalItems} sản phẩm)`}
              className="relative inline-flex min-h-11 shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-[var(--primary)] px-3 py-2.5 text-xs font-semibold text-[var(--on-primary)] transition hover:bg-[var(--brand-primary-hover)] sm:px-4 sm:text-sm"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              <span className="hidden sm:inline">Giỏ hàng</span>
              {totalItems > 0 && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-amber-400 text-xs font-extrabold text-[var(--text-primary)]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full p-2 text-gray-700 hover:bg-gray-100 xl:hidden"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                )}
              </svg>
              {unreadCount > 0 && <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-[var(--secondary)]"><span className="sr-only">Có thông báo chưa đọc</span></span>}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <nav id="mobile-navigation" aria-label="Điều hướng di động" onKeyDown={event => { if (event.key === "Escape") { setMobileOpen(false); document.querySelector<HTMLButtonElement>('[aria-controls="mobile-navigation"]')?.focus(); } }} className="max-h-[calc(100dvh-5rem)] overflow-y-auto overscroll-contain border-t border-[var(--brand-border)] bg-white px-6 py-4 xl:hidden space-y-1 animate-fade-in-up">
            <div className="mb-2 border-b border-[var(--border)] pb-2"><p className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">Tài khoản</p>
              {accountLinks.map(link => <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)} aria-current={pathname === link.href ? "page" : undefined} className="block rounded-xl px-4 py-3 text-sm font-semibold text-[var(--secondary-ink)] hover:bg-[var(--secondary-soft)]">{link.label}{link.href === "/notifications" && unreadCount > 0 && <span className="ml-2 rounded-full bg-[var(--secondary-soft)] px-2 py-1 text-xs">{unreadCount}</span>}</Link>)}
            </div>
            {navLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => setMobileOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isActive ? "bg-[var(--primary)] text-[var(--on-primary)]" : "text-gray-700 hover:bg-black/5"
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
                Tìm kiếm sản phẩm
              </button>
              <button
                onClick={() => {
                  setMobileOpen(false);
                  setIsWishlistOpen(true);
                }}
                className="flex-1 rounded-xl bg-rose-50 py-2.5 text-xs font-semibold text-rose-600 text-center"
              >
                Yêu thích ({wishlistCount})
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
