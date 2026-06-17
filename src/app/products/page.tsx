import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";

export const metadata: Metadata = {
  title: "Shop Furniture",
  description: "Browse factory-direct furniture by room. Free white-glove delivery, assembly and disposal across Singapore.",
};

const ROOMS = [
  {
    label: "Opening Sale",
    href: "/products/opening-sale",
    description: "Curated pieces at $219. Up to 40% below retail.",
    tag: "Ends 31 Jul",
  },
  {
    label: "Living Room",
    href: "/products/living-room",
    description: "Sofas, TV consoles, coffee tables, shoe cabinets and more.",
  },
  {
    label: "Bedroom",
    href: "/products/bedroom",
    description: "Beds, wardrobes, mattresses, bedside tables and more.",
  },
  {
    label: "Dining Room",
    href: "/products/dining-room",
    description: "Dining tables, chairs and sets.",
  },
];

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main>
        <div className="border-b border-border bg-cream">
          <div className="container-page py-10 md:py-14">
            <h1
              className="font-display font-bold leading-none tracking-tight"
              style={{ fontSize: "clamp(2.5rem, 6vw, 4rem)" }}
            >
              Shop Furniture
            </h1>
            <p className="mt-3 text-base text-foreground/60">
              Factory-direct pricing. Free white-glove delivery islandwide.
            </p>
          </div>
        </div>

        <div className="container-page py-12 md:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ROOMS.map((room) => (
              <Link
                key={room.href}
                href={room.href}
                className="group flex flex-col justify-between rounded-2xl border border-border bg-background p-6 transition-colors hover:border-accent hover:bg-accent/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="font-display text-xl font-semibold group-hover:text-accent">
                      {room.label}
                    </h2>
                    {room.tag && (
                      <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent">
                        {room.tag}
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{room.description}</p>
                </div>
                <span className="mt-6 text-sm font-semibold text-accent opacity-0 transition-opacity group-hover:opacity-100">
                  Browse →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
