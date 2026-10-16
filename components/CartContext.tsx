"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { allProducts } from "@/data/products";
import { normalizeButton, sameCartVariant } from "@/data/customization";
import CartToast from "@/components/CartToast";

export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  selectedColor?: string;
  selectedButton?: string;
  embroidery?: boolean;
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
  selectedButton?: string;
  embroidery?: boolean;
  };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    showToast?: boolean
  ) => void;
  removeFromCart: (id: number, selectedColor?: string, selectedButton?: string, embroidery?: boolean) => void;
  increaseQuantity: (id: number, selectedColor?: string, selectedButton?: string, embroidery?: boolean) => void;
  decreaseQuantity: (id: number, selectedColor?: string, selectedButton?: string, embroidery?: boolean) => void;
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
  const [cart, setCart] = useState<CartItem[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const readSaved = (): CartItem[] => {
    try {
      const saved = localStorage.getItem("cart");
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (!Array.isArray(parsed)) return [];
      return parsed.flatMap(item => {
        const product = allProducts.find(p => p.id === item?.id);
        if (!product || product.priceConfirmed === false || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) return [];
        return [{ id: product.id, name: product.name, price: product.price, image: product.image, size: product.size, quantity: item.quantity, selectedColor: product.colors.includes(item.selectedColor) ? item.selectedColor : product.colors[0] ?? "", selectedButton: normalizeButton(product, item.selectedButton), embroidery: product.supportsEmbroidery === true && item.embroidery === true }];
      });
    } catch {
      return [];
    }
      };
      setCart(readSaved());
      setStorageReady(true);
    });
    return () => { active = false; };
  }, []);

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Sync cart to localStorage whenever cart changes
  useEffect(() => {
    try {
      if (!storageReady) return;
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, storageReady]);

  function hideToast() {
    setToast(null);
  }

  function addToCart(
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    showToast = true
  ) {
    const product = allProducts.find(p => p.id === item.id);
    if (!product) return;
    if (product.priceConfirmed === false) { alert("Giá size này đang chờ xác nhận. Vui lòng liên hệ trước khi mua."); return; }
    item = { ...item, name: product.name, price: product.price, image: product.image, size: product.size, selectedColor: product.colors.includes(item.selectedColor ?? "") ? item.selectedColor : product.colors[0] ?? "", selectedButton: normalizeButton(product, item.selectedButton), embroidery: product.supportsEmbroidery === true && item.embroidery === true };
    const qtyToAdd = Number.isSafeInteger(item.quantity) && item.quantity! > 0 ? item.quantity! : 1;

    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) =>
          sameCartVariant(cartItem, item)
      );

      if (existingItem) {
        return prev.map((cartItem) =>
          sameCartVariant(cartItem, item)
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
          selectedButton: item.selectedButton,
          embroidery: item.embroidery,
        },
      });
    }
  }

  function removeFromCart(id: number, selectedColor?: string, selectedButton?: string, embroidery?: boolean) {
    setCart((prev) =>
      prev.filter((item) =>
        !(sameCartVariant(item, { id, selectedColor, selectedButton, embroidery }))
      )
    );
  }

  function increaseQuantity(id: number, selectedColor?: string, selectedButton?: string, embroidery?: boolean) {
    setCart((prev) =>
      prev.map((item) => {
        const matches =
          sameCartVariant(item, { id, selectedColor, selectedButton, embroidery });

        return matches
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item;
      })
    );
  }

  function decreaseQuantity(id: number, selectedColor?: string, selectedButton?: string, embroidery?: boolean) {
    setCart((prev) =>
      prev
        .map((item) => {
          const matches =
            sameCartVariant(item, { id, selectedColor, selectedButton, embroidery });

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
