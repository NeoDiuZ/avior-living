import livingHero from "@/assets/avior-lounge-lifestyle.png.asset.json";
import diningHero from "@/assets/avior-dining-round.png.asset.json";
import chairHero from "@/assets/avior-study-chair.png.asset.json";

const saleItems = [
  { title: "Accent Chairs", image: chairHero.url },
  { title: "Side Tables", image: livingHero.url },
  { title: "Dining Picks", image: diningHero.url },
];

export function OpeningSale() {
  return (
    <section id="sale-189" className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="container-page">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <p className="mb-3 text-base font-semibold text-primary-foreground/80">Factory Direct Opening Sale</p>
            <h2 className="font-display text-5xl leading-[0.9] sm:text-6xl md:text-7xl lg:text-8xl">
              $189
            </h2>
            <p className="mt-3 text-2xl font-semibold sm:text-3xl">Furniture capped at $189.</p>
            <p className="mt-4 max-w-xl text-base text-primary-foreground/80 sm:text-lg">
              This is our sharpest price point. First-home essentials. Clean designs. No showroom markup.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#bestsellers"
                className="inline-flex h-13 items-center rounded-md bg-background px-6 text-base font-semibold text-foreground transition hover:bg-background/90"
              >
                Shop the sale
              </a>
              <a
                href="https://wa.me/6580000000"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 items-center rounded-md border border-primary-foreground/20 px-6 text-base font-semibold text-primary-foreground transition hover:bg-primary-foreground/10"
              >
                Ask what qualifies
              </a>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {saleItems.map((item) => (
              <div key={item.title} className="overflow-hidden rounded-xl bg-primary-foreground/8">
                <div className="aspect-[5/4] overflow-hidden">
                  <img src={item.image} alt={item.title} loading="lazy" className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-between p-4">
                  <p className="font-display text-2xl">{item.title}</p>
                  <p className="text-lg font-semibold">From $189</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
