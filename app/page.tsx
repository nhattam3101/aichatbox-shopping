import Image from "next/image";
import { products } from "@/data/products";
import ChatBox from "@/components/ChatBox";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#1f1f1f]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-10 py-6">
        <h1 className="text-2xl font-bold tracking-wide">SleeveAI</h1>

        <nav className="flex gap-8 text-sm font-medium">
          <a href="#">Trang chủ</a>
          <a href="#">Sản phẩm</a>
          <a href="#">Về chúng tôi</a>
          <a href="#">Giỏ hàng</a>
        </nav>
      </header>

      {/* Hero */}
      <section className="grid min-h-[520px] items-center gap-10 px-10 md:grid-cols-2 md:px-20">
        <div>
          <p className="mb-4 text-sm uppercase tracking-[0.25em] text-gray-500">
            Laptop Sleeve Store
          </p>

          <h2 className="text-5xl font-bold leading-tight md:text-6xl">
            Chọn bao laptop
            <br />
            phù hợp với bạn.
          </h2>

          <p className="mt-6 max-w-xl text-lg text-gray-600">
            Không chắc laptop của bạn thuộc size nào? AI của SleeveAI sẽ giúp
            bạn chọn đúng kích thước, màu sắc và sản phẩm phù hợp.
          </p>

          <div className="mt-8 flex gap-4">
            <button className="rounded-full bg-black px-6 py-3 text-white">
              Xem sản phẩm
            </button>

            <button className="rounded-full border border-black px-6 py-3">
              Hỏi AI
            </button>
          </div>
        </div>

        <div className="relative h-[380px] overflow-hidden rounded-3xl bg-[#ded8d0]">
          <Image
            src="/products/bao5.jpg"
            alt="Laptop sleeve collection"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Product section */}
      <section className="bg-white px-10 py-16 md:px-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-gray-500">
              Collection
            </p>

            <h2 className="mt-2 text-3xl font-bold">Sản phẩm nổi bật</h2>
          </div>

          <a href="#" className="text-sm underline">
            Xem tất cả
          </a>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product, index) => (
            <ProductCard
              key={product.id}
              name={product.name}
              size={product.size}
              price={`${product.price.toLocaleString("vi-VN")}đ`}
              image={product.image}
              eager={index === 0}
            />
          ))}
        </div>
      </section>

      {/* AI floating button */}
      <ChatBox />
    </main>
  );
}

function ProductCard({
  name,
  size,
  price,
  image,
  eager,
}: {
  name: string;
  size: string;
  price: string;
  image: string;
  eager: boolean;
}) {
  return (
    <div>
      <div className="relative h-72 overflow-hidden rounded-2xl bg-[#eeeae5]">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          loading={eager ? "eager" : "lazy"}
          className="object-cover"
        />
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="mt-1 text-sm text-gray-500">{size}</p>
        <p className="mt-3 font-semibold">{price}</p>
      </div>
    </div>
  );
}
