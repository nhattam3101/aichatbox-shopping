"use client";

import { useCart } from "@/components/CartContext";

type Props = {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
  };
};

export default function AddToCartButton({ product }: Props) {
  const { addToCart } = useCart();

  function handleAddToCart() {
    addToCart(product);

    alert("Đã thêm sản phẩm vào giỏ hàng!");
  }

  return (
    <button
      onClick={handleAddToCart}
      className="mt-10 w-full rounded-full bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800"
    >
      Thêm vào giỏ hàng
    </button>
  );
}
