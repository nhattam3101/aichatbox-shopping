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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Đọc cart từ localStorage khi app load
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");

    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch {
        localStorage.removeItem("cart");
      }
    }

    setIsLoaded(true);
  }, []);

  // Chỉ lưu sau khi đã đọc localStorage xong
  useEffect(() => {
    if (!isLoaded) return;

    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart, isLoaded]);

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
    localStorage.removeItem("cart");
  }

  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  const totalPrice = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

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
