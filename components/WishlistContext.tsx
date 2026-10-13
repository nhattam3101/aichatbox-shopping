"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import type { Product } from "@/data/products";

type WishlistContextType = {
  wishlist: Product[];
  toggleWishlist: (product: Product) => void;
  isInWishlist: (id: number) => boolean;
  removeFromWishlist: (id: number) => void;
  clearWishlist: () => void;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  wishlistCount: number;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlist, setWishlist] = useState<Product[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("caseup_wishlist");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem("caseup_wishlist", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  function toggleWishlist(product: Product) {
    setWishlist((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        return prev.filter((item) => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  }

  function isInWishlist(id: number) {
    return wishlist.some((item) => item.id === id);
  }

  function removeFromWishlist(id: number) {
    setWishlist((prev) => prev.filter((item) => item.id !== id));
  }

  function clearWishlist() {
    setWishlist([]);
  }

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        toggleWishlist,
        isInWishlist,
        removeFromWishlist,
        clearWishlist,
        isWishlistOpen,
        setIsWishlistOpen,
        wishlistCount: wishlist.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
