import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import Script from "next/script";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";
import { ChatWidget } from "@/components/ask-ai/ChatWidget";
import "./globals.css";

// Resolves and applies the theme before first paint (localStorage, else
// system preference) so there's no flash of the wrong theme on load.
// `beforeInteractive` injects this into the HTML ahead of hydration.
const THEME_INIT_SCRIPT = `
(function () {
  try {
    var stored = localStorage.getItem("cognite-theme");
    var theme = stored === "light" || stored === "dark"
      ? stored
      : (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (e) {}
})();
`;

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Cognite Support — Answers first, humans always reachable",
  description: "The Cognite customer support portal: knowledge base, documentation, Ask AI, ticket tracking, and Resolution Intelligence in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-neutral-0">
        <Script id="theme-init" strategy="beforeInteractive">
          {THEME_INIT_SCRIPT}
        </Script>
        <GlobalNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <ChatWidget />
      </body>
    </html>
  );
}
