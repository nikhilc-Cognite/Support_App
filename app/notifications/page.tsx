import Link from "next/link";
import { Ticket, AlertTriangle, Wrench, Megaphone, BookOpen } from "lucide-react";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { notifications } from "@/lib/mock-data/notifications";
import { relativeTime, cn } from "@/lib/utils";

export const metadata = { title: "Notifications — Cognite Support" };

const iconMap = {
  ticket: Ticket,
  incident: AlertTriangle,
  maintenance: Wrench,
  announcement: Megaphone,
  knowledge: BookOpen,
};

const iconColor = {
  ticket: "text-accent-600 bg-accent-50 dark:bg-accent-900/40",
  incident: "text-danger-500 bg-danger-50 dark:bg-danger-900/40",
  maintenance: "text-warning-500 bg-warning-50 dark:bg-warning-900/40",
  announcement: "text-accent-600 bg-accent-50 dark:bg-accent-900/40",
  knowledge: "text-neutral-500 bg-neutral-100",
};

export default function NotificationsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8">
      <Breadcrumbs items={[{ label: "Support Home", href: "/" }, { label: "Notifications" }]} />
      <div className="mt-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Notifications</h1>
        <button className="text-sm font-medium text-accent-600 hover:text-accent-700">Mark all as read</button>
      </div>

      <div className="mt-6 divide-y divide-neutral-100 rounded-lg border border-neutral-200 bg-neutral-0">
        {notifications.map((n) => {
          const Icon = iconMap[n.type];
          return (
            <Link key={n.id} href={n.href} className={cn("flex gap-3.5 px-5 py-4 hover:bg-neutral-50", !n.read && "bg-accent-50/40 dark:bg-accent-900/20")}>
              <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-full", iconColor[n.type])}>
                <Icon className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={cn("text-sm", n.read ? "text-neutral-700" : "font-semibold text-neutral-900")}>{n.title}</p>
                <p className="mt-0.5 text-sm text-neutral-500">{n.body}</p>
                <p className="mt-1.5 text-xs text-neutral-400">{relativeTime(n.createdAt)}</p>
              </div>
              {!n.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent-500" />}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
