import type { Metadata } from "next";
import { Inter, Manrope, JetBrains_Mono } from "next/font/google";
import "../styles.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { StoreProvider } from "@/components/store-context";

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin", "cyrillic"],
  variable: "--font-manrope",
  weight: ["600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "cyrillic"],
  variable: "--font-mono",
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NORD — промышленное окрасочное и шпаклёвочное оборудование | Продажа и аренда в Москве",
  description:
    "Профессиональные безвоздушные окрасочные аппараты, шпаклёвочные станции и установки для огнезащиты NORD. Склад в Москве, проверка под давлением, продажа и аренда.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a className="skip-link" href="#main">Перейти к содержимому</a>
        <StoreProvider>
          <SiteHeader />
          <main id="main">{children}</main>
          <SiteFooter />
        </StoreProvider>
      </body>
    </html>
  );
}
