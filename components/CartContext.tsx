"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import CartToast from "@/components/CartToast";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  selectedColor?: string;
};

export type ToastNotification = {
  id: string;
  product: {
    id: number;
    name: string;
    price: number;
    image: string;
    size: string;
    quantity: number;
    selectedColor?: string;
  };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    showToast?: boolean
  ) => void;
  removeFromCart: (id: number, selectedColor?: string) => void;
  increaseQuantity: (id: number, selectedColor?: string) => void;
  decreaseQuantity: (id: number, selectedColor?: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
  toast: ToastNotification | null;
  hideToast: () => void;
  appliedCoupon: string | null;
  discountAmount: number;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("cart");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  function hideToast() {
    setToast(null);
  }

  function addToCart(
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    showToast = true
  ) {
    const qtyToAdd = item.quantity && item.quantity > 0 ? item.quantity : 1;

    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) =>
          cartItem.id === item.id && cartItem.selectedColor === item.selectedColor
      );

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.selectedColor === item.selectedColor
            ? {
                ...cartItem,
                quantity: cartItem.quantity + qtyToAdd,
              }
            : cartItem
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: qtyToAdd,
        },
      ];
    });

    if (showToast) {
      setToast({
        id: Date.now().toString(),
        product: {
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          size: item.size,
          quantity: qtyToAdd,
          selectedColor: item.selectedColor,
        },
      });
    }
  }

  function removeFromCart(id: number, selectedColor?: string) {
    setCart((prev) =>
      prev.filter((item) =>
        selectedColor !== undefined
          ? !(item.id === id && item.selectedColor === selectedColor)
          : item.id !== id
      )
    );
  }

  function increaseQuantity(id: number, selectedColor?: string) {
    setCart((prev) =>
      prev.map((item) => {
        const matches =
          selectedColor !== undefined
            ? item.id === id && item.selectedColor === selectedColor
            : item.id === id;

        return matches
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item;
      })
    );
  }

  function decreaseQuantity(id: number, selectedColor?: string) {
    setCart((prev) =>
      prev
        .map((item) => {
          const matches =
            selectedColor !== undefined
              ? item.id === id && item.selectedColor === selectedColor
              : item.id === id;

          return matches
            ? {
                ...item,
                quantity: item.quantity - 1,
              }
            : item;
        })
        .filter((item) => item.quantity > 0)
    );
  }

  function clearCart() {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountPercent(0);
    try {
      localStorage.removeItem("cart");
    } catch {
      // ignore
    }
  }

  function applyCoupon(code: string): { success: boolean; message: string } {
    const formatted = code.trim().toUpperCase();
    if (formatted === "CASEUP10") {
      setAppliedCoupon("CASEUP10");
      setDiscountPercent(0.1); // 10%
      return { success: true, message: "Đã áp dụng mã giảm giá 10%!" };
    }
    if (formatted === "VIP20") {
      setAppliedCoupon("VIP20");
      setDiscountPercent(0.2); // 20%
      return { success: true, message: "Đã áp dụng mã VIP giảm 20%!" };
    }
    if (formatted === "FREESHIP") {
      setAppliedCoupon("FREESHIP");
      setDiscountPercent(0); // freeship
      return { success: true, message: "Đã áp dụng miễn phí vận chuyển!" };
    }
    return { success: false, message: "Mã giảm giá không hợp lệ hoặc đã hết hạn." };
  }

  function removeCoupon() {
    setAppliedCoupon(null);
    setDiscountPercent(0);
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const rawTotalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const discountAmount = Math.round(rawTotalPrice * discountPercent);
  const totalPrice = Math.max(0, rawTotalPrice - discountAmount);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        totalItems,
        totalPrice,
        toast,
        hideToast,
        appliedCoupon,
        discountAmount,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
      {toast && <CartToast notification={toast} onClose={hideToast} />}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used inside CartProvider");
  }

  return context;
}
