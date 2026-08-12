import { SearchX } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlobalSearch } from "@/components/layout/GlobalSearch";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[calc(100vh-64px-320px)] max-w-lg flex-col items-center justify-center px-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
        <SearchX className="h-7 w-7 text-neutral-400" />
      </div>
      <h1 className="mt-5 text-2xl font-semibold text-neutral-900">We couldn&apos;t find that page</h1>
      <p className="mt-2 text-sm text-neutral-500">
        The link may be outdated, or the page may have moved. Try searching, or head back to Support Home.
      </p>
      <div className="mt-6 w-full">
        <GlobalSearch variant="hero" />
      </div>
      <div className="mt-6 flex gap-3">
        <Button href="/" variant="secondary">Support Home</Button>
        <Button href="/tickets/new">Contact Support</Button>
      </div>
    </div>
  );
}
