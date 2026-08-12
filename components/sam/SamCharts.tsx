"use client";

import { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { ticketVolumeTrend, slaPerformanceTrend } from "@/lib/mock-data/sam";
import { THEME_CHANGE_EVENT } from "@/components/layout/ThemeToggle";

// Hardcoded hex (not CSS vars) — SVG presentation attributes from recharts
// don't reliably resolve custom properties across browsers. Two small
// palettes instead, picked to match the neutral/accent tokens per theme.
const palettes = {
  light: { axis: "#9a9da6", grid: "#eeeef1", tooltipBorder: "#dfe0e4", tooltipBg: "#ffffff", tooltipText: "#17181c", mutedBar: "#c7c9cf" },
  dark: { axis: "#888c97", grid: "#24262d", tooltipBorder: "#33363f", tooltipBg: "#101216", tooltipText: "#f5f5f6", mutedBar: "#50525c" },
};
const accent = "#6156e0";

function useChartTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Reading the DOM attribute set by the bootstrap script (app/layout.tsx);
  // doing this during render would mismatch the server-rendered markup.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const current = document.documentElement.getAttribute("data-theme");
    setTheme(current === "dark" ? "dark" : "light");

    function onChange(e: Event) {
      setTheme((e as CustomEvent<"light" | "dark">).detail);
    }
    window.addEventListener(THEME_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  }, []);

  return palettes[theme];
}

export function TicketVolumeChart() {
  const p = useChartTheme();
  const axisStyle = { fontSize: 11, fill: p.axis };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={ticketVolumeTrend} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={p.grid} vertical={false} />
        <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${p.tooltipBorder}`, background: p.tooltipBg, color: p.tooltipText }} />
        <Bar dataKey="opened" fill={p.mutedBar} radius={[3, 3, 0, 0]} name="Opened" />
        <Bar dataKey="resolved" fill={accent} radius={[3, 3, 0, 0]} name="Resolved" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function SlaPerformanceChart() {
  const p = useChartTheme();
  const axisStyle = { fontSize: 11, fill: p.axis };

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={slaPerformanceTrend} margin={{ left: -20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={p.grid} vertical={false} />
        <XAxis dataKey="week" tick={axisStyle} axisLine={false} tickLine={false} />
        <YAxis domain={[80, 100]} tick={axisStyle} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: `1px solid ${p.tooltipBorder}`, background: p.tooltipBg, color: p.tooltipText }} />
        <Line type="monotone" dataKey="metPct" stroke={accent} strokeWidth={2} dot={false} name="SLA met %" />
      </LineChart>
    </ResponsiveContainer>
  );
}
