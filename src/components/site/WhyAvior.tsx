import { ArrowRight, X, Check } from "lucide-react";

const traditional = ["Factory", "Distributor", "Retailer", "Showroom", "You"];
const avior = ["Factory", "Avior", "You"];

export function WhyAvior() {
  return (
    <section id="why-avior" className="bg-cream py-16 md:py-24">
      <div className="container-page">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Why Avior
          </p>
          <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-6xl md:text-7xl">
            Same factories.
            <br />
            <span className="text-accent">Half the price.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <PriceFlow
            title="Everyone Else"
            steps={traditional}
            tone="muted"
            price="$2,499"
            label="Retail Price"
          />
          <PriceFlow
            title="Avior"
            steps={avior}
            tone="accent"
            price="$1,499"
            label="You Pay"
          />
        </div>

        <div className="mt-8 rounded-3xl bg-accent px-6 py-8 text-center text-accent-foreground sm:py-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] opacity-80">You Save</p>
          <p className="mt-2 font-display text-6xl leading-none tracking-tight sm:text-7xl md:text-8xl">
            $1,000
          </p>
          <p className="mt-3 text-base font-medium opacity-90 sm:text-lg">On every sofa. Every time.</p>
        </div>
      </div>
    </section>
  );
}

function PriceFlow({
  title,
  steps,
  tone,
  price,
  label,
}: {
  title: string;
  steps: string[];
  tone: "muted" | "accent";
  price: string;
  label: string;
}) {
  const isAccent = tone === "accent";
  return (
    <div
      className={`rounded-3xl p-7 md:p-9 ${
        isAccent
          ? "bg-background shadow-[0_30px_80px_-30px_rgba(170,80,40,0.35)]"
          : "bg-sand/60"
      }`}
    >
      <div className="flex items-center gap-3">
        {isAccent ? (
          <Check className="h-6 w-6 rounded-full bg-accent p-1 text-accent-foreground" />
        ) : (
          <X className="h-6 w-6 rounded-full bg-foreground/10 p-1 text-foreground/60" />
        )}
        <h3 className="font-display text-3xl tracking-tight sm:text-4xl">{title}</h3>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span
              className={`rounded-lg px-3 py-2 text-sm font-semibold sm:text-base ${
                isAccent && (s === "Avior" || s === "You")
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-foreground"
              }`}
            >
              {s}
            </span>
            {i < steps.length - 1 && (
              <ArrowRight className={`h-4 w-4 ${isAccent ? "text-accent" : "text-muted-foreground"}`} />
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-border pt-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <p
          className={`mt-1 font-display text-5xl leading-none tracking-tight sm:text-6xl ${
            isAccent ? "text-accent" : "text-foreground/50 line-through decoration-2"
          }`}
        >
          {price}
        </p>
      </div>
    </div>
  );
}
