"use client";

import { useEffect, useRef } from "react";

// Original, small Canvas implementation inspired by the local reference's
// floating velocity and boundary wrapping concepts; no reference source copied.
export default function AntigravityBackground({ celebration = false, stronger = false }: { celebration?: boolean; stronger?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const motion = matchMedia("(prefers-reduced-motion: reduce)");
    const colors = ["#FFB0A9", "#F9D678", "#B6DDDA", "#80C8BF"];
    let frame = 0, width = 0, height = 0, previous = 0, elapsed = 0;
    let visible = true;
    let particles: { x: number; y: number; radius: number; speed: number; phase: number; color: string }[] = [];
    function resize() {
      if (!canvas || !ctx) return;
      const rect = canvas.getBoundingClientRect();
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      particles = Array.from({ length: width < 768 ? 10 : stronger ? 30 : 24 }, (_, i) => ({
        x: Math.random() * width, y: Math.random() * height, radius: 2 + Math.random() * 4,
        speed: 5 + Math.random() * 9, phase: Math.random() * Math.PI * 2, color: colors[i % colors.length],
      }));
    }
    function draw(time: number) {
      if (!ctx) return;
      const dt = previous ? Math.min((time - previous) / 1000, 0.05) : 0;
      previous = time; elapsed += dt;
      ctx.clearRect(0, 0, width, height);
      if (celebration && elapsed >= 2) return;
      ctx.globalAlpha = (stronger ? 0.28 : 0.2) * (celebration ? Math.max(0, 1 - elapsed / 2) : 1);
      for (const [i, p] of particles.entries()) {
        p.y -= p.speed * dt * (celebration ? 5 : 1);
        p.x += Math.sin(elapsed * 0.5 + p.phase) * dt * 3;
        if (p.y < -10) p.y = height + 10;
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        ctx.fillStyle = p.color; ctx.beginPath();
        if (i % 3 === 0) ctx.roundRect(p.x, p.y, p.radius * 2, p.radius, 2);
        else ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }
      frame = requestAnimationFrame(draw);
    }
    function start() {
      cancelAnimationFrame(frame); previous = 0;
      if (motion.matches) { ctx?.clearRect(0, 0, width, height); return; }
      if (visible && !document.hidden && (!celebration || elapsed < 2)) frame = requestAnimationFrame(draw);
    }
    const resizeObserver = new ResizeObserver(() => { resize(); start(); });
    const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; start(); });
    resizeObserver.observe(canvas); intersection.observe(canvas);
    motion.addEventListener("change", start);
    document.addEventListener("visibilitychange", start);
    resize(); start();
    return () => {
      cancelAnimationFrame(frame); resizeObserver.disconnect(); intersection.disconnect();
      motion.removeEventListener("change", start); document.removeEventListener("visibilitychange", start);
    };
  }, [celebration, stronger]);
  return <canvas ref={ref} aria-hidden="true" className="antigravity-background" />;
}
