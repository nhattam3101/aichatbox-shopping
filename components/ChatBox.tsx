"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Xin chào. Mình có thể giúp bạn chọn bao laptop phù hợp theo kích thước, màu sắc và ngân sách.",
    },
    {
      role: "assistant",
      content:
        'Bạn có thể hỏi ví dụ: "Laptop của tôi dài 32cm thì dùng size nào?"',
    },
  ]);

  async function handleSend() {
    const trimmedMessage = message.trim();

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
          messages: updatedMessages,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "AI request failed");
      }

      const aiMessage: Message = {
        role: "assistant",
        content: data.reply,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Xin lỗi, hiện tại mình không thể kết nối với AI. Bạn thử lại sau nhé.",
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

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 z-40 rounded-full bg-black px-5 py-4 text-white shadow-xl transition hover:scale-105"
      >
        AI tư vấn
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-50 flex h-[500px] w-[360px] flex-col overflow-hidden rounded-3xl border border-black/10 bg-white shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
            <div>
              <h2 className="font-semibold">SleeveAI Assistant</h2>

              <p className="text-xs text-gray-500">Tư vấn size và sản phẩm</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="text-xl text-gray-500 hover:text-black"
              aria-label="Đóng chat"
            >
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#f7f5f2] p-4">
            {messages.map((item, index) => (
              <div
                key={index}
                className={
                  item.role === "user"
                    ? "ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-black px-4 py-3 text-sm text-white"
                    : "max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm shadow-sm"
                }
              >
                {item.content}
              </div>
            ))}

            {isLoading && (
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-4 py-3 text-sm text-gray-500 shadow-sm">
                AI đang tư vấn...
              </div>
            )}
          </div>

          {/* Input */}
          <div className="border-t border-black/10 bg-white p-4">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Nhập câu hỏi..."
                disabled={isLoading}
                className="flex-1 rounded-full border border-black/20 px-4 py-3 text-sm outline-none focus:border-black disabled:bg-gray-100"
              />

              <button
                onClick={handleSend}
                disabled={isLoading}
                className="rounded-full bg-black px-5 py-3 text-sm text-white disabled:opacity-50"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
