"use client";

import { useState } from "react";
import { useCart } from "@/components/CartContext";

type Props = {
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity?: number;
    selectedColor?: string;
  };
  className?: string;
};

export default function AddToCartButton({ product, className }: Props) {
  const { addToCart } = useCart();
  const [isJustAdded, setIsJustAdded] = useState(false);

  function handleAddToCart() {
    const enhancedProduct = {
      ...product,
      quantity: product.quantity ?? 1,
      selectedColor: product.selectedColor ?? "",
    };

    addToCart(enhancedProduct);

    setIsJustAdded(true);
    setTimeout(() => {
      setIsJustAdded(false);
    }, 1500);
  }

  return (
    <button
      onClick={handleAddToCart}
      className={
        className ??
        "mt-10 w-full rounded-full bg-black px-6 py-4 font-medium text-white transition hover:bg-gray-800 flex items-center justify-center gap-2"
      }
    >
      {isJustAdded ? (
        <>
          <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-emerald-400">Đã thêm vào giỏ!</span>
        </>
      ) : (
        <>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.646.646.18 1.758.757 1.758h10.714c.577 0 1.401-.311 1.757-.757l2.293-2.293c.646-.646-.18-1.758-.757-1.758H5.063c-.577 0-1.401.311-1.757.757zM12 15l-3-3m0 0l3-3m-3 3h.008v.008H12v-.008z" />
          </svg>
          <span>Thêm vào giỏ hàng</span>
        </>
      )}
    </button>
  );
}
