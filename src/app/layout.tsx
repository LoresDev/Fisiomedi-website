import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { clinic } from "@/config/clinic";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${clinic.name} | ${clinic.tagline}`,
    template: `%s | ${clinic.name}`,
  },
  description: clinic.heroText,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-white text-slate-800 font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
