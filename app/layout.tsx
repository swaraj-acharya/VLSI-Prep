import type { Metadata, Viewport } from "next";
import AppShell from "@/components/AppShell";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Signoff: VLSI training system", template: "%s | Signoff" },
  description: "A personal VLSI learning and job-preparation system: daily plan, revision, projects, proof of work.",
  icons: { icon: "/icon.svg" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#f2f3ef" }, { media: "(prefers-color-scheme: dark)", color: "#121614" }],
};

// Applies the saved theme before first paint to avoid a light/dark flash.
const themeScript = `try{var s=JSON.parse(localStorage.getItem("signoff-vlsi:v1")||"{}");var t=s&&s.settings&&s.settings.theme;if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: themeScript }} /></head>
      <body suppressHydrationWarning><AppShell>{children}</AppShell></body>
    </html>
  );
}
