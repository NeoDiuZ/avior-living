import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Avior Living — Designer Furniture Without Showroom Markups",
    template: "%s — Avior Living",
  },
  description:
    "Factory-direct furniture for Singapore homes. Up to 40% below retail with white-glove delivery, assembly and packaging disposal included.",
  openGraph: {
    title: "Avior Living — Factory-Direct Furniture in Singapore",
    description:
      "Designer furniture without showroom markups. Delivery, assembly and disposal included across Singapore.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@AviorLiving",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
