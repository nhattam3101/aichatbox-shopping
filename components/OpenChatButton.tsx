"use client";

export default function OpenChatButton() {
  function handleClick() {
    const btn = document.querySelector<HTMLButtonElement>("#chatbox-toggle");
    btn?.click();
  }

  return (
    <button
      onClick={handleClick}
      className="rounded-full border border-black px-6 py-3 transition hover:bg-black hover:text-white"
    >
      Hỏi AI
    </button>
  );
}

