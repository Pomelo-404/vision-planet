import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Óptica · Catálogo",
  description: "Elige tu armazón y pídelo por WhatsApp",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Next injects the viewport meta automatically, so mobile renders correctly */}
      <body>{children}</body>
    </html>
  );
}
