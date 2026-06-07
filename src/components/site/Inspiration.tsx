import bedroom from "@/assets/inspiration-bedroom.jpg";
import dining from "@/assets/inspiration-dining.jpg";
import living from "@/assets/inspiration-living.jpg";

const tiles = [
  { src: bedroom, label: "Master Bedroom", tag: "Tampines BTO · 4-Room" },
  { src: dining, label: "Dining Nook", tag: "Bishan Condo · 3-Bedder" },
  { src: living, label: "Living Room", tag: "Punggol BTO · 5-Room" },
];

export function Inspiration() {
  return (
    <section className="bg-cream py-20 md:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="max-w-xl">
            <span className="chip mb-3 bg-background">Real Singapore homes</span>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Home inspiration
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              See how homeowners across Singapore styled their spaces with Avior. Tag us
              <span className="font-medium text-foreground"> #AviorAtHome</span> to be featured.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {tiles.map((t) => (
            <figure
              key={t.label}
              className="group relative overflow-hidden rounded-2xl bg-sand"
            >
              <img
                src={t.src}
                alt={`${t.label} — ${t.tag}`}
                loading="lazy"
                className="h-[420px] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between bg-gradient-to-t from-black/60 to-transparent p-5 text-background">
                <div>
                  <p className="font-display text-xl text-cream">{t.label}</p>
                  <p className="text-xs text-cream/80">{t.tag}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
