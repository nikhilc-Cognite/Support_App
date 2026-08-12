import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { Select } from "@/components/ui/Field";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <Select defaultValue="platform" className="mb-6">
              <option value="platform">Cognite Platform</option>
              <option value="analytics">Cognite Analytics</option>
            </Select>
            <DocsSidebar />
          </div>
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
