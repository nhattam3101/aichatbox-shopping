"use client";

export default function OpenChatButton() {
  function handleClick() {
    const btn = document.querySelector<HTMLButtonElement>("#chatbox-toggle");
    btn?.click();
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full bg-[var(--secondary)] px-6 py-3 text-xl font-bold text-white transition-colors hover:bg-[var(--secondary-hover)]"
    >
      Hỏi AI
    </button>
  );
}

