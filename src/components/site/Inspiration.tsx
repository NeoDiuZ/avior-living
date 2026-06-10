import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const living = "/images/inspiration-living.jpg";
const bedroom = "/images/inspiration-bedroom.jpg";
const dining = "/images/inspiration-dining.jpg";

const reviews = [
  {
    name: "Wei Ling T.",
    homeType: "BTO Owner, Tampines",
    rating: 5,
    quote:
      "Great value for furnishing our first home. Delivery was smooth and the team assembled everything quickly. The sofa looks much more premium than what we paid.",
  },
  {
    name: "Raj Subramaniam",
    homeType: "Condo Owner, Bishan",
    rating: 5,
    quote:
      "We compared a few brands and Avior offered noticeably better value. Same quality, lower price, and the packaging disposal made moving in so much easier.",
  },
  {
    name: "Sarah Ho",
    homeType: "Rental Apartment, Buona Vista",
    rating: 5,
    quote:
      "Used the room planner before ordering the bed frame. Really helpful for checking the layout in a small room. Delivery and assembly were both included, which was a huge plus.",
  },
];

const roomTiles = [
  { src: living, label: "Living Room", count: "120+ pieces" },
  { src: bedroom, label: "Bedroom", count: "80+ pieces" },
  { src: dining, label: "Dining", count: "60+ pieces" },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" strokeWidth={0} />
      ))}
    </div>
  );
}

export function Inspiration() {
  return (
    <section className="bg-cream py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-6xl">
            Loved By Singapore Homes
          </h2>
          <p className="mt-4 text-base text-foreground/65">
            Trusted by homeowners furnishing BTOs, condos and rental homes across Singapore.
          </p>
        </div>

        {/* Review cards */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reviews.map((r) => (
            <div
              key={r.name}
              className="flex flex-col rounded-3xl bg-background p-7 shadow-[0_4px_24px_-8px_rgba(60,35,15,0.12)]"
            >
              <StarRating count={r.rating} />
              <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                &ldquo;{r.quote}&rdquo;
              </blockquote>
              <div className="mt-5 border-t border-border pt-4">
                <p className="text-sm font-semibold text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.homeType}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Shop by room */}
        <div className="mt-14">
          <p className="mb-6 text-center text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Shop By Room
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {roomTiles.map((t) => (
              <a
                key={t.label}
                href="#opening-sale"
                className="group relative block overflow-hidden rounded-3xl bg-sand"
              >
                <img
                  src={t.src}
                  alt={t.label}
                  loading="lazy"
                  className="h-[280px] w-full object-cover transition-transform duration-700 group-hover:scale-105 sm:h-[360px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-cream">
                  <p className="font-display text-3xl font-semibold leading-none tracking-tight">
                    {t.label}
                  </p>
                  <p className="mt-1.5 text-xs font-semibold uppercase tracking-wider text-cream/80">
                    {t.count} available
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 text-center">
          <Button
            asChild
            size="lg"
            className="h-14 bg-primary px-10 text-base font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <a href="#opening-sale">Shop Opening Sale</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
