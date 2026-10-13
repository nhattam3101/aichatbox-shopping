"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { products, type Product } from "@/data/products";
import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import QuickViewModal from "@/components/QuickViewModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"bestseller" | "new" | "leather" | "shockproof" | "pastel">("bestseller");
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const bestSellers = products.filter((p) => p.badge === "Bán chạy" || p.badge === "Hot" || p.badge === "Top 1").slice(0, 8);
  const newArrivals = products.filter((p) => p.badge === "Mới" || p.badge === "Premium").slice(0, 8);
  const leatherCollection = products.filter((p) => p.category === "Da cao cấp").slice(0, 8);
  const shockproofCollection = products.filter((p) => p.category === "Chống sốc").slice(0, 8);
  const pastelCollection = products.filter((p) => p.category === "Thời trang").slice(0, 8);

  const displayedProducts =
    activeTab === "bestseller"
      ? bestSellers
      : activeTab === "new"
      ? newArrivals
      : activeTab === "leather"
      ? leatherCollection
      : activeTab === "shockproof"
      ? shockproofCollection
      : pastelCollection;

  const faqs = [
    {
      q: "Làm thế nào để biết bao laptop có vừa khít với máy của tôi?",
      a: "Bạn có thể dùng công cụ 'Chọn size' thông minh trên thanh menu hoặc bấm vào nút 'AI Tư Vấn'. Chỉ cần nhập tên model máy (như MacBook Air M2, ThinkPad X1, Dell XPS...) hoặc chiều dài x rộng thực tế, hệ thống sẽ tự tính độ ôm sát chuẩn xác 100%.",
    },
    {
      q: "Tôi có được mở hàng kiểm tra trước khi thanh toán không?",
      a: "Chắc chắn! CaseUp hỗ trợ 100% hình thức đồng kiểm khi nhận hàng (COD). Bạn được phép mở bưu phẩm, ướm thử laptop vào bao. Nếu vừa vặn và ưng ý thì mới thanh toán cho bưu tá.",
    },
    {
      q: "Nếu máy không vừa hoặc muốn đổi màu khác thì sao?",
      a: "CaseUp áp dụng chính sách đổi trả miễn phí trong 7 ngày đầu tiên nếu sản phẩm chưa qua sử dụng. Bạn chỉ cần liên hệ qua hotline hoặc chatbox, nhân viên sẽ gửi mẫu mới đến tận nhà đổi cho bạn.",
    },
    {
      q: "Chất liệu của bao CaseUp có chống nước tốt không?",
      a: "Các dòng Chống nước, Da cao cấp Saffiano và Chống sốc 360 đều được phủ lớp kháng nước chuyên dụng và khóa kéo chống thấm, ngăn chặn hoàn toàn tia nước mưa bắn vào làm ướt thiết bị bên trong.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#fafaf8] text-[#1a1a1a] selection:bg-amber-100 selection:text-amber-900">
      <Navbar />

      {/* Announcement Marquee Ticker */}
      <div className="overflow-hidden bg-[#1a1a1a] py-2.5 text-white">
        <div className="animate-marquee flex whitespace-nowrap text-xs font-medium">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="mx-6 flex items-center gap-6 text-white/90">
              <span>🎉 Nhập mã <strong>CASEUP10</strong> giảm ngay 10% đơn đầu tiên</span>
              <span>•</span>
              <span>🚚 Miễn phí vận chuyển toàn quốc đơn từ 300K</span>
              <span>•</span>
              <span>🔄 Đổi trả 7 ngày không cần lý do</span>
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
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Ambient Gradient Glows */}
        <div className="absolute -right-40 -top-40 h-[550px] w-[550px] rounded-full bg-amber-200/30 blur-[120px] pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 h-[450px] w-[450px] rounded-full bg-orange-200/25 blur-[100px] pointer-events-none" />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 md:grid-cols-2 md:px-12 lg:gap-16">
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-amber-300/80 bg-amber-50 px-4 py-2 text-xs font-bold text-amber-800 shadow-sm animate-pulse-subtle">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-amber-600"></span>
              </span>
              <span>Bao Laptop Thế Hệ Mới 2026 • Tích Hợp AI</span>
            </div>

            <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl lg:text-7xl">
              Bảo vệ máy yêu,
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
                chuẩn gu tinh tế.
              </span>
            </h1>

            <p className="max-w-lg text-base md:text-lg leading-relaxed text-gray-600">
              Khám phá bộ sưu tập 24 mẫu bao laptop cao cấp từ da Saffiano, đệm khí CornerArmor đến phong cách pastel Hàn Quốc. Được may đo chuẩn xác cho từng dòng máy.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:bg-black hover:-translate-y-0.5 hover:shadow-2xl"
              >
                <span>Khám phá 24 sản phẩm</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>

              <Link
                href="/size-guide"
                className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white px-7 py-4 text-sm font-bold text-gray-800 shadow-sm transition hover:border-black/30 hover:bg-gray-50"
              >
                <span>📏 Tìm size theo máy</span>
              </Link>
            </div>

            {/* Social Proof */}
            <div className="pt-6 border-t border-black/5 flex items-center gap-5">
              <div className="flex -space-x-3">
                {["ĐH", "TA", "MN", "QT", "LK"].map((initials, i) => (
                  <div
                    key={initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white shadow-sm"
                    style={{
                      background: ["#f59e0b", "#ef4444", "#3b82f6", "#10b981", "#8b5cf6"][i],
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
                    <span key={i} className="text-amber-400 text-sm">★</span>
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
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-56 overflow-hidden rounded-3xl shadow-lg border border-black/5 bg-[#f5f1eb] group">
                  <Image src="/products/bao1.jpg" alt="CaseUp Minimal" fill className="object-cover group-hover:scale-105 transition duration-500" priority />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-800 shadow backdrop-blur-md">
                    Minimal Sleeve 13
                  </span>
                </div>
                <div className="relative h-64 overflow-hidden rounded-3xl shadow-lg border border-black/5 bg-[#f5f1eb] group">
                  <Image src="/products/bao5.jpg" alt="CaseUp Pastel" fill className="object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-800 shadow backdrop-blur-md">
                    Pastel Cloud 13
                  </span>
                </div>
              </div>
              <div className="mt-8 space-y-4">
                <div className="relative h-64 overflow-hidden rounded-3xl shadow-lg border border-black/5 bg-[#f5f1eb] group">
                  <Image src="/products/bao7.png" alt="CaseUp ShockGuard" fill className="object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-800 shadow backdrop-blur-md">
                    ShockGuard 15.6
                  </span>
                </div>
                <div className="relative h-56 overflow-hidden rounded-3xl shadow-lg border border-black/5 bg-[#f5f1eb] group">
                  <Image src="/products/bao4.jpg" alt="CaseUp Saffiano" fill className="object-cover group-hover:scale-105 transition duration-500" />
                  <span className="absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-gray-800 shadow backdrop-blur-md">
                    Saffiano Sleeve 16
                  </span>
                </div>
              </div>
            </div>

            {/* Floating feature pills */}
            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 rounded-full border border-black/10 bg-white/95 px-6 py-3 shadow-2xl backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-50 text-xl">
                🛡️
              </div>
              <div className="text-left">
                <p className="text-[11px] text-gray-400 leading-tight">Chống va đập 360°</p>
                <p className="text-sm font-extrabold text-amber-600">Đệm Khí CornerArmor</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Highlights Strip */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-y md:divide-y-0 divide-black/5 md:grid-cols-4">
          {[
            { icon: "🚚", title: "Freeship Toàn Quốc", desc: "Áp dụng đơn từ 300.000₫" },
            { icon: "🔄", title: "Đổi Trả 7 Ngày", desc: "Không vừa size đổi ngay" },
            { icon: "🤖", title: "AI Tư Vấn Chọn Size", desc: "Hỗ trợ 24/7 trực tuyến" },
            { icon: "💵", title: "Kiểm Tra Nhận COD", desc: "Ưng ý mới thanh toán" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 p-6 hover:bg-[#fafaf8] transition">
              <span className="text-3xl">{item.icon}</span>
              <div>
                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                <p className="text-xs text-gray-400 mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Laptop Size Selector Bar */}
      <section className="py-12 px-6 md:px-12 bg-[#f8f6f2] border-b border-black/5">
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
              className="text-xs font-bold text-amber-700 hover:text-black underline shrink-0"
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
                className="rounded-full border border-black/5 bg-white px-4 py-2 text-xs font-semibold text-gray-700 shadow-sm transition hover:border-black hover:bg-black hover:text-white"
              >
                💻 {name}
              </Link>
            ))}
          </div>
        </div>
      </section>

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
                { id: "leather", label: "💼 Da cao cấp" },
                { id: "shockproof", label: "🛡️ Chống sốc 360" },
                { id: "pastel", label: "🌸 Thời trang Pastel" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`rounded-full px-4 py-2 text-xs font-bold transition-all ${
                    activeTab === tab.id
                      ? "bg-black text-white shadow-md scale-105"
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
              className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-transparent px-8 py-3.5 text-sm font-bold text-black transition-all hover:bg-black hover:text-white"
            >
              Xem tất cả 24 sản phẩm & lọc nâng cao →
            </Link>
          </div>
        </div>
      </section>

      {/* AI Assistant Feature Banner */}
      <section className="mx-auto max-w-7xl px-6 py-12 md:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1c1b18] via-[#2a2723] to-[#121110] p-8 md:p-16 text-white shadow-2xl">
          <div className="absolute -right-20 top-10 h-72 w-72 rounded-full bg-amber-500/20 blur-[120px] pointer-events-none" />
          <div className="grid gap-10 md:grid-cols-2 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold text-amber-300">
                <span>🤖</span> CaseUp Smart AI Advisor
              </div>
              <h2 className="mt-5 text-3xl sm:text-4xl font-extrabold leading-tight">
                Không chắc chắn kích thước?
                <br />
                <span className="text-amber-400">Hỏi ngay trợ lý AI.</span>
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
                  className="rounded-full bg-amber-500 px-6 py-3.5 text-xs sm:text-sm font-bold text-black shadow-lg hover:bg-amber-400 transition"
                >
                  Mở Trợ Lý AI Ngay
                </button>
                <Link
                  href="/size-guide"
                  className="rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs sm:text-sm font-bold text-white hover:bg-white/15 transition"
                >
                  Công cụ đo kích thước
                </Link>
              </div>
            </div>

            {/* AI Mockup Card */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-md space-y-3.5 text-xs">
              <div className="flex justify-end">
                <div className="rounded-2xl rounded-tr-sm bg-amber-500 px-4 py-2.5 text-black font-semibold">
                  Laptop mình là MacBook Pro 14 M3, muốn mẫu da sang trọng đi họp?
                </div>
              </div>
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white/10 px-4 py-3 text-gray-100 space-y-2">
                  <p>
                    Chào bạn! MacBook Pro 14 có kích thước <strong>31.3 × 22.1 cm</strong>.
                  </p>
                  <p>
                    Mình gợi ý mẫu <strong>Heritage Leatherette 14</strong> da sáp vintage hoặc <strong>Daily Sleeve 14 Pro</strong>. Thiết kế nắp khóa từ không làm xước máy và cực kỳ trang nhã khi đi họp! ✨
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section className="bg-white py-20 px-6 md:px-12 border-y border-black/5">
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
                comment: "Màu Pastel Cloud xinh xỉu! Chần bông gợn sóng mềm như gối ôm mà lại có ngăn túi phụ đựng cáp sạc gọn gàng. Giao hàng 2 ngày là nhận được.",
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
              <div key={idx} className="rounded-3xl border border-black/5 bg-[#faf9f6] p-6 shadow-sm hover:shadow-md transition">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white shadow-sm text-xl">
                    {item.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                    <p className="text-[11px] text-gray-400">{item.role} • {item.laptop}</p>
                  </div>
                </div>

                <div className="mt-3 flex text-amber-400 text-sm">
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
                className="overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition"
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
      <footer className="border-t border-black/10 bg-[#141414] text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-16 md:grid-cols-4 md:px-12">
          <div>
            <div className="flex items-center gap-3">
              <div className="overflow-hidden rounded-xl border border-white/10 bg-white/10">
                <Image src="/logoShop.png" alt="CaseUp" width={36} height={36} />
              </div>
              <span className="text-xl font-extrabold tracking-tight">CaseUp</span>
            </div>
            <p className="mt-4 text-xs leading-relaxed text-gray-400">
              Thương hiệu bao laptop thông minh tiên phong ứng dụng AI tư vấn kích thước và phong cách cá nhân hóa.
            </p>
            <p className="mt-4 text-xs text-amber-400 font-semibold">
              Mã voucher chào mừng: <strong>CASEUP10</strong>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Sản phẩm</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/products" className="hover:text-white transition">Tất cả sản phẩm (24 mẫu)</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Bao 13 inch Minimal</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Bao 14 inch Pro</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Bao 15.6 inch ShockGuard</Link></li>
              <li><Link href="/products" className="hover:text-white transition">Bao 16 inch Executive</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Hỗ trợ khách hàng</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link href="/size-guide" className="hover:text-white transition">Công cụ chọn size 2.0</Link></li>
              <li><Link href="/cart" className="hover:text-white transition">Giỏ hàng & Đặt hàng COD</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Chính sách bảo hành & đổi trả</Link></li>
              <li><Link href="/about" className="hover:text-white transition">Về CaseUp</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-xs text-gray-400">
              <li>📍 TP. Hồ Chí Minh & Hà Nội</li>
              <li>📞 Hotline: 0988 123 456</li>
              <li>✉️ Email: support@caseup.vn</li>
              <li>🕐 Hỗ trợ: 8:00 - 22:00 tất cả các ngày</li>
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

      <ChatBox />
    </main>
  );
}
