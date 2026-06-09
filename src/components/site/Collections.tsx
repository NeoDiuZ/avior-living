import livingHero from "@/assets/avior-hero-living.png.asset.json";
import bedroomHero from "@/assets/avior-bedroom.png.asset.json";
import diningHero from "@/assets/avior-dining-set.png.asset.json";
import consoleHero from "@/assets/avior-tv-console.png.asset.json";
import deskHero from "@/assets/avior-study-desk.jpeg.asset.json";
import chairHero from "@/assets/avior-lounge-chair.png.asset.json";

const collections = [
  {
    title: "Sofas",
    subtitle: "Cloud comfort. Factory direct pricing.",
    image: livingHero.url,
    href: "#bestsellers",
  },
  {
    title: "Beds",
    subtitle: "Warm bedroom pieces for new homes.",
    image: bedroomHero.url,
    href: "#bestsellers",
  },
  {
    title: "Dining",
    subtitle: "Sets made for hosting without overspending.",
    image: diningHero.url,
    href: "#bestsellers",
  },
  {
    title: "TV Consoles",
    subtitle: "Clean storage for compact Singapore living.",
    image: consoleHero.url,
    href: "#bestsellers",
  },
  {
    title: "Study",
    subtitle: "Home office essentials that still look premium.",
    image: deskHero.url,
    href: "#bestsellers",
  },
  {
    title: "Chairs",
    subtitle: "Accent and lounge chairs that finish the room.",
    image: chairHero.url,
    href: "#bestsellers",
  },
];

export function Collections() {
  return (
    <section id="collections" className="bg-background py-16 md:py-24">
      <div className="container-page">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-3xl">
            <p className="mb-3 text-base font-semibold text-accent">Collections</p>
            <h2 className="font-display text-4xl leading-[0.95] text-foreground sm:text-5xl md:text-6xl">
              Shop by room. Shop by need.
            </h2>
            <p className="mt-4 max-w-2xl text-base text-foreground/75 sm:text-lg">
              Straight to the categories Singapore homeowners actually shop first.
            </p>
          </div>
          <a href="#sale-189" className="text-base font-semibold text-accent hover:text-primary">
            See $189 opening sale
          </a>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection) => (
            <a
              key={collection.title}
              href={collection.href}
              className="group overflow-hidden rounded-xl border border-border bg-card"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={collection.image}
                  alt={collection.title}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="space-y-2 p-5">
                <h3 className="font-display text-2xl text-foreground sm:text-3xl">{collection.title}</h3>
                <p className="text-sm text-foreground/70 sm:text-base">{collection.subtitle}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
