"use client";

import { useMemo, useState } from "react";
import { Search, Inbox } from "lucide-react";
import { Tabs } from "@/components/ui/Tabs";
import { Select, Input } from "@/components/ui/Field";
import { TicketRow } from "@/components/tickets/TicketRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { Ticket, CustomerTicketStatus } from "@/lib/types";

const tabs: { value: string; label: string }[] = [
  { value: "all", label: "All" },
  { value: "open", label: "Open" },
  { value: "waiting_on_customer", label: "Awaiting You" },
  { value: "solution_provided", label: "Needs Confirmation" },
  { value: "closed", label: "Closed" },
];

function matchesTab(status: CustomerTicketStatus, tab: string) {
  if (tab === "all") return true;
  if (tab === "open") return ["submitted", "investigating"].includes(status);
  if (tab === "closed") return ["resolved", "closed"].includes(status);
  return status === tab;
}

export function TicketListClient({ tickets }: { tickets: Ticket[] }) {
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const [product, setProduct] = useState("all");
  const [sort, setSort] = useState("updated");

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const t of tabs) c[t.value] = tickets.filter((tk) => matchesTab(tk.status, t.value)).length;
    return c;
  }, [tickets]);

  const filtered = useMemo(() => {
    let result = tickets.filter((t) => matchesTab(t.status, tab));
    if (product !== "all") result = result.filter((t) => t.product.id === product);
    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter((t) => t.subject.toLowerCase().includes(q) || t.id.includes(q));
    }
    result = [...result].sort((a, b) => {
      if (sort === "updated") return +new Date(b.updatedAt) - +new Date(a.updatedAt);
      if (sort === "created") return +new Date(b.createdAt) - +new Date(a.createdAt);
      const priorityRank = { urgent: 0, high: 1, normal: 2, low: 3 };
      return priorityRank[a.priority] - priorityRank[b.priority];
    });
    return result;
  }, [tickets, tab, product, query, sort]);

  return (
    <div>
      <Tabs items={tabs.map((t) => ({ ...t, count: counts[t.value] }))} active={tab} onChange={setTab} />

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by subject or ticket #" className="pl-9" />
        </div>
        <Select value={product} onChange={(e) => setProduct(e.target.value)} className="sm:w-48">
          <option value="all">All products</option>
          <option value="platform">Cognite Platform</option>
          <option value="analytics">Cognite Analytics</option>
        </Select>
        <Select value={sort} onChange={(e) => setSort(e.target.value)} className="sm:w-44">
          <option value="updated">Sort: Last updated</option>
          <option value="created">Sort: Newest</option>
          <option value="priority">Sort: Priority</option>
        </Select>
      </div>

      <div className="mt-5 rounded-lg border border-neutral-200 bg-neutral-0">
        {filtered.length > 0 ? (
          filtered.map((t) => <TicketRow key={t.id} ticket={t} />)
        ) : (
          <div className="py-4">
            <EmptyState
              icon={Inbox}
              title="No tickets match these filters"
              description="Try clearing filters, or create a new ticket if you have a new issue."
              action={<Button href="/tickets/new" size="sm">Create a ticket</Button>}
            />
          </div>
        )}
      </div>
    </div>
  );
}
