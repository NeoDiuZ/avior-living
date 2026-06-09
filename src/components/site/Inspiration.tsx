import bedroom from "@/assets/avior-bedroom.png.asset.json";
import dining from "@/assets/avior-dining-round.png.asset.json";
import living from "@/assets/avior-lounge-lifestyle.png.asset.json";

const tiles = [
  { src: living.url, label: "Living Room", count: "Sofas chairs consoles" },
  { src: bedroom.url, label: "Bedroom", count: "Beds side tables storage" },
  { src: dining.url, label: "Dining", count: "Dining sets benches chairs" },
];

export function Inspiration() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-3 text-base font-semibold text-accent">Shop by room</p>
          <h2 className="font-display text-4xl leading-[0.95] text-foreground sm:text-5xl md:text-6xl">
            Built for Singapore homes.
          </h2>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tiles.map((t) => (
            <a
              key={t.label}
              href="#collections"
              className="group relative block overflow-hidden rounded-xl bg-sand"
            >
              <img
                src={t.src}
                alt={t.label}
                loading="lazy"
                className="h-[420px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                <p className="font-display text-3xl leading-none sm:text-4xl">{t.label}</p>
                <p className="mt-2 text-sm font-semibold text-cream/85 sm:text-base">{t.count}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
