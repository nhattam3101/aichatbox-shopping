import Link from "next/link";
import Image from "next/image";
import { products } from "@/data/products";
import ChatBox from "@/components/ChatBox";
import Navbar from "@/components/Navbar";
import OpenChatButton from "@/components/OpenChatButton";

export default function Home() {
  const bestSellers = products.filter((p) => p.badge === "Bán chạy" || p.badge === "Hot" || p.badge === "Top 1");
  const newArrivals = products.filter((p) => p.badge === "Mới" || p.badge === "Premium");
  const onSale = products.filter((p) => p.badge === "Giảm giá");

  return (
    <main className="min-h-screen bg-[#fafaf8] text-[#1a1a1a]">
      <Navbar />

      {/* Announcement Marquee */}
      <div className="overflow-hidden bg-[#1a1a1a] py-2">
        <div className="animate-marquee flex whitespace-nowrap">
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="mx-8 text-sm text-white/80">
              🎉 Miễn phí vận chuyển đơn từ 300K &nbsp;•&nbsp; 🔄 Đổi trả 7 ngày &nbsp;•&nbsp; 🤖 AI tư vấn chọn size 24/7 &nbsp;•&nbsp; ⭐ 4.9/5 đánh giá từ khách hàng &nbsp;•&nbsp; 📦 Giao hàng toàn quốc 2-3 ngày &nbsp;•&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Hero Section — Modern Split */}
      <section className="relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute -right-40 -top-40 h-[500px] w-[500px] rounded-full bg-amber-200/20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 h-[300px] w-[300px] rounded-full bg-orange-200/20 blur-3xl"></div>

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-12 lg:py-28">
          <div className="relative z-10">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-500 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
              </span>
              AI tư vấn — Tính năng độc quyền
            </div>

            <h1 className="text-[2.75rem] font-extrabold leading-[1.1] tracking-tight md:text-6xl lg:text-7xl">
              Bao laptop
              <br />
              <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-red-400 bg-clip-text text-transparent">
                đẳng cấp.
              </span>
            </h1>

            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-500">
              CaseUp giúp bạn tìm đúng bao laptop phù hợp kích thước, phong cách
              và ngân sách — chỉ với vài click.
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href="/products"
                className="group inline-flex items-center gap-2 rounded-full bg-[#1a1a1a] px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl"
              >
                Khám phá ngay
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <OpenChatButton />
            </div>

            {/* Social proof */}
            <div className="mt-12 flex items-center gap-6">
              <div className="flex -space-x-3">
                {["MA", "HL", "TH", "KL", "VN"].map((initials, i) => (
                  <div
                    key={initials}
                    className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-white text-xs font-bold text-white"
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
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">2,400+</span> khách hàng hài lòng
                </p>
              </div>
            </div>
          </div>

          {/* Hero Images Grid */}
          <div className="relative grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="relative h-52 overflow-hidden rounded-2xl shadow-lg">
                <Image src="/products/bao1.jpg" alt="CaseUp" fill className="object-cover" sizes="25vw" priority />
              </div>
              <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg">
                <Image src="/products/bao5.jpg" alt="CaseUp" fill className="object-cover" sizes="25vw" />
              </div>
            </div>
            <div className="mt-8 space-y-4">
              <div className="relative h-64 overflow-hidden rounded-2xl shadow-lg">
                <Image src="/products/bao7.png" alt="CaseUp" fill className="object-cover" sizes="25vw" />
              </div>
              <div className="relative h-52 overflow-hidden rounded-2xl shadow-lg">
                <Image src="/products/bao3.jpg" alt="CaseUp" fill className="object-cover" sizes="25vw" />
              </div>
            </div>

            {/* Floating price card */}
            <div className="absolute -bottom-6 left-1/2 z-10 -translate-x-1/2 rounded-2xl border border-black/5 bg-white px-6 py-4 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50">
                  <span className="text-2xl">💼</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Giá chỉ từ</p>
                  <p className="text-xl font-bold text-amber-600">159.000đ</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-y border-black/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-black/5 md:grid-cols-4">
          {[
            { icon: "🚚", title: "Miễn phí ship", desc: "Đơn từ 300K" },
            { icon: "🔄", title: "Đổi trả 7 ngày", desc: "Không lý do" },
            { icon: "🤖", title: "AI tư vấn 24/7", desc: "Chọn size chuẩn" },
            { icon: "✅", title: "Chính hãng", desc: "Cam kết chất lượng" },
          ].map((item) => (
            <div key={item.title} className="flex items-center justify-center gap-3 px-6 py-6">
              <span className="text-2xl">{item.icon}</span>
              <div>
                <p className="text-sm font-semibold">{item.title}</p>
                <p className="text-xs text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-12">
        <div className="flex items-end justify-between">
          <div>
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-600">
              Danh mục
            </span>
            <h2 className="mt-2 text-3xl font-bold">Chọn theo size laptop</h2>
          </div>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { size: "13\"", count: products.filter(p => p.size === "13 inch").length, label: "MacBook Air, Dell XPS", img: "/products/bao1.jpg", gradient: "from-blue-500/10 to-blue-600/5" },
            { size: "14\"", count: products.filter(p => p.size === "14 inch").length, label: "ThinkPad, HP, ASUS", img: "/products/bao2.jpg", gradient: "from-emerald-500/10 to-emerald-600/5" },
            { size: "15.6\"", count: products.filter(p => p.size === "15.6 inch").length, label: "Laptop phổ thông", img: "/products/bao3.jpg", gradient: "from-violet-500/10 to-violet-600/5" },
            { size: "16\"", count: products.filter(p => p.size === "16 inch").length, label: "MacBook Pro, Gaming", img: "/products/bao4.jpg", gradient: "from-orange-500/10 to-orange-600/5" },
          ].map((cat) => (
            <Link
              key={cat.size}
              href="/products"
              className={`group relative flex flex-col overflow-hidden rounded-2xl bg-gradient-to-br ${cat.gradient} p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="relative mb-4 h-32 overflow-hidden rounded-xl">
                <Image src={cat.img} alt={cat.size} fill className="object-cover transition-transform duration-500 group-hover:scale-110" sizes="25vw" />
              </div>
              <h3 className="text-2xl font-bold">{cat.size}</h3>
              <p className="mt-1 text-sm text-gray-500">{cat.label}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="rounded-full bg-white/80 px-3 py-1 text-xs font-medium">{cat.count} sản phẩm</span>
                <svg className="h-5 w-5 text-gray-400 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Best Sellers */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-red-500">
                🔥 Bán chạy
              </span>
              <h2 className="mt-2 text-3xl font-bold">Sản phẩm bán chạy nhất</h2>
            </div>
            <Link href="/products" className="group hidden items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-amber-600 md:flex">
              Xem tất cả
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, 4).map((product, i) => (
              <ProductCard key={product.id} product={product} eager={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* AI Banner */}
      <section className="mx-auto max-w-7xl px-6 py-6 md:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1a1a1a] via-[#2d2d2d] to-[#1a1a1a]">
          {/* Glow effects */}
          <div className="absolute -right-20 top-10 h-60 w-60 rounded-full bg-amber-500/20 blur-[100px]"></div>
          <div className="absolute -left-10 bottom-10 h-40 w-40 rounded-full bg-orange-500/15 blur-[80px]"></div>

          <div className="relative grid items-center gap-10 p-10 md:grid-cols-2 md:p-16">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-amber-300 backdrop-blur-sm">
                <span className="text-base">🤖</span>
                Powered by AI
              </div>
              <h2 className="mt-6 text-3xl font-bold leading-tight text-white md:text-4xl">
                Không biết chọn size?
                <br />
                <span className="text-amber-400">Để AI giúp bạn.</span>
              </h2>
              <p className="mt-4 max-w-md text-gray-400">
                Chỉ cần nhập tên laptop, AI sẽ tự động gợi ý sản phẩm phù hợp nhất
                về kích thước, màu sắc và phong cách.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <OpenChatButton />
                <Link href="/size-guide" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-6 py-3 text-sm font-medium text-white transition-all hover:bg-white/10">
                  Hướng dẫn chọn size
                </Link>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-sm">
                {/* Chat mockup */}
                <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
                  <div className="space-y-4">
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-br-md bg-amber-500 px-4 py-2.5 text-sm text-white">
                        Laptop Dell XPS 13, nên mua bao nào?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm text-gray-200">
                        Dell XPS 13 có kích thước 29.5 × 19.8 cm. Mình gợi ý <strong className="text-amber-300">Minimal Sleeve 13</strong> — vừa khít và nhẹ nhất! 🎯
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="rounded-2xl rounded-br-md bg-amber-500 px-4 py-2.5 text-sm text-white">
                        Có màu beige không?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="rounded-2xl rounded-bl-md bg-white/10 px-4 py-2.5 text-sm text-gray-200">
                        Có luôn! Minimal Sleeve 13 có 3 màu: Đen, <strong className="text-amber-300">Beige</strong>, Xám ✨
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-semibold uppercase tracking-[0.15em] text-emerald-600">
                ✨ Hàng mới
              </span>
              <h2 className="mt-2 text-3xl font-bold">Sản phẩm mới & Premium</h2>
            </div>
            <Link href="/products" className="group hidden items-center gap-1 text-sm font-medium text-gray-500 transition-colors hover:text-amber-600 md:flex">
              Xem tất cả
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Sale Banner */}
      {onSale.length > 0 && (
        <section className="bg-gradient-to-r from-red-50 via-orange-50 to-amber-50 py-20">
          <div className="mx-auto max-w-7xl px-6 md:px-12">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-sm font-semibold uppercase tracking-[0.15em] text-red-500">
                  🏷️ Flash Sale
                </span>
                <h2 className="mt-2 text-3xl font-bold">Đang giảm giá</h2>
              </div>
            </div>

            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {onSale.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {/* Fill remaining with other products */}
              {products.filter(p => !p.badge?.includes("Giảm")).slice(0, 4 - onSale.length).map((product) => (
                <ProductCard key={`fill-${product.id}`} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Products Grid */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-600">
              Bộ sưu tập
            </span>
            <h2 className="mt-2 text-3xl font-bold">Tất cả sản phẩm</h2>
            <p className="mx-auto mt-3 max-w-lg text-gray-500">
              Khám phá toàn bộ bộ sưu tập bao laptop CaseUp — từ cơ bản đến cao cấp
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} eager={i < 2} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[#1a1a1a] px-8 py-3.5 text-sm font-semibold transition-all hover:bg-[#1a1a1a] hover:text-white"
            >
              Xem tất cả sản phẩm
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-6 md:px-12">
          <div className="mb-12 text-center">
            <span className="text-sm font-semibold uppercase tracking-[0.15em] text-amber-600">
              Đánh giá
            </span>
            <h2 className="mt-2 text-3xl font-bold">Khách hàng nói gì về CaseUp?</h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                name: "Minh Anh",
                avatar: "MA",
                color: "#f59e0b",
                rating: 5,
                text: "Bao laptop chất lượng tốt, đúng size MacBook Air 13 của mình. AI tư vấn chuẩn luôn! Rất hài lòng.",
                product: "Minimal Sleeve 13",
                date: "2 ngày trước",
              },
              {
                name: "Hoàng Long",
                avatar: "HL",
                color: "#3b82f6",
                rating: 5,
                text: "Mua bao 15.6 inch, vừa khít laptop Dell. Giao hàng nhanh, đóng gói cẩn thận. Sẽ giới thiệu bạn bè.",
                product: "Classic Sleeve 15.6",
                date: "5 ngày trước",
              },
              {
                name: "Thu Hà",
                avatar: "TH",
                color: "#8b5cf6",
                rating: 5,
                text: "Thiết kế đẹp, sang trọng. Dùng AI hỏi tư vấn rất tiện, không cần đo kích thước. Mua thêm tặng bạn!",
                product: "Executive Sleeve 16",
                date: "1 tuần trước",
              },
            ].map((review) => (
              <div
                key={review.name}
                className="rounded-2xl border border-black/5 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white"
                    style={{ background: review.color }}
                  >
                    {review.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{review.name}</p>
                    <p className="text-xs text-gray-400">{review.date}</p>
                  </div>
                  <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: review.rating }).map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{review.text}</p>
                <div className="mt-4 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-400">
                  Đã mua: <span className="font-medium text-gray-600">{review.product}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-7xl px-6 pb-20 md:px-12">
        <div className="rounded-3xl bg-gradient-to-r from-amber-50 to-orange-50 p-10 text-center md:p-16">
          <h2 className="text-3xl font-bold">Đăng ký nhận ưu đãi</h2>
          <p className="mx-auto mt-3 max-w-md text-gray-500">
            Nhận thông tin sản phẩm mới và mã giảm giá độc quyền qua email
          </p>
          <div className="mx-auto mt-8 flex max-w-md gap-3">
            <input
              type="email"
              placeholder="Email của bạn..."
              className="flex-1 rounded-full border border-black/10 bg-white px-6 py-3.5 text-sm outline-none transition-shadow focus:ring-2 focus:ring-amber-300"
            />
            <button className="whitespace-nowrap rounded-full bg-[#1a1a1a] px-8 py-3.5 text-sm font-semibold text-white transition-all hover:bg-gray-800 hover:shadow-lg">
              Đăng ký
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-black/5 bg-[#111] text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 md:px-12">
          <div>
            <div className="flex items-center gap-3">
              <Image src="/logoShop.png" alt="CaseUp" width={36} height={36} className="rounded-full" />
              <span className="text-xl font-bold">CaseUp</span>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-gray-400">
              Cửa hàng bao laptop thông minh với AI tư vấn, giúp bạn chọn đúng sản phẩm phù hợp nhất.
            </p>
            <div className="mt-6 flex gap-3">
              {["Facebook", "Instagram", "TikTok"].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-white/5 text-xs font-medium text-gray-400 transition-all hover:bg-white/10 hover:text-white"
                >
                  {social.slice(0, 2)}
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Sản phẩm</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/products" className="transition-colors hover:text-white">Tất cả sản phẩm</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Bao 13 inch</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Bao 14 inch</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Bao 15-16 inch</Link></li>
              <li><Link href="/products" className="transition-colors hover:text-white">Sale</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Hỗ trợ</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li><Link href="/size-guide" className="transition-colors hover:text-white">Hướng dẫn chọn size</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">Về chúng tôi</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">Chính sách đổi trả</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">Chính sách vận chuyển</Link></li>
              <li><Link href="/about" className="transition-colors hover:text-white">FAQ</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-wider text-gray-400">Liên hệ</h4>
            <ul className="space-y-3 text-sm text-gray-500">
              <li className="flex items-center gap-2">📍 TP. Hồ Chí Minh, Việt Nam</li>
              <li className="flex items-center gap-2">📞 0123 456 789</li>
              <li className="flex items-center gap-2">✉️ hello@caseup.vn</li>
              <li className="flex items-center gap-2">🕐 8:00 - 22:00, T2 - CN</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row md:px-12">
            <p>© 2024 CaseUp. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="transition-colors hover:text-white">Điều khoản</a>
              <a href="#" className="transition-colors hover:text-white">Bảo mật</a>
              <a href="#" className="transition-colors hover:text-white">Cookie</a>
            </div>
          </div>
        </div>
      </footer>

      <ChatBox />
    </main>
  );
}

/* ───── Product Card Component ───── */

function ProductCard({
  product,
  eager = false,
}: {
  product: (typeof products)[number];
  eager?: boolean;
}) {
  const badgeColors: Record<string, string> = {
    "Bán chạy": "bg-red-500 text-white",
    "Hot": "bg-orange-500 text-white",
    "Mới": "bg-emerald-500 text-white",
    "Premium": "bg-[#1a1a1a] text-white",
    "Giảm giá": "bg-red-500 text-white",
    "Top 1": "bg-amber-500 text-white",
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : null;

  return (
    <Link href={`/products/${product.id}`} className="group block">
      <div className="relative h-72 overflow-hidden rounded-2xl bg-[#f0ece7]">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute left-3 top-3 rounded-full px-3 py-1 text-xs font-bold ${badgeColors[product.badge] || "bg-gray-800 text-white"}`}>
            {product.badge}
          </span>
        )}

        {/* Discount */}
        {discount && (
          <span className="absolute right-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-xs font-bold text-white">
            -{discount}%
          </span>
        )}

        {/* Quick view overlay */}
        <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="mb-4 rounded-full bg-white px-5 py-2 text-xs font-semibold text-gray-800 shadow-lg">
            Xem chi tiết
          </span>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold transition-colors group-hover:text-amber-600">
            {product.name}
          </h3>
          <span className="shrink-0 rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-500">
            {product.size}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <p className="text-base font-bold text-amber-600">
            {product.price.toLocaleString("vi-VN")}đ
          </p>
          {product.originalPrice && (
            <p className="text-sm text-gray-400 line-through">
              {product.originalPrice.toLocaleString("vi-VN")}đ
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center gap-3">
          <div className="flex items-center gap-1">
            <svg className="h-3.5 w-3.5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="text-xs font-medium">{product.rating}</span>
          </div>
          <span className="text-xs text-gray-400">Đã bán {product.sold}</span>
        </div>

        {/* Color options */}
        <div className="mt-2 flex flex-wrap gap-1">
          {product.colors.slice(0, 3).map((color) => (
            <span key={color} className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] text-gray-400">
              {color}
            </span>
          ))}
          {product.colors.length > 3 && (
            <span className="rounded-md bg-gray-50 px-2 py-0.5 text-[11px] text-gray-400">
              +{product.colors.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
