import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { WishlistProvider } from "@/components/WishlistContext";
import { CompareProvider } from "@/components/ProductCompareModal";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CaseUp – Bao Laptop Cao Cấp & AI Tư Vấn Chọn Size Thông Minh",
  description: "Cửa hàng bao laptop hiện đại tích hợp trợ lý AI tư vấn chuẩn kích thước, so sánh thông số và trải nghiệm mua sắm mượt mà.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              {children}
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </body>
    </html>
  );
}
