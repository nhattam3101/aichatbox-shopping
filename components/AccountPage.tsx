import Link from "next/link";
import type { ReactNode } from "react";
import Navbar from "@/components/Navbar";
import { accountLinks } from "@/data/account-navigation";
export default function AccountPage({ title, href, children }: { title: string; href: string; children: ReactNode }) {
  return <main className="min-h-screen bg-[var(--background)] text-[var(--text-primary)]"><Navbar />
    <section className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:py-12">
      <p className="text-xs font-bold uppercase tracking-widest text-[var(--secondary)]">Tài khoản CaseUp</p>
      <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h1>
      <nav aria-label="Tài khoản" className="my-6 flex flex-wrap gap-2">{accountLinks.map(link => <Link key={link.href} href={link.href} aria-current={href === link.href ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-semibold ${href === link.href ? "bg-[var(--secondary)] text-white" : "border border-[var(--border)] bg-white"}`}>{link.label}</Link>)}</nav>
      {children}
    </section>
  </main>;
}
