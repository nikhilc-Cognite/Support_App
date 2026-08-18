import { AlertTriangle } from "lucide-react";
import { activeIncidents } from "@/lib/mock-data/status";

/**
 * Site-wide banner — shown only for major/critical active incidents, per
 * docs/02-information-architecture.md. Minor incidents (like INC-1042 in
 * mock data) surface on the Status page and in Notifications instead of
 * interrupting every page — a persistent banner for low-impact issues
 * would train customers to ignore it.
 */
export function IncidentBanner() {
  const notable = activeIncidents().filter((i) => i.severity === "major" || i.severity === "critical");
  if (notable.length === 0) return null;
  const incident = notable[0];

  return (
    <a
      href="https://status.cognite.com/"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-center gap-2 bg-danger-500 px-4 py-2 text-center text-sm font-medium text-white hover:bg-danger-700"
    >
      <AlertTriangle className="h-4 w-4 shrink-0" />
      <span className="truncate">
        {incident.title} — affecting {incident.affectedProducts.join(", ")}. View status →
      </span>
    </a>
  );
}
