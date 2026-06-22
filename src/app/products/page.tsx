import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SiteHeader } from "@/components/site/SiteHeader";
import { Footer } from "@/components/site/Footer";
import { AnnouncementBar } from "@/components/site/AnnouncementBar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildBreadcrumbJsonLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Shop Furniture — Avior Living",
  description:
    "Browse factory-direct furniture by room. Free white-glove delivery, assembly and disposal across Singapore.",
};

const breadcrumbJsonLd = buildBreadcrumbJsonLd([
  { name: "Home", url: "/" },
  { name: "Products", url: "/products" },
]);

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
      <JsonLd data={breadcrumbJsonLd} />
      <AnnouncementBar />
      <SiteHeader />
      <main className="overflow-x-hidden">
        {/* Editorial heading */}
        <div className="bg-cream pt-16 pb-12 md:pt-24 md:pb-16">
          <div className="container-page">
            <Breadcrumb className="mb-4">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
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

              {/* Opening Sale — image card with accent overlay */}
              <Link
                href="/products/opening-sale"
                className="group relative overflow-hidden rounded-3xl bg-sand"
              >
                <img
                  src="/images/hero-living-room.jpg"
                  alt="Opening Sale"
                  loading="eager"
                  className="h-[420px] w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 md:h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/10" />
                <div className="absolute inset-0 flex flex-col justify-between p-8 md:p-10">
                  <span className="inline-flex w-fit items-center rounded-full border border-cream/30 bg-cream/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-cream backdrop-blur-sm">
                    Ends 31 Jul
                  </span>
                  <div>
                    <p
                      className="font-display font-bold leading-none text-cream"
                      style={{ fontSize: "clamp(3.5rem, 8vw, 6rem)" }}
                    >
                      $219
                    </p>
                    <p className="mt-1 font-display text-2xl font-semibold text-cream/70 md:text-3xl">
                      Opening Sale
                    </p>
                    <p className="mt-4 flex items-center gap-2 text-sm font-semibold text-cream/50 transition-all duration-300 group-hover:gap-3 group-hover:text-cream/90">
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
