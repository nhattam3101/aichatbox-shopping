/** Shared outline icons for customer benefits; labels supply the accessible name. */
export default function BenefitIcon({ kind }: { kind: string }) {
  const paths: Record<string, string> = {
    "🔄": "M20 7v5h-5 M4 17v-5h5 M6.1 7a7 7 0 0 1 11.6-2L20 8 M4 16l2.3 3A7 7 0 0 0 18 17",
    "🚚": "M3 5h11v12H3z M14 9h4l3 4v4h-7 M7 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4 M17 17a2 2 0 1 0 0 4 2 2 0 0 0 0-4",
    "🤖": "M5 7h14v13H5z M12 3v4 M9 12h.01 M15 12h.01 M9 16h6 M2 11v5 M22 11v5",
    "💵": "M3 5h18v14H3z M3 9h18 M7 14h4",
  };
  return (
    <svg aria-hidden="true" className="h-6 w-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
      <path d={paths[kind] ?? "M12 3l8 3v6c0 5-8 9-8 9s-8-4-8-9V6z M8 12l3 3 5-6"} />
    </svg>
  );
}
