"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { allProducts as products, type Product } from "@/data/products";
import { useCart } from "@/components/CartContext";

type Message = {
  role: "user" | "assistant";
  content: string;
  recommendedProducts?: Product[];
};

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addToCart } = useCart();

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào! Mình là CaseUp Assistant 🤖\n\nMình có thể giúp bạn kiểm tra đủ ba số đo để chọn size, phối màu vải và tìm mẫu bao theo ngân sách.",
    },
  ]);

  const quickPrompts = [
    "💻 MacBook Air M2 nên chọn size nào?",
    "🛡️ Tìm bao chống sốc dày bảo vệ tối đa",
    "💼 Bao laptop may theo kích thước yêu cầu",
    "🌸 Mẫu thời trang màu Pastel nhẹ nhàng",
    "💰 Bao laptop giá rẻ dưới 220k",
  ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "nearest" });
    }
  }, [messages, isLoading, isOpen]);

  // Helper to parse [RECOMMEND:ID] out of text
  function parseResponse(rawText: string): { cleanText: string; recommended: Product[] } {
    const regex = /\[RECOMMEND:(\d+)\]/g;
    const ids: number[] = [];
    let match;

    while ((match = regex.exec(rawText)) !== null) {
      ids.push(parseInt(match[1], 10));
    }

    const cleanText = rawText.replace(regex, "").trim();
    const recommended: Product[] = [];

    ids.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod && !recommended.some((r) => r.id === prod.id)) {
        recommended.push(prod);
      }
    });

    return { cleanText, recommended };
  }

  async function handleSend(customText?: string) {
    const textToSend = customText || message;
    const trimmedMessage = textToSend.trim();

    if (!trimmedMessage || isLoading) {
      return;
    }

    const userMessage: Message = {
      role: "user",
      content: trimmedMessage,
    };

    const updatedMessages: Message[] = [...messages, userMessage];

    setMessages(updatedMessages);
    setMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Không thể kết nối với AI lúc này.");
      }

      const { cleanText, recommended } = parseResponse(data.reply);

      const aiMessage: Message = {
        role: "assistant",
        content: cleanText,
        recommendedProducts: recommended,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error && error.message
          ? error.message
          : "Xin lỗi, hiện tại mình không thể kết nối với AI. Bạn thử lại sau nhé.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      handleSend();
    }
  }

  function handleClearChat() {
    setMessages([
      {
        role: "assistant",
        content: "Cuộc trò chuyện đã được làm mới. Bạn cần tư vấn mẫu bao laptop nào?",
      },
    ]);
  }

  return (
    <>
      {/* Floating Trigger Button with Pulsing Dot */}
      {!isOpen && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
          {/* Subtle tooltip / teaser bubble */}
          <div className="hidden sm:flex items-center gap-2 rounded-2xl border border-black/10 bg-white/95 px-3.5 py-2 text-xs font-semibold text-gray-800 shadow-xl backdrop-blur-md ">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 " />
            <span>Cần tư vấn chọn size? Chat AI ngay</span>
          </div>

          <button
            id="chatbox-toggle"
            onClick={() => setIsOpen(true)}
            className="group relative flex items-center gap-2.5 rounded-full bg-[var(--primary)] px-5 py-3.5 text-[var(--on-primary)] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] transition-all hover:bg-[var(--brand-primary-hover)] hover:scale-[1.02] active:scale-95"
            aria-label="Mở trợ lý AI"
          >
            <div className="relative flex h-3 w-3">
              <span className="absolute inline-flex h-full w-full  rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex h-3 w-3 rounded-full bg-amber-400"></span>
            </div>
            <span className="text-sm font-bold tracking-tight">AI Tư Vấn</span>
            <span className="rounded-full bg-amber-400/20 px-1.5 py-0.5 text-[10px] font-extrabold text-[var(--on-primary)]">
              Pro
            </span>
          </button>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-4 sm:right-6 z-50 flex h-[620px] max-h-[calc(100dvh-2.5rem-env(safe-area-inset-bottom))] w-[calc(100vw-2rem)] sm:w-[420px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] backdrop-blur-xl animate-fade-in-up">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 bg-[var(--primary)] px-5 py-4 text-[var(--on-primary)]">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-amber-500 text-[var(--on-primary)] font-bold shadow-md shadow-amber-500/30">
                🤖
                <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-[var(--text-primary)] bg-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm tracking-tight">CaseUp AI Assistant</h3>
                  <span className="rounded-full bg-amber-400/20 px-1.5 py-0.2 text-[9px] font-bold text-[var(--on-primary)]">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-[var(--on-primary)]">Tư vấn chọn size & mẫu bao 24/7</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleClearChat}
                className="flex h-11 w-11 items-center justify-center rounded-full p-1.5 text-[var(--on-primary)] hover:bg-black/5 hover:text-[var(--text-primary)] transition"
                title="Làm mới đoạn chat"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full p-1.5 text-[var(--on-primary)] hover:bg-black/5 hover:text-[var(--text-primary)] transition"
                aria-label="Đóng"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="border-b border-gray-100 bg-[var(--background)] px-4 py-2.5 overflow-x-auto no-scrollbar flex gap-2">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                disabled={isLoading}
                className="shrink-0 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-700 hover:border-amber-400 hover:bg-amber-50 hover:text-amber-900 transition disabled:opacity-50"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Messages Body */}
          <div className="min-h-0 flex-1 space-y-4 overflow-y-auto overscroll-contain bg-[var(--secondary-soft)] p-4 text-sm">
            {messages.map((item, index) => (
              <div key={index} className="space-y-2">
                <div
                  className={
                    item.role === "user"
                      ? "ml-auto max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm bg-[var(--soft-blue)] px-4 py-3 text-[var(--on-primary)] shadow-sm"
                      : "mr-auto max-w-[90%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm bg-[var(--surface-muted)] px-4 py-3 text-gray-800 shadow-sm border border-[var(--brand-border)]"
                  }
                >
                  {item.content}
                </div>

                {/* Interactive Recommended Product Cards inside AI response */}
                {item.recommendedProducts && item.recommendedProducts.length > 0 && (
                  <div className="space-y-2 pt-1 pl-1">
                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                      ✨ Gợi ý cho bạn:
                    </p>
                    <div className="grid gap-2 sm:grid-cols-1">
                      {item.recommendedProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white p-2.5 shadow-sm hover:border-amber-200 transition"
                        >
                          <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                            <Image src={prod.image} alt={prod.name} fill sizes="56px" className="object-contain p-1" />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="break-words text-sm font-bold text-gray-900">
                              {prod.name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {prod.size} • {prod.category}
                            </p>
                            <p className="price-text text-xs font-extrabold mt-0.5">
                              {prod.priceConfirmed === false ? "Giá chờ xác nhận" : prod.price.toLocaleString("vi-VN") + "₫"}
                            </p>
                          </div>

                          <div className="flex flex-col gap-1 shrink-0">
                            <Link
                              href={`/products/${prod.id}`}
                              className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-700 hover:bg-gray-200 text-center transition"
                            >
                              Xem
                            </Link>
                            <button
                              onClick={() => {
                                addToCart({
                                  id: prod.id,
                                  name: prod.name,
                                  price: prod.price,
                                  image: prod.image,
                                  size: prod.size,
                                  quantity: 1,
                                  selectedColor: prod.colors[0],
                                });
                              }}
                              className="rounded-full bg-[var(--primary)] px-2.5 py-1 text-xs font-bold text-[var(--on-primary)] hover:bg-[var(--brand-primary-hover)] transition"
                            >
                              + Giỏ
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div role="status" className="mr-auto flex items-center gap-2 rounded-2xl rounded-tl-sm bg-[var(--surface-muted)] px-4 py-3 text-xs text-gray-500 shadow-sm border border-[var(--brand-border)]">
                <span className="font-medium">AI đang tìm kiếm mẫu phù hợp nhất</span>
                <span className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-gray-100 bg-white p-3.5">
            <div className="flex items-center gap-2">
              <input
                aria-label="Tin nhắn tư vấn CaseUp"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập tên laptop hoặc yêu cầu tư vấn..."
                disabled={isLoading}
                className="min-w-0 flex-1 rounded-full border border-gray-200 bg-[var(--background)] px-4 py-2.5 text-xs sm:text-sm outline-none transition focus:border-black focus:bg-white disabled:bg-gray-100"
              />

              <button
                onClick={() => handleSend()}
                disabled={isLoading || !message.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--on-primary)] transition hover:bg-[var(--brand-primary-hover)] disabled:opacity-40"
                aria-label="Gửi tin nhắn"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                </svg>
              </button>
            </div>
            <p className="mt-1.5 text-center text-[10px] text-gray-400">
              Trợ lý AI tổng hợp thông tin từ 24 sản phẩm chính hãng của CaseUp.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
