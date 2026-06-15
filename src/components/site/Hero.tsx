import { Button } from "@/components/ui/button";

const heroImg = "/images/hero-living-room.jpg";

const stripStats = [
  { stat: "40%",   label: "Off Retail" },
  { stat: "2 years", label: "Warranty" },
  { stat: "$0",    label: "Delivery & Assembly" },
  { stat: "7-Days", label: "WhatsApp Support" },
];

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
              <a href="#opening-sale">Shop Now</a>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 border-foreground/20 bg-background px-8 text-base font-semibold hover:bg-secondary"
            >
              <a href="https://wa.me/6580000000" target="_blank" rel="noopener noreferrer">
                <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" style={{ fill: "#25D366" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
                WhatsApp Us
              </a>
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
      {/* Stat strip */}
      <div className="bg-sand">
        <div className="container-page">
          <div className="grid grid-cols-2 divide-x divide-border sm:grid-cols-4">
            {stripStats.map(({ stat, label }) => (
              <div
                key={label}
                className="flex flex-col items-center px-4 py-8 text-center sm:px-8 sm:py-10"
              >
                <span
                  className="font-display font-bold leading-none text-accent"
                  style={{ fontSize: "clamp(2.25rem, 5vw, 3.5rem)" }}
                >
                  {stat}
                </span>
                <span className="mt-2.5 text-sm font-medium text-foreground/60 sm:text-base">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
