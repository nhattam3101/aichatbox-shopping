"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { evaluateVoucher } from "@/data/vouchers";
import { customMadeProduct } from "@/data/products";
import { validateCustomDimensions } from "@/data/size-validation";
import { allProducts } from "@/data/products";
import { normalizeButton, sameCartVariant } from "@/data/customization";
import type { CustomDimensions } from "@/data/size-validation";
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
  embroideryText?: string;
  sizeMode?: "standard" | "custom";
  customDimensions?: CustomDimensions;
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
    embroideryText?: string;
    sizeMode?: "standard" | "custom";
    customDimensions?: CustomDimensions;
  };
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (
    item: Omit<CartItem, "quantity"> & { quantity?: number },
    showToast?: boolean
  ) => void;
  removeFromCart: (
    id: number,
    selectedColor?: string,
    selectedButton?: string,
    embroidery?: boolean,
    sizeMode?: "standard" | "custom",
    customDimensions?: CustomDimensions,
    embroideryText?: string
  ) => void;
  increaseQuantity: (
    id: number,
    selectedColor?: string,
    selectedButton?: string,
    embroidery?: boolean,
    sizeMode?: "standard" | "custom",
    customDimensions?: CustomDimensions,
    embroideryText?: string
  ) => void;
  decreaseQuantity: (
    id: number,
    selectedColor?: string,
    selectedButton?: string,
    embroidery?: boolean,
    sizeMode?: "standard" | "custom",
    customDimensions?: CustomDimensions,
    embroideryText?: string
  ) => void;
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
            const source = allProducts.find(p => p.id === item?.id);
            const product = source?.kind === "sleeve" && item.sizeMode === "custom" ? customMadeProduct : source;
            if (!product || product.priceConfirmed === false || !Number.isSafeInteger(item.quantity) || item.quantity <= 0) return [];

            const isCustom = product.kind === "sleeve" &&
              item.sizeMode === "custom" &&
              item.customDimensions &&
              typeof item.customDimensions.lengthCm === "number" &&
              typeof item.customDimensions.widthCm === "number" &&
              typeof item.customDimensions.thicknessCm === "number";

            if (product.madeToMeasure && (!isCustom || !validateCustomDimensions(String(item.customDimensions?.lengthCm ?? ""), String(item.customDimensions?.widthCm ?? ""), String(item.customDimensions?.thicknessCm ?? "")).isValid)) return [];
            return [{
              id: product.id,
              name: product.name,
              price: product.price,
              image: product.image,
              size: product.size,
              quantity: item.quantity,
              selectedColor: product.colors.includes(item.selectedColor) ? item.selectedColor : product.colors[0] ?? "",
              selectedButton: normalizeButton(product, item.selectedButton),
              embroidery: product.supportsEmbroidery === true && item.embroidery === true,
              embroideryText: product.supportsEmbroidery && item.embroidery && typeof item.embroideryText === "string" ? item.embroideryText.trim().slice(0, 15) : undefined,
              sizeMode: isCustom ? "custom" : "standard",
              customDimensions: isCustom ? {
                lengthCm: Number(item.customDimensions.lengthCm),
                widthCm: Number(item.customDimensions.widthCm),
                thicknessCm: Number(item.customDimensions.thicknessCm),
              } : undefined,
            }];
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
    const source = allProducts.find(p => p.id === item.id);
    const product = source?.kind === "sleeve" && item.sizeMode === "custom" ? customMadeProduct : source;
    if (!product) return;
    if (product.priceConfirmed === false) {
      alert("Giá size này đang chờ xác nhận. Vui lòng liên hệ trước khi mua.");
      return;
    }

    const isCustom = product.kind === "sleeve" &&
      item.sizeMode === "custom" &&
      item.customDimensions &&
      typeof item.customDimensions.lengthCm === "number" &&
      typeof item.customDimensions.widthCm === "number" &&
      typeof item.customDimensions.thicknessCm === "number";

    if (product.madeToMeasure && (!isCustom || !validateCustomDimensions(String(item.customDimensions?.lengthCm ?? ""), String(item.customDimensions?.widthCm ?? ""), String(item.customDimensions?.thicknessCm ?? "")).isValid)) { alert("Vui lòng nhập đủ ba kích thước hợp lệ cho sản phẩm may theo số đo."); return; }
    item = {
      ...item,
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      size: product.size,
      selectedColor: product.colors.includes(item.selectedColor ?? "") ? item.selectedColor : product.colors[0] ?? "",
      selectedButton: normalizeButton(product, item.selectedButton),
      embroidery: product.supportsEmbroidery === true && item.embroidery === true,
      embroideryText: product.supportsEmbroidery && item.embroidery && typeof item.embroideryText === "string" ? item.embroideryText.trim().slice(0, 15) : undefined,
      sizeMode: isCustom ? "custom" : "standard",
      customDimensions: isCustom ? item.customDimensions : undefined,
    };
    const qtyToAdd = Number.isSafeInteger(item.quantity) && item.quantity! > 0 ? item.quantity! : 1;

    setCart((prev) => {
      const existingItem = prev.find(
        (cartItem) => sameCartVariant(cartItem, item)
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
          embroideryText: item.embroideryText,
          sizeMode: item.sizeMode,
          customDimensions: item.customDimensions,
        },
      });
    }
  }

  function removeFromCart(
    id: number,
    selectedColor?: string,
    selectedButton?: string,
    embroidery?: boolean,
    sizeMode?: "standard" | "custom",
    customDimensions?: CustomDimensions,
    embroideryText?: string
  ) {
    setCart((prev) =>
      prev.filter((item) =>
        !sameCartVariant(item, { id, selectedColor, selectedButton, embroidery, embroideryText, sizeMode, customDimensions })
      )
    );
  }

  function increaseQuantity(
    id: number,
    selectedColor?: string,
    selectedButton?: string,
    embroidery?: boolean,
    sizeMode?: "standard" | "custom",
    customDimensions?: CustomDimensions,
    embroideryText?: string
  ) {
    setCart((prev) =>
      prev.map((item) => {
        const matches = sameCartVariant(item, { id, selectedColor, selectedButton, embroidery, embroideryText, sizeMode, customDimensions });

        return matches
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item;
      })
    );
  }

  function decreaseQuantity(
    id: number,
    selectedColor?: string,
    selectedButton?: string,
    embroidery?: boolean,
    sizeMode?: "standard" | "custom",
    customDimensions?: CustomDimensions,
    embroideryText?: string
  ) {
    setCart((prev) =>
      prev
        .map((item) => {
          const matches = sameCartVariant(item, { id, selectedColor, selectedButton, embroidery, embroideryText, sizeMode, customDimensions });

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
    try {
      localStorage.removeItem("cart");
    } catch {
      // ignore
    }
  }

  function applyCoupon(code: string): { success: boolean; message: string } {
    const result = evaluateVoucher(code, cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
    if (result.success) { setAppliedCoupon(result.code); }
    return result;
  }

  function removeCoupon() {
    setAppliedCoupon(null);
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const rawTotalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const activeVoucher = evaluateVoucher(appliedCoupon ?? "", rawTotalPrice);
  const discountAmount = activeVoucher.success ? Math.round(rawTotalPrice * activeVoucher.discountPercent) : 0;
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
        appliedCoupon: activeVoucher.success ? appliedCoupon : null,
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
