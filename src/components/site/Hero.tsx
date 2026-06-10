import { Button } from "@/components/ui/button";

const heroImg = "/images/hero-living-room.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-8 py-10 md:grid-cols-2 md:gap-14 md:py-16 lg:py-20">
        <div>
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent">
            Factory Direct · Singapore
          </p>
          <h1 className="font-display text-[2.4rem] leading-[1.06] tracking-tight text-foreground sm:text-5xl lg:text-[3rem]">
            Designer Furniture Without Showroom Markups
          </h1>
          <p className="mt-5 text-base text-foreground/70 sm:text-lg lg:text-xl">
            Factory-direct pricing, white-glove delivery, assembly and disposal included across Singapore.
          </p>

          {/* Price anchor — scannable savings at a glance */}
          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-lg bg-primary px-4 py-2.5 text-sm font-bold text-primary-foreground">
              From $189
            </span>
            <span className="inline-flex items-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground">
              Up to 40% below retail
            </span>
            <span className="inline-flex items-center rounded-lg bg-secondary px-4 py-2.5 text-sm font-semibold text-foreground">
              $0 Delivery + Assembly
            </span>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Button
              asChild
              size="lg"
              className="h-14 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <a href="#opening-sale">Shop $189 Opening Sale</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-foreground/20 bg-background px-8 text-base font-semibold hover:bg-secondary"
            >
              <a href="#room-planner">Find What Fits My Home</a>
            </Button>
          </div>
        </div>

        <div className="relative">
          <div className="relative overflow-hidden rounded-3xl bg-sand shadow-[0_40px_100px_-30px_rgba(60,35,15,0.28)]">
            <img
              src={heroImg}
              alt="Modern Singapore home interior furnished by Avior Living"
              width={1920}
              height={1280}
              className="h-auto w-full object-cover"
            />
            <div className="absolute left-5 top-5 rounded-2xl bg-background/96 px-5 py-3 shadow-lg backdrop-blur-sm">
              <p className="font-display text-3xl font-semibold leading-none text-accent">40%</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/65">
                Below Retail
              </p>
            </div>
            <div className="absolute bottom-5 right-5 rounded-2xl bg-background/96 px-5 py-3 shadow-lg backdrop-blur-sm">
              <p className="font-display text-3xl font-semibold leading-none">$0</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/65">
                Delivery + Assembly
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
