import "@/styles/tailwind.css";
import { Providers } from "./providers";
import { cx } from "@/utils/all";
import { Montserrat, Source_Sans_3, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap"
});

const sourceSans = Source_Sans_3({
  subsets: ["latin"],
  variable: "--font-source-sans",
  display: "swap"
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"]
});

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="nb-NO"
      suppressHydrationWarning
      className={cx(
        montserrat.variable,
        sourceSans.variable,
        playfair.variable
      )}>
      <body className="bg-paper font-sans text-ink antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
