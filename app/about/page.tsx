import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#1f1f1f]">
      <Navbar />

      <section className="px-10 py-20 md:px-20">
        <div className="max-w-4xl">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            About SleeveAI
          </p>

          <h1 className="mt-3 text-5xl font-bold leading-tight">
            Chọn bao laptop dễ hơn
            <br />
            với sự hỗ trợ của AI.
          </h1>

          <p className="mt-8 text-lg leading-8 text-gray-600">
            SleeveAI là website demo bán bao laptop tích hợp AI tư vấn. Hệ thống
            hỗ trợ khách hàng lựa chọn sản phẩm dựa trên kích thước laptop, màu
            sắc, nhu cầu sử dụng và ngân sách.
          </p>

          <p className="mt-5 text-lg leading-8 text-gray-600">
            Mục tiêu của SleeveAI là mô phỏng cách AI có thể hỗ trợ hoạt động
            bán hàng trực tuyến bằng cách giảm thời gian tìm kiếm sản phẩm và
            đưa ra gợi ý phù hợp hơn với nhu cầu khách hàng.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6">
              <h2 className="text-xl font-semibold">Tư vấn size</h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Nhập kích thước laptop để tìm bao phù hợp.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6">
              <h2 className="text-xl font-semibold">AI Assistant</h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Chat với AI để nhận tư vấn sản phẩm theo nhu cầu.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6">
              <h2 className="text-xl font-semibold">Shopping Cart</h2>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Thêm sản phẩm và mô phỏng quy trình mua hàng.
              </p>
            </div>
          </div>

          <Link
            href="/products"
            className="mt-12 inline-block rounded-full bg-black px-6 py-3 text-white"
          >
            Khám phá sản phẩm
          </Link>
        </div>
      </section>
    </main>
  );
}
