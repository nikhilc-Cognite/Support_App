import type { Metadata } from "next";
import { Manrope, IBM_Plex_Mono } from "next/font/google";
import { GlobalNav } from "@/components/layout/GlobalNav";
import { Footer } from "@/components/layout/Footer";
import { AskAILauncher } from "@/components/ask-ai/AskAILauncher";
import "./globals.css";

// Runs before paint to avoid a theme flash. Kept as a raw <script> in <head>
// (not next/script) to avoid the React 19 / Next 16 "script tag in component" warning.
const THEME_INIT_SCRIPT = `(function(){try{var s=localStorage.getItem("cognite-theme");var t=s==="light"||s==="dark"?s:(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light");document.documentElement.setAttribute("data-theme",t);}catch(e){}})();`;

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
  description:
    "The Cognite customer support portal: knowledge base, documentation, Ask AI (kapa.ai), ticket tracking, and Resolution Intelligence in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }}
          suppressHydrationWarning
        />
      </head>
      <body className="min-h-full flex flex-col bg-neutral-0">
        <GlobalNav />
        <main className="flex-1">{children}</main>
        <Footer />
        <AskAILauncher />
      </body>
    </html>
  );
}
