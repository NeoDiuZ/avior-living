import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";

export const metadata: Metadata = {
  title: "Shop Furniture — Avior Living",
  description:
    "Browse factory-direct furniture by room. Free white-glove delivery, assembly and disposal across Singapore.",
};

function RoomCard({
  href,
  image,
  label,
  count,
}: {
  href: string;
  image: string;
  label: string;
  count: string;
}) {
  return (
    <Link href={href} className="group relative block overflow-hidden rounded-3xl bg-sand">
      <img
        src={image}
        alt={label}
        loading="lazy"
        className="h-[420px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:h-[480px]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-7 text-cream">
        <p className="font-display text-4xl leading-none tracking-tight sm:text-5xl">{label}</p>
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wider text-cream/75 transition-all duration-300 group-hover:text-cream/100 group-hover:gap-2.5">
          {count}
          <ArrowRight className="h-3.5 w-3.5" />
        </p>
      </div>
    </Link>
  );
}

export default function ProductsPage() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <SiteHeader />
      <main className="overflow-x-hidden">
        {/* Editorial heading */}
        <div className="bg-cream pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container-page">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-accent">
              Shop by Room
            </p>
            <h1
              className="mt-3 w-full max-w-5xl font-display font-bold leading-[0.92] tracking-tight text-foreground"
              style={{ fontSize: "clamp(3rem, 7vw, 6rem)" }}
            >
              Built for
              <br />
              <span className="text-accent">Singapore homes.</span>
            </h1>
          </div>
        </div>

        {/* 2×2 room grid — mathematically zero-gap */}
        <div className="bg-cream pb-16 md:pb-24">
          <div className="container-page">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-5">

              {/* Opening Sale — dark editorial card */}
              <Link
                href="/products/opening-sale"
                className="group relative overflow-hidden rounded-3xl bg-foreground"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-accent/25 via-transparent to-transparent transition-opacity duration-700 group-hover:opacity-60" />
                <div className="relative flex h-full min-h-[420px] flex-col justify-between p-8 md:min-h-[480px] md:p-10">
                  <span className="inline-flex w-fit items-center rounded-full border border-accent/30 bg-accent/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                    Ends 31 Jul
                  </span>
                  <div>
                    <p
                      className="font-display font-bold leading-none text-cream"
                      style={{ fontSize: "clamp(4rem, 9vw, 7rem)" }}
                    >
                      $219
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-cream/60 md:text-3xl">
                      Opening Sale
                    </p>
                    <p className="mt-5 flex items-center gap-2 text-sm font-semibold text-cream/40 transition-all duration-300 group-hover:gap-3 group-hover:text-accent">
                      Shop all discounted pieces
                      <ArrowRight className="h-4 w-4" />
                    </p>
                  </div>
                </div>
              </Link>

              <RoomCard
                href="/products/living-room"
                image="/images/inspiration-living.jpg"
                label="Living Room"
                count="120+ pieces"
              />
              <RoomCard
                href="/products/bedroom"
                image="/images/inspiration-bedroom.jpg"
                label="Bedroom"
                count="80+ pieces"
              />
              <RoomCard
                href="/products/dining-room"
                image="/images/inspiration-dining.jpg"
                label="Dining Room"
                count="60+ pieces"
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
