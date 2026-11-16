export function Section({
  id,
  title,
  note,
  aside,
  children,
}: {
  id: string;
  title: string;
  note?: React.ReactNode;
  aside?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-line py-10">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <div>
          <h2 id={id} className="text-xl font-semibold tracking-tight">
            {title}
          </h2>
          {note && <p className="mt-1.5 max-w-[70ch] text-sm leading-relaxed text-muted">{note}</p>}
        </div>
        {aside && <div className="shrink-0 text-sm text-faint">{aside}</div>}
      </div>
      {children}
    </section>
  );
}
