import type { Metadata } from "next";
import { Inter, Fraunces, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

/* Type system:
 *  - Fraunces  → display. A variable serif with an optical size axis; carries
 *                the editorial voice without feeling like a stock luxury font.
 *  - Inter     → UI and body. Neutral, excellent at small sizes.
 *  - JetBrains → numerals and specs. Tabular figures are the point.
 */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://meridian-coffee.example"),
  title: {
    default: "Meridian — Coffee & Equipment",
    template: "%s · Meridian",
  },
  description:
    "Single-lot coffee roasted in small batches, and the grinders and machines to do it justice. A portfolio concept store.",
  openGraph: {
    title: "Meridian — Coffee & Equipment",
    description:
      "Single-lot coffee roasted in small batches, and the equipment to do it justice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${fraunces.variable} ${jetbrains.variable}`}
      >
        <noscript>
          {/* Without JS the reveal observer never fires — show everything. */}
          <style>{`[data-reveal]{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100 focus:rounded-(--radius-pill) focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-canvas"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
