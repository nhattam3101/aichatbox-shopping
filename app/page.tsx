"use client";

import { returningCustomerOffer } from "@/data/vouchers";
import AntigravityBackground from "@/components/AntigravityBackground";
import { contact } from "@/data/contact";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { products, accessories, type Product } from "@/data/products";
import ChatBox from "@/components/ChatBox";
import BenefitIcon from "@/components/BenefitIcon";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";
import ReturnPolicyModal from "@/components/ReturnPolicyModal";
import PromotionPopup from "@/components/PromotionPopup";
import PromoBannerSection from "@/components/PromoBannerSection";
import { homepagePromotionPolicy } from "@/data/promotions";

const showcaseCards = [
  { product: products.find(p => p.id === 1)!, label: "Bao bảo vệ iPad / Tablet 11 inch", tone: "bg-white" },
  { product: products.find(p => p.id === 3)!, label: "Bao bảo vệ Laptop 14 inch", tone: "bg-[var(--soft-blue)]" },
  { product: accessories.find(p => p.id === 15)!, label: "Móc treo trang trí ngôi sao", tone: "bg-[var(--primary-soft)]" },
  { product: accessories.find(p => p.id === 16)!, label: "Móc treo trang trí hoa", tone: "bg-[var(--surface-muted)]" },
];

export default function Home() {
  const [activeTab, setActiveTab] = useState<"bestseller" | "new" | "shockproof" | "pastel">("bestseller");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isReturnPolicyOpen, setIsReturnPolicyOpen] = useState(false);
  const [announcementPaused, setAnnouncementPaused] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const bestSellers = products.filter((p) => p.badge === "Bán chạy" || p.badge === "Hot" || p.badge === "Top 1").slice(0, 8);
  const newArrivals = products.filter((p) => p.badge === "Mới" || p.badge === "Premium").slice(0, 8);
  const shockproofCollection = products.filter((p) => p.category === "Chống sốc").slice(0, 8);
  const pastelCollection = products.filter((p) => p.category === "Thời trang").slice(0, 8);

  const displayedProducts =
    activeTab === "bestseller"
      ? bestSellers
      : activeTab === "new"
      ? newArrivals
      : activeTab === "shockproof"
      ? shockproofCollection
      : pastelCollection;

  const faqs = [
    {
      q: "Làm thế nào để biết bao laptop có vừa khít với máy của tôi?",
      a: "Bạn có thể dùng công cụ 'Chọn size' thông minh trên thanh menu hoặc bấm vào nút 'AI Tư Vấn'. Chỉ cần nhập tên model máy (như MacBook Air M2, ThinkPad X1, Dell XPS...) hoặc chiều dài × rộng × độ dày thực tế. Đo máy gập kín và kiểm tra đủ ba chiều trước khi mua.",
    },
    {
      q: "Tôi có được mở hàng kiểm tra trước khi thanh toán không?",
      a: "Chắc chắn! CaseUp hỗ trợ 100% hình thức đồng kiểm khi nhận hàng (COD). Bạn được phép mở bưu phẩm, ướm thử laptop vào bao. Nếu vừa vặn và ưng ý thì mới thanh toán cho bưu tá.",
    },
    {
      q: "Nếu máy không vừa hoặc muốn đổi màu khác thì sao?",
      a: "CaseUp hỗ trợ đổi trả trong 3 ngày cho sản phẩm lỗi, sai màu hoặc sai kích thước so với đơn hàng đã xác nhận. Sản phẩm cần còn nguyên tem mác, phụ kiện và chưa qua sử dụng. Vui lòng cung cấp video khui hàng và liên hệ CaseUp để được hỗ trợ.",
    },
    {
      q: "Chất liệu của bao CaseUp có trượt nước tốt không?",
      a: "Khả năng trượt nước khác nhau theo từng sản phẩm. Hãy xem thông tin chất liệu và trượt nước trên trang chi tiết; không mặc định bao có thể chống thấm hoàn toàn.",
    },
  ];

  return (
    <main className="home-page min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      {/* Announcement Marquee Ticker */}
      <div className="relative overflow-hidden bg-[var(--text-primary)] py-2.5 pr-28 text-white">
        <button type="button" aria-pressed={announcementPaused} onClick={() => setAnnouncementPaused(value => !value)} className="absolute right-0 top-0 z-10 h-full bg-[var(--deep-navy)] px-4 text-xs font-semibold text-white">{announcementPaused ? "Tiếp tục" : "Tạm dừng"}<span className="sr-only"> thông báo</span></button>
        <div className="animate-marquee flex whitespace-nowrap text-xs font-medium" style={{ animationPlayState: announcementPaused ? "paused" : undefined }}>
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} aria-hidden={i === 1 ? true : undefined} className="mx-6 flex items-center gap-6 text-white/90">
              <span>{returningCustomerOffer.title}</span>
              <span>•</span>
              <span>🚚 Miễn phí vận chuyển toàn quốc đơn từ 300K</span>
              <span>•</span>
              <span>🔄 Đổi trả trong 3 ngày</span>
              <span>•</span>
              <span>🤖 Trợ lý AI tư vấn chuẩn size 24/7</span>
              <span>•</span>
              <span>⭐ Đánh giá 4.9/5 từ hơn 2,400+ khách hàng</span>
              <span>•</span>
              <span>📦 Kiểm tra hàng trước khi thanh toán COD</span>
              <span>•</span>
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative isolate overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        <AntigravityBackground />
        {/* Ambient Gradient Glows */}
        <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-[var(--surface-muted)] opacity-40 pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-[450px] w-[450px] rounded-full bg-[var(--surface-muted)] opacity-40 pointer-events-none" />

        <div className="mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:px-8 lg:gap-12 lg:px-12">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-300/80 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-600"></span>
              </span>
              <span>CaseUp Handmade · Theo gu của bạn</span>
            </div>

            <h1 id="main-content" tabIndex={-1} className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
              Bảo vệ
              <br />
              máy yêu,
              <br />
              <span className="text-[var(--text-primary)]">
                chuẩn gu tinh tế.
              </span>
            </h1>

            <p className="max-w-lg text-base md:text-lg leading-relaxed text-gray-600">
              Một chiếc bao bảo vệ, một chút dấu ấn riêng. Chọn size vừa máy, phối màu vải, mẫu cúc/nút và thêm nét thêu tên để chiếc bao mang gu của bạn.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-bold text-[var(--on-primary)] shadow-md transition-[background-color,transform,box-shadow] duration-200 hover:bg-[var(--brand-primary-hover)] hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span>Khám phá bộ sưu tập</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/size-guide"
                className="inline-flex items-center gap-2 rounded-full border border-[var(--deep-navy)] bg-white px-7 py-4 text-sm font-bold text-gray-800 shadow-sm transition hover:border-black/30 hover:bg-gray-50"
              >
                <span>📏 Tìm size theo máy</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-[var(--brand-border)] flex flex-wrap items-center gap-4">
              <div className="flex -space-x-3">
                {["ĐH", "TA", "MN", "QT", "LK"].map((initials, i) => (
                  <div
                    key={initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm"
                    style={{
                      background: ["var(--primary-ink)", "var(--secondary)", "var(--deep-navy)", "var(--primary-ink)", "var(--secondary)"][i],
                      zIndex: 5 - i,
                    }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} aria-hidden={i === 1 ? true : undefined} className="text-[var(--yellow)] text-sm">★</span>
                  ))}
                  <span className="ml-1 text-xs font-bold text-gray-800">4.9 / 5</span>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Được tin dùng bởi <strong className="text-gray-800">2,400+</strong> khách hàng trên toàn quốc
                </p>
              </div>
            </div>
          </div>

          {/* Hero Visual Collage */}
          <div className="relative">
            <div className="grid grid-cols-2 items-start gap-4 sm:gap-5 lg:gap-6">
              {[[showcaseCards[0], showcaseCards[2]], [showcaseCards[1], showcaseCards[3]]].map((column, columnIndex) => (
                <div key={columnIndex} className={`min-w-0 space-y-4 sm:space-y-5 lg:space-y-6 ${columnIndex === 1 ? "pt-8 sm:pt-12" : ""}`}>
                  {column.map(({ product, label, tone }, cardIndex) => (
                    <Link
                      key={product.id}
                      href={`/products/${product.id}`}
                      className={`group relative block overflow-hidden rounded-[28px] shadow-[0_8px_24px_-12px_rgba(70,50,40,0.22)] transition-[transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-12px_rgba(70,50,40,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-600 sm:rounded-[36px] ${tone} ${columnIndex === cardIndex ? "aspect-[4/5]" : "aspect-[1/1]"}`}
                    >
                      <Image
                        src={product.image}
                        alt={label}
                        fill
                        sizes="(max-width: 767px) calc((100vw - 64px) / 2), (max-width: 1279px) 27vw, 320px"
                        className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.02]"
                        preload={cardIndex === 0}
                      />
                      <span className="absolute bottom-3 left-3 right-3 w-fit max-w-[calc(100%-1.5rem)] rounded-xl bg-[var(--background)]/90 px-3 py-2 text-[10px] font-semibold leading-snug text-[var(--text-primary)] backdrop-blur-sm sm:bottom-4 sm:left-4 sm:right-4 sm:text-xs">
                        {label}
                      </span>
                    </Link>
                  ))}
                </div>
              ))}
            </div>

            {/* Floating feature pills */}
            <div className="relative mx-auto mt-5 w-fit max-w-full z-20 flex items-center gap-3 rounded-full border border-black/10 bg-white/95 px-6 py-3 shadow-2xl backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-xl">
                🛡️
              </div>
              <div className="text-left">
                <p className="text-[11px] text-gray-400 leading-tight">Chống va đập 360°</p>
                <p className="text-sm font-extrabold text-amber-600">Chọn size theo số đo</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Strip */}
      <section className="border-y border-[var(--brand-border)] bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4 md:p-6">
          {[
            { icon: "🚚", title: "Freeship Toàn Quốc", desc: "Áp dụng đơn từ 300.000₫" },
            { icon: "🔄", title: "Đổi trả trong 3 ngày", desc: "Theo điều kiện chính sách" },
            { icon: "🛡️", title: "Chống Va Đập", desc: "Bảo vệ máy mỗi ngày" },
            { icon: "🤖", title: "AI Tư Vấn 24/7", desc: "Hỗ trợ chọn size" },
          ].map((item, i) => (
            <div key={i} className="flex min-w-0 items-center gap-4 rounded-2xl border border-[var(--brand-border)] bg-[var(--brand-cream)] p-5 transition-shadow duration-200 hover:shadow-sm">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--success-soft)] text-[var(--success)]"><BenefitIcon kind={item.icon} /></span>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                <p className="text-xs leading-relaxed text-gray-600 mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Laptop Size Selector Bar */}
      <section className="py-12 px-6 md:px-12 bg-[var(--surface-muted)] border-b border-[var(--brand-border)]">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                Tìm Nhanh Theo Dòng Máy
              </span>
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 mt-1">
                Bạn đang sử dụng chiếc laptop nào?
              </h2>
            </div>
            <Link
              href="/size-guide"
              className="text-xs font-bold text-amber-700 hover:text-[var(--text-primary)] underline shrink-0"
            >
              Mở công cụ đo chi tiết (cm) →
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-2.5">
            {[
              "MacBook Air 13 (M1/M2/M3)",
              "MacBook Pro 14 M3",
              "MacBook Pro 16",
              "Dell XPS 13 Plus",
              "Dell XPS 15 / 16",
              "ThinkPad X1 Carbon",
              "Asus ZenBook 14",
              "Gaming 15.6 inch (TUF / Nitro)",
              "Workstation 16 inch",
            ].map((name) => (
              <Link
                key={name}
                href="/size-guide"
                className="rounded-full border border-[var(--brand-border)] bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-black/25 hover:bg-[var(--soft-blue)]"
              >
                💻 {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <PromoBannerSection />

      {/* Interactive Tabbed Product Showcase */}
      <section className="py-20 px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
                Bộ Sưu Tập Nổi Bật
              </span>
              <h2 className="mt-2 text-3xl md:text-4xl font-extrabold text-gray-900">
                Lựa Chọn Tốt Nhất Cho Bạn
              </h2>
            </div>

            {/* Collection Tabs */}
            <div className="flex flex-wrap gap-2">
              {[
                { id: "bestseller", label: "🔥 Bán chạy nhất" },
                { id: "new", label: "✨ Hàng mới về" },
                { id: "shockproof", label: "🛡️ Chống sốc 360" },
                { id: "pastel", label: "🌸 Thời trang Pastel" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-[var(--primary)] text-[var(--on-primary)] shadow-md scale-105"
                      : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Products Grid */}
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {displayedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onQuickView={(p) => setQuickViewProduct(p)}
              />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-transparent px-8 py-3.5 text-sm font-bold text-[var(--text-primary)] transition-colors hover:bg-black/5"
            >
              Xem tất cả 24 sản phẩm & lọc nâng cao →
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Feature Banner */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="brand-dark relative overflow-hidden rounded-3xl bg-[var(--deep-navy)] p-8 md:p-16 text-white shadow-2xl">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-amber-500/20 blur-[120px] pointer-events-none" />
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-amber-300">
                <span>🤖</span> CaseUp Smart AI Advisor
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight">
                Không chắc chắn kích thước?
                <br />
                <span className="text-[var(--yellow)]">Hỏi ngay trợ lý AI.</span>
              </h2>
              <p className="mt-4 text-sm text-gray-300 leading-relaxed max-w-md">
                Trợ lý AI của CaseUp được đào tạo với thông số chi tiết của hơn 200 dòng laptop hiện đại. AI sẽ tư vấn kích thước vừa khít, màu sắc hợp mệnh và mức giá lý tưởng nhất.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    const btn = document.getElementById("chatbox-toggle");
                    if (btn) btn.click();
                  }}
                  className="rounded-full bg-[var(--yellow)] px-6 py-3.5 text-xs sm:text-sm font-bold text-[var(--text-primary)] shadow-md hover:bg-[var(--yellow)] transition"
                >
                  Mở Trợ Lý AI Ngay
                </button>
                <Link
                  href="/size-guide"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/10 transition"
                >
                  Công cụ đo kích thước
                </Link>
              </div>
            </div>

            {/* AI Mockup Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-3.5 text-xs">
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-[var(--primary)] px-4 py-2.5 text-[var(--on-primary)] font-semibold">
                  Laptop mình là MacBook Pro 14 M3, muốn mẫu da sang trọng đi họp?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-gray-100 space-y-2">
                  <p>
                    Chào bạn! MacBook Pro 14 có kích thước <strong>31.3 × 22.1 cm</strong>.
                  </p>
                  <p>
                    Bạn hãy đo thêm độ dày máy để mình kiểm tra đủ ba chiều. Có thể tham khảo <strong>{products[2].name}</strong>; thông tin màu sắc và chất liệu nằm trong trang chi tiết sản phẩm.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-white py-20 px-6 md:px-12 border-y border-[var(--brand-border)]">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
              Đánh Giá Thực Tế
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
              Khách Hàng Nói Gì Về CaseUp?
            </h2>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                name: "Nguyễn Hải Đăng",
                role: "Senior Frontend Dev",
                laptop: "MacBook Pro 16 M2",
                avatar: "👨‍💻",
                comment: "Bao MaxGuard 16 chống sốc siêu dày dặn, lớp nhung lót mịn không để lại vết hằn trên vỏ nhôm của Mac. Đã mua chiếc thứ 2 cho đồng nghiệp!",
                rating: 5,
              },
              {
                name: "Trần Mai Phương",
                role: "Content Creator",
                laptop: "MacBook Air M2 13",
                avatar: "👩‍🎨",
                comment: "Màu bao xinh xỉu! Chần bông gợn sóng mềm như gối ôm mà lại có ngăn túi phụ đựng cáp sạc gọn gàng. Giao hàng 2 ngày là nhận được.",
                rating: 5,
              },
              {
                name: "Lê Văn Thắng",
                role: "Project Manager",
                laptop: "Dell XPS 15",
                avatar: "💼",
                comment: "Rất ấn tượng với tính năng AI tư vấn. Mình chỉ nhập Dell XPS 15 là AI chỉ đích danh size 15.6 vừa khít 100%. Nhận hàng mở ra ưng ý luôn.",
                rating: 5,
              },
            ].map((item, idx) => (
              <div key={idx} className="rounded-3xl border border-[var(--brand-border)] bg-[var(--brand-cream)] p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm text-xl">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.role} • {item.laptop}</p>
                  </div>
                </div>

                <div className="mt-3 flex text-[var(--yellow)] text-sm">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <span key={i}>★</span>
                  ))}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-gray-600 italic">
                  &ldquo;{item.comment}&rdquo;
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Accordion Section */}
      <section className="py-20 px-6 md:px-12 mx-auto max-w-4xl">
        <div className="text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Hỏi Đáp Nhanh
          </span>
          <h2 className="text-3xl font-extrabold text-gray-900 mt-2">
            Câu Hỏi Thường Gặp
          </h2>
        </div>

        <div className="mt-10 space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white shadow-sm transition"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-gray-900 hover:text-amber-600 transition"
                >
                  <span>{faq.q}</span>
                  <span className="text-lg font-mono text-gray-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs leading-relaxed text-gray-600 border-t border-gray-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="brand-dark border-t border-black/10 bg-[var(--deep-navy)] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <Image src="/logoShop.png" alt="CaseUp" width={36} height={36} />
              </div>
              <span className="text-xl font-extrabold tracking-tight">CaseUp</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              Bao laptop, iPad / Tablet handmade cùng phụ kiện và thêu tên. Chọn màu vải, phối cúc/nút, tạo dấu ấn riêng.
            </p>
            <p className="mt-4 text-xs text-[var(--yellow)] font-semibold">
              {returningCustomerOffer.title}
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Sản phẩm</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/products" className="hover:text-[var(--primary)] transition">Tất cả sản phẩm ({products.length} mẫu)</Link></li>
              <li><Link href="/products" className="hover:text-[var(--primary)] transition">{products[1].name}</Link></li>
              <li><Link href="/products" className="hover:text-[var(--primary)] transition">{products[2].name}</Link></li>
              <li><Link href="/products" className="hover:text-[var(--primary)] transition">{products[3].name}</Link></li>
              <li><Link href="/products" className="hover:text-[var(--primary)] transition">{products[4].name}</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/size-guide" className="hover:text-[var(--primary)] transition">Công cụ chọn size 2.0</Link></li>
              <li><Link href="/cart" className="hover:text-[var(--primary)] transition">Giỏ hàng & Đặt hàng COD</Link></li>
              <li>
                <button
                  type="button"
                  onClick={() => setIsReturnPolicyOpen(true)}
                  className="hover:text-[var(--primary)] transition text-left"
                >
                  Chính sách đổi trả (3 ngày)
                </button>
              </li>
              <li><Link href="/about" className="hover:text-[var(--primary)] transition">Về CaseUp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>📍 {contact.location}</li>
              <li>📞 Hotline: <a href={contact.phoneHref} className="hover:text-white">{contact.phone}</a></li>
              <li>✉️ Email: <a href={`mailto:${contact.email}`} className="hover:text-white">{contact.email}</a></li>
              <li>🕐 Hỗ trợ: {contact.supportHours}</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 py-6 text-center text-xs text-gray-500">
          <p>© 2026 CaseUp. All rights reserved. Trải nghiệm mua sắm nâng tầm cùng AI.</p>
        </div>
      </footer>

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      {/* Return Policy Modal */}
      <ReturnPolicyModal
        isOpen={isReturnPolicyOpen}
        onClose={() => setIsReturnPolicyOpen(false)}
      />

      <ChatBox />
      <PromotionPopup campaign={homepagePromotionPolicy} />
    </main>
  );
}
