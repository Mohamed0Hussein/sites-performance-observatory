import Link from "next/link";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
      <Link href="/" className="flex items-center gap-2.5 font-medium tracking-tight">
        <Logo className="h-6 w-6" />
        Performance Observatory
      </Link>
      <a
        href="https://github.com/Mohamed0Hussein/sites-peformance-observatory"
        className="text-sm text-muted hover:text-fg"
      >
        Source on GitHub
      </a>
    </header>
  );
}
