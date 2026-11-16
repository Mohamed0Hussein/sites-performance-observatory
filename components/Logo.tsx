/** A three-quarter gauge with its needle in the "good" zone. */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true" fill="none">
      <path d="M7.5 24.5a12 12 0 1 1 17 0" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
      <path d="M16 17l6-6" stroke="var(--good)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="16" cy="17" r="2.5" fill="currentColor" />
    </svg>
  );
}
