import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // ✅ CORREGIDO: con "s" y sin barra al final

// Fuente Inter (similar a Geist, usada en tu sitio principal)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

// Metadatos SEO — la página NO se indexa en Google
export const metadata: Metadata = {
  title: "Preparando tu descarga...",
  description:
    "Por favor espera mientras preparamos tu enlace de descarga.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

// Configuración responsive
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={inter.variable}>
      <body className="font-sans bg-base text-[#ededed]">{children}</body>
    </html>
  );
}