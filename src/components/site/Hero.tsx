import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-living-room.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-10 py-12 md:grid-cols-12 md:gap-12 md:py-20 lg:py-24">
        <div className="md:col-span-6 lg:col-span-6">
          <span className="chip mb-5 bg-sand">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Singapore · Direct From Factory
          </span>
          <h1 className="font-display text-4xl leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Designer Furniture <br className="hidden sm:block" />
            <em className="not-italic text-accent">Without Showroom Markups.</em>
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
            Factory-direct pricing, white-glove delivery, assembly and packaging disposal
            included — across every postcode in Singapore.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-12 bg-primary px-6 text-primary-foreground hover:bg-primary/90">
              <a href="#bestsellers">Shop Best Sellers</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-foreground/15 bg-background px-6 hover:bg-secondary"
            >
              <a href="#room-planner">See What Fits My Home</a>
            </Button>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="text-accent">★★★★★</span> Trusted by Singapore homeowners
            </span>
            <span>·</span>
            <span>Up to 40% below retail</span>
            <span>·</span>
            <span>WhatsApp support 7 days</span>
          </div>
        </div>

        <div className="relative md:col-span-6 lg:col-span-6">
          <div className="relative overflow-hidden rounded-2xl bg-sand shadow-[0_30px_80px_-30px_rgba(80,50,30,0.35)]">
            <img
              src={heroImg}
              alt="Warm, neutral Singapore living room furnished by Avior Living"
              width={1920}
              height={1280}
              className="h-auto w-full object-cover"
            />
          </div>
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:block">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Average savings</p>
            <p className="font-display text-2xl text-foreground">38% vs. retail</p>
          </div>
          <div className="absolute -right-3 top-6 hidden rounded-xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur md:block">
            <p className="text-[11px] uppercase tracking-widest text-muted-foreground">Included</p>
            <p className="text-sm font-medium text-foreground">Delivery · Assembly · Disposal</p>
          </div>
        </div>
      </div>
    </section>
  );
}
