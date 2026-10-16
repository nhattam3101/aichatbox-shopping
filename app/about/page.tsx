import Navbar from "@/components/Navbar";
import Link from "next/link";
import ChatBox from "@/components/ChatBox";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[var(--brand-cream)] text-[var(--text-primary)]">
      <Navbar />

      <section className="px-6 py-20 md:px-12 lg:px-20">
        <div className="mx-auto max-w-5xl">
          <span className="rounded-full bg-amber-50 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-700">
            Về Thương Hiệu CaseUp
          </span>

          <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight text-gray-900">
            Chiếc bao vừa máy,
            <br />
            <span className="text-[var(--primary-ink)]">
              mang dấu ấn riêng bạn.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg leading-relaxed text-gray-600 max-w-3xl">
            CaseUp ra đời từ một trăn trở rất phổ biến: <strong>&ldquo;Liệu chiếc bao này có vừa khít với laptop của mình không?&rdquo;</strong>. Nhiều người đã từng mua phải bao laptop quá chật không kéo nổi khóa, hoặc quá rộng khiến máy bị va đập khi mang đi lại.
          </p>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-gray-600 max-w-3xl">
            CaseUp là shop handmade với bao laptop, bao iPad / Tablet, móc khóa và dịch vụ thêu tên. Bạn có thể phối màu vải, chọn mẫu cúc/nút và dùng công cụ chọn size cùng trợ lý AI để tìm chiếc bao phù hợp.
          </p>

          {/* Core Values 3 Columns */}
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl mb-4">
                📏
              </div>
              <h2 className="text-xl font-bold text-gray-900">Đo Size Chuẩn Xác</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-500">
                Công cụ tính dung sai thông minh tính toán chi tiết độ ôm sát, tự động đối chiếu với hơn 200 model laptop thịnh hành.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl mb-4">
                🤖
              </div>
              <h2 className="text-xl font-bold text-gray-900">AI Tư Vấn 24/7</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-500">
                Trợ lý AI thấu hiểu nhu cầu: từ chống sốc gaming, doanh nhân sang trọng đến màu pastel thời trang nữ tính.
              </p>
            </div>

            <div className="rounded-3xl border border-[var(--brand-border)] bg-white p-8 shadow-sm hover:shadow-md transition">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-2xl mb-4">
                🛡️
              </div>
              <h2 className="text-xl font-bold text-gray-900">Chính Sách Uy Tín</h2>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-gray-500">
                100% khách hàng được kiểm tra hàng trước khi thanh toán COD. Hỗ trợ đổi size miễn phí tận nhà trong 3 ngày.
              </p>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="brand-dark mt-12 rounded-3xl bg-[var(--deep-navy)] p-8 md:p-12 text-white shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[var(--yellow)]">24+</p>
                <p className="text-xs text-gray-400 mt-1">Mẫu thiết kế cao cấp</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[var(--yellow)]">2,400+</p>
                <p className="text-xs text-gray-400 mt-1">Khách hàng tin tưởng</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[var(--yellow)]">99.8%</p>
                <p className="text-xs text-gray-400 mt-1">Tỉ lệ vừa vặn máy</p>
              </div>
              <div>
                <p className="text-3xl md:text-4xl font-extrabold text-[var(--yellow)]">4.9/5</p>
                <p className="text-xs text-gray-400 mt-1">Điểm đánh giá trung bình</p>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4 items-center">
            <Link
              href="/products"
              className="rounded-full bg-[var(--primary)] px-8 py-4 text-sm font-bold text-[var(--on-primary)] shadow-md hover:bg-[var(--brand-primary-hover)] transition"
            >
              Khám phá sản phẩm ngay →
            </Link>
            <Link
              href="/size-guide"
              className="rounded-full border border-gray-300 bg-white px-7 py-4 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition"
            >
              Thử công cụ đo size
            </Link>
          </div>
        </div>
      </section>

      <ChatBox />
    </main>
  );
}
