import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products } from "@/data/products";
import AddToCartButton from "@/components/AddToCartButton";
import Navbar from "@/components/Navbar";

export const dynamic = "force-dynamic";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;

  const product = products.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#f7f5f2] text-[#1f1f1f]">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-black/10 bg-white px-10 py-6">
        <Link href="/" className="text-2xl font-bold tracking-wide">
          SleeveAI
        </Link>

        <nav className="flex gap-8 text-sm font-medium">
          <Link href="/">Trang chủ</Link>
          <Link href="/products">Sản phẩm</Link>
          <Link href="/size-guide">Hướng dẫn chọn size</Link>
          <Link href="/about">Về chúng tôi</Link>
          <Link href="/cart">Giỏ hàng</Link>
        </nav>
      </header>

      <section className="grid gap-12 px-10 py-16 md:grid-cols-2 md:px-20">
        {/* Image */}
        <div className="relative min-h-[500px] overflow-hidden rounded-3xl bg-[#eeeae5]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500">
            {product.size}
          </p>

          <h1 className="mt-3 text-4xl font-bold">{product.name}</h1>

          <p className="mt-5 text-2xl font-semibold">
            {product.price.toLocaleString("vi-VN")}đ
          </p>

          <p className="mt-6 leading-7 text-gray-600">{product.description}</p>

          <div className="mt-8 space-y-4">
            <div>
              <p className="font-semibold">Kích thước tối đa</p>

              <p className="mt-1 text-gray-600">
                {product.maxWidth} × {product.maxHeight} cm
              </p>
            </div>

            <div>
              <p className="font-semibold">Màu sắc</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <span
                    key={color}
                    className="rounded-full border border-black/20 bg-white px-4 py-2 text-sm"
                  >
                    {color}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="font-semibold">Phù hợp</p>

              <div className="mt-2 flex flex-wrap gap-2">
                {product.suitableFor.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-black/5 px-4 py-2 text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <AddToCartButton
            product={{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              size: product.size,
            }}
          />

          <Link href="/products" className="mt-5 text-center text-sm underline">
            ← Quay lại sản phẩm
          </Link>
        </div>
      </section>
    </main>
  );
}
