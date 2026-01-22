import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center space-x-3">
          <div className="relative h-8 w-8 overflow-hidden rounded-lg bg-indigo-500/10 p-1 ring-1 ring-indigo-500/20">
             <Image src="/logo.svg" alt="Logo" width={32} height={32} className="h-full w-full object-contain" />
          </div>
          <span className="font-bold text-lg tracking-tight bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">PerfObservatory</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <nav className="flex items-center space-x-6 text-sm font-medium">
                <Link href="https://github.com/Mohamed0Hussein/sites-peformance-observatory" className="text-muted-foreground hover:text-foreground transition-colors" target="_blank">GitHub</Link>
            </nav>
        </div>
      </div>
    </header>
  );
}
