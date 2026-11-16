import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-xl py-24">
      <h1 className="text-3xl font-semibold tracking-tight">There&apos;s no page here</h1>
      <p className="mt-3 text-muted">The link may be old. You can start a new test from the home page.</p>
      <Link href="/" className="mt-8 inline-flex h-10 items-center rounded-md bg-fg px-4 text-sm font-medium text-bg hover:opacity-85">
        Go to the home page
      </Link>
    </div>
  );
}
