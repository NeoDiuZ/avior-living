import { Button } from "@/components/ui/button";
import heroImg from "@/assets/avior-hero-living.png.asset.json";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-cream">
      <div className="container-page grid items-center gap-8 py-8 md:grid-cols-12 md:gap-10 md:py-12">
        <div className="md:col-span-5">
          <p className="mb-4 text-base font-semibold text-accent">Trusted by Singapore homeowners</p>
          <h1 className="font-display text-[3.2rem] leading-[0.9] text-foreground sm:text-6xl lg:text-[5.4rem]">
            Factory Direct.
            <span className="block text-accent">Save 40%.</span>
            <span className="block">Shop smart.</span>
          </h1>
          <p className="mt-5 max-w-xl text-lg text-foreground/80 sm:text-xl">
            Premium-looking furniture without the retail markup.
          </p>

          <div className="mt-7 grid grid-cols-2 gap-3 sm:max-w-md">
            <div className="rounded-xl bg-background px-4 py-4 shadow-sm">
              <p className="font-display text-4xl leading-none text-accent sm:text-5xl">40%</p>
              <p className="mt-2 text-sm font-semibold text-foreground/75">Save on retail</p>
            </div>
            <div className="rounded-xl bg-background px-4 py-4 shadow-sm">
              <p className="font-display text-4xl leading-none sm:text-5xl">$189</p>
              <p className="mt-2 text-sm font-semibold text-foreground/75">Opening sale picks</p>
            </div>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="h-14 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
              <a href="#collections">Shop Collections</a>
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
          <div className="relative overflow-hidden rounded-xl bg-sand shadow-[0_40px_100px_-30px_rgba(80,50,30,0.4)]">
            <img
              src={heroImg.url}
              alt="Warm neutral Avior Living sofa and dining space"
              width={1588}
              height={926}
              className="h-auto w-full object-cover"
            />
            <div className="absolute left-4 top-4 rounded-xl bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:left-6 sm:top-6">
              <p className="font-display text-3xl leading-none text-accent sm:text-4xl">40%</p>
              <p className="mt-1 text-xs font-semibold text-foreground/70 sm:text-sm">Below retail</p>
            </div>
            <div className="absolute bottom-4 right-4 rounded-xl bg-background/95 px-4 py-3 shadow-lg backdrop-blur sm:bottom-6 sm:right-6">
              <p className="font-display text-3xl leading-none sm:text-4xl">$0</p>
              <p className="mt-1 text-xs font-semibold text-foreground/70 sm:text-sm">Delivery and assembly</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
