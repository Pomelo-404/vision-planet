import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://vision-planet-pink.vercel.app/"),

  title: {
    default: "Vision Planet",
    template: "%s | Vision Planet",
  },

  description:
    "Encuentra armazones oftálmicos y lentes de sol de las mejores marcas. Elige tu modelo favorito y realiza tu pedido fácilmente por WhatsApp.",

  keywords: [
    "Vision Planet",
    "armazones",
    "lentes",
    "lentes de sol",
    "lentes oftálmicos",
    "gafas",
    "óptica",
    "anteojos",
    "WhatsApp",
    "México",
  ],

  applicationName: "Vision Planet",

  authors: [
    {
      name: "Pomelo 404",
    },
  ],

  creator: "Pomelo 404",
  publisher: "Pomelo 404",

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    type: "website",
    locale: "es_MX",
    siteName: "Vision Planet",
    title: "Vision Planet",
    description:
      "Explora nuestro catálogo de armazones y pide tu modelo favorito por WhatsApp.",
    url: "https://vision-planet-pink.vercel.app/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Vision Planet",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Vision Planet",
    description:
      "Encuentra tu próximo armazón y realiza tu pedido por WhatsApp.",
    images: ["/og-image.jpg"],
  },

  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  category: "shopping",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      {/* Next inyecta el viewport automáticamente, así que el móvil se ve bien */}
      <body>{children}</body>
    </html>
  );
}
