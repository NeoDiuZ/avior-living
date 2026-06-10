import bedroom from "@/assets/inspiration-bedroom.jpg";
import dining from "@/assets/inspiration-dining.jpg";
import living from "@/assets/inspiration-living.jpg";

const tiles = [
  { src: living, label: "Living Room", count: "120+ pieces" },
  { src: bedroom, label: "Bedroom", count: "80+ pieces" },
  { src: dining, label: "Dining", count: "60+ pieces" },
];

export function Inspiration() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Shop By Room
          </p>
          <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-6xl md:text-7xl">
            Built for
            <br />
            <span className="text-accent">Singapore homes.</span>
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {tiles.map((t) => (
            <a
              key={t.label}
              href="#bestsellers"
              className="group relative block overflow-hidden rounded-3xl bg-sand"
            >
              <img
                src={t.src}
                alt={t.label}
                loading="lazy"
                className="h-[460px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-cream">
                <p className="font-display text-4xl leading-none tracking-tight sm:text-5xl">
                  {t.label}
                </p>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wider text-cream/85">
                  {t.count} →
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
