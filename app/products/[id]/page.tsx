import { notFound } from "next/navigation";
import { products } from "@/data/products";
import ProductDetailClient from "@/components/ProductDetailClient";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id.toString(),
  }));
}

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

  // Find related products (same size or similar price range)
  const relatedProducts = products
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.size === product.size ||
          (p.price >= product.price * 0.8 && p.price <= product.price * 1.2))
    )
    .slice(0, 4);

  return (
    <ProductDetailClient
      product={product}
      relatedProducts={relatedProducts}
    />
  );
}
