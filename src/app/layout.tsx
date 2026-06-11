import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: {
    default: "Avior Living | Save 40% Off Retail Furniture in Singapore",
    template: "%s | Avior Living",
  },
  description:
    "Factory-direct furniture for Singapore homes. Save up to 40% off retail. Free white-glove delivery, assembly, and packaging disposal.",
  openGraph: {
    title: "Avior Living | Factory-Direct Furniture, Singapore",
    description:
      "Save up to 40% off retail. Free delivery, assembly, and disposal across Singapore.",
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
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,700;1,9..144,400&family=Inter:wght@400;500;600;700&display=swap"
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
