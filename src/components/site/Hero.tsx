import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-living-room.jpg";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-8 py-10 md:grid-cols-12 md:gap-12 md:py-16">
        <div className="md:col-span-5">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Factory Direct · Singapore
          </p>
          <h1 className="font-display text-[3.25rem] leading-[0.95] tracking-tight text-foreground sm:text-7xl lg:text-[5.5rem]">
            Save
            <br />
            <span className="block text-accent">40% Off</span>
            <span className="block">Retail.</span>
          </h1>
          <p className="mt-6 text-lg font-medium text-foreground/80 sm:text-xl">
            Same factories as the big brands.
            <br />
            Half the price.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-14 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              <a href="#bestsellers">Shop Now</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-foreground/20 bg-background px-8 text-base font-semibold hover:bg-secondary"
            >
              <a href="https://wa.me/6580000000" target="_blank" rel="noopener noreferrer">WhatsApp Us</a>
            </Button>
          </div>
        </div>

        <div className="relative md:col-span-7">
          <div className="relative overflow-hidden rounded-3xl bg-sand shadow-[0_40px_100px_-30px_rgba(80,50,30,0.4)]">
            <img
              src={heroImg}
              alt="Avior Living Singapore furniture"
              width={1920}
              height={1280}
              className="h-auto w-full object-cover"
            />
            <div className="absolute left-5 top-5 rounded-2xl bg-background/95 px-5 py-3 shadow-lg backdrop-blur">
              <p className="font-display text-3xl leading-none text-accent">40%</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Below Retail</p>
            </div>
            <div className="absolute bottom-5 right-5 rounded-2xl bg-background/95 px-5 py-3 shadow-lg backdrop-blur">
              <p className="font-display text-3xl leading-none">$0</p>
              <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider text-foreground/70">Delivery + Assembly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
