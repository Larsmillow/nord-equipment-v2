import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { NordShowroom } from "./showroom";
import "./tg.css";

export const metadata: Metadata = {
  title: "NORD — витрина окрасочных станций",
  description: "Покупка и аренда окрасочных и шпаклёвочных станций NORD. Подбор под задачу, заявка менеджеру в Telegram.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#ffffff",
};

export default function TgShowroomPage() {
  return (
    <>
      <Script src="https://telegram.org/js/telegram-web-app.js" strategy="afterInteractive" />
      <NordShowroom />
    </>
  );
}
