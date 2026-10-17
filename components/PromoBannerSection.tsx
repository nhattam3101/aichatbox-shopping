import Image from "next/image";
import Link from "next/link";
import { homepageBanners } from "@/data/promotions";

export default function PromoBannerSection() {
  return <section aria-labelledby="homepage-promotions-title" className="mx-auto max-w-7xl px-6 pt-12 md:px-12 lg:px-20">
    <div className="mb-5">
      <h2 id="homepage-promotions-title" className="text-2xl font-extrabold text-[var(--deep-navy)]">Ưu đãi nổi bật</h2>
      <p className="mt-2 text-sm text-[var(--text-secondary)]">Khám phá ưu đãi đang diễn ra tại CaseUp.</p>
    </div>
    <div role="region" aria-label="Các chương trình nổi bật, cuộn ngang để xem thêm" tabIndex={0}
      className="-mx-1 grid min-w-0 snap-x snap-mandatory auto-cols-[86%] grid-flow-col gap-4 overflow-x-auto px-1 pb-4 pt-1 focus-visible:outline-2 focus-visible:outline-[var(--secondary)] sm:auto-cols-[68%] lg:grid-cols-2 lg:grid-flow-row lg:gap-5 lg:overflow-visible">
      {homepageBanners.map(banner => <Link key={banner.id} href={banner.href} aria-label={banner.alt}
        className="min-w-0 snap-start overflow-hidden rounded-2xl border border-[var(--brand-border)] bg-white shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--secondary)]">
        <Image src={banner.image} alt={banner.alt} width={1672} height={941}
          sizes="(min-width: 1280px) 550px, (min-width: 1024px) 45vw, (min-width: 640px) 68vw, 86vw"
          className="block h-auto w-full object-contain" />
        <div className="flex items-center justify-between gap-3 px-4 py-3 text-sm font-bold text-[var(--deep-navy)]">
          <span>{banner.title}</span><span aria-hidden="true" className="text-[var(--secondary)]">→</span>
        </div>
      </Link>)}
    </div>
  </section>;
}
