"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { allProducts, type Product } from "@/data/products";

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
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [storageReady, setStorageReady] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const readSaved = (): Product[] => {
    try {
      const saved = localStorage.getItem("caseup_wishlist");
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      return Array.isArray(parsed) ? allProducts.filter(p => parsed.some(item => item?.id === p.id)) : [];
    } catch {
      return [];
    }
      };
      setWishlist(readSaved());
      setStorageReady(true);
    });
    return () => { active = false; };
  }, []);

  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  useEffect(() => {
    try {
      if (!storageReady) return;
      localStorage.setItem("caseup_wishlist", JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist, storageReady]);

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
