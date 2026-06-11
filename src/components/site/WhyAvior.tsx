import type { LucideIcon } from "lucide-react";
import {
  Building2,
  Package,
  Store,
  Warehouse,
  TrendingUp,
  Zap,
  TrendingDown,
  X,
  Check,
} from "lucide-react";

type Step = { icon: LucideIcon; label: string; markup?: boolean };

const traditionalSteps: Step[] = [
  { icon: Building2, label: "Factory" },
  { icon: Package,   label: "Distributor", markup: true },
  { icon: Store,     label: "Retailer",    markup: true },
  { icon: Warehouse, label: "Showroom",    markup: true },
  { icon: TrendingUp, label: "You Pay More" },
];

const aviorSteps: Step[] = [
  { icon: Building2,    label: "Factory" },
  { icon: Zap,          label: "Avior Living" },
  { icon: TrendingDown, label: "You Save 40%" },
];

export function WhyAvior() {
  return (
    <section id="why-avior" className="bg-cream py-20 md:py-28">
      <div className="container-page">

        {/* Section header */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
            Why Avior
          </p>
          <h2
            className="font-display font-bold leading-[0.95] tracking-tight text-balance"
            style={{ fontSize: "clamp(2.75rem, 7vw, 5rem)" }}
          >
            Same factories.
            <br />
            <span className="text-accent">Half the price.</span>
          </h2>
          <p className="mt-5 text-base text-foreground/60 text-balance sm:text-lg">
            We cut out every middleman so the savings go straight to you.
          </p>
        </div>

        {/* Comparison card — double-bezel architecture */}
        <div className="mt-12 rounded-[1.75rem] p-[6px] ring-1 ring-border bg-border/50">
          <div className="overflow-hidden rounded-[1.35rem] border border-border bg-background">
            <div className="grid grid-cols-1 sm:grid-cols-2">

              {/* Avior column — first on mobile, second on desktop */}
              <div className="order-first sm:order-last flex flex-col border-b border-border sm:border-b-0 sm:border-l">
                <Column
                  className="flex-1"
                  title="Avior Living"
                  steps={aviorSteps}
                  price="$1,499"
                  priceLabel="You Pay"
                />
              </div>

              {/* Competitors column — second on mobile, first on desktop */}
              <div className="order-last sm:order-first flex flex-col">
                <Column
                  className="flex-1"
                  title="Local Competitors"
                  bad
                  steps={traditionalSteps}
                  price="$2,499"
                  priceLabel="You Pay"
                />
              </div>

            </div>
          </div>
        </div>

        {/* You Save banner */}
        <div className="relative mt-3 overflow-hidden rounded-[1.35rem] bg-accent px-6 py-10 text-center text-accent-foreground sm:py-14">
          {/* Radial glow for depth */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% 110%, oklch(1 0 0 / 0.14) 0%, transparent 70%)",
            }}
          />
          <p className="relative text-sm font-bold uppercase tracking-[0.22em] opacity-75">
            You Save
          </p>
          <p
            className="relative mt-1 font-display font-bold leading-none tracking-tight"
            style={{ fontSize: "clamp(5rem, 18vw, 10rem)" }}
          >
            $1,000
          </p>
          <p className="relative mt-4 text-lg font-medium opacity-80 sm:text-xl">
            On every sofa, every time.
          </p>
        </div>

      </div>
    </section>
  );
}

function Column({
  title,
  bad,
  steps,
  price,
  priceLabel,
  className,
}: {
  title: string;
  bad?: boolean;
  steps: Step[];
  price: string;
  priceLabel: string;
  className?: string;
}) {
  // Each step row = 2.125rem circle + 0.875rem gap (gap-3.5) = 3rem per step.
  // Line runs from center of first circle to center of last circle.
  const connectorH = `${(steps.length - 1) * 3}rem`;

  return (
    <div className={`flex flex-col p-6 sm:p-8 ${bad ? "bg-background" : "bg-accent/[0.04]"} ${className ?? ""}`}>

      {/* Column header */}
      <div className="mb-8 flex items-center gap-2.5">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
            bad
              ? "bg-foreground/8 text-foreground/40"
              : "bg-accent text-accent-foreground"
          }`}
        >
          {bad ? (
            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
          ) : (
            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
          )}
        </span>
        <h3
          className={`font-display text-2xl font-bold tracking-tight sm:text-3xl ${
            bad ? "text-foreground/45" : "text-foreground"
          }`}
        >
          {title}
        </h3>
      </div>

      {/* Steps with gradient connector line */}
      <div className="relative flex flex-col gap-3.5">
        <div
          className="pointer-events-none absolute w-px"
          style={{
            left: "1.0625rem",
            top: "1.0625rem",
            height: connectorH,
            background: bad
              ? "linear-gradient(to bottom, oklch(0.92 0.010 78 / 0.7), transparent)"
              : "linear-gradient(to bottom, oklch(0.65 0.15 44 / 0.35), transparent)",
          }}
        />

        {steps.map((step, i) => {
          const isLast = i === steps.length - 1;
          const isGood = !bad && isLast;
          const isDanger = bad && isLast;

          return (
            <div key={step.label} className="relative flex items-center gap-3">

              {/* Step icon circle */}
              <div
                className={`relative z-10 flex h-[2.125rem] w-[2.125rem] shrink-0 items-center justify-center rounded-full border ${
                  isGood
                    ? "border-accent/25 bg-accent/10 text-accent"
                    : isDanger
                      ? "border-destructive/15 bg-background text-destructive/40"
                      : bad
                        ? "border-border/50 bg-background text-foreground/28"
                        : "border-border bg-background text-foreground/45"
                }`}
              >
                <step.icon className="h-[0.9rem] w-[0.9rem]" strokeWidth={1.75} />
              </div>

              {/* Step label + markup badge */}
              <div className="flex flex-1 min-w-0 items-center justify-between gap-2">
                <span
                  className={`text-base font-semibold leading-tight sm:text-[1.0625rem] ${
                    isGood
                      ? "font-semibold text-accent"
                      : isDanger
                        ? "font-medium text-destructive/45 line-through decoration-1"
                        : bad
                          ? "font-medium text-foreground/38"
                          : "font-medium text-foreground/65"
                  }`}
                >
                  {step.label}
                </span>
                {step.markup && (
                  <span className="shrink-0 rounded-full border border-destructive/12 bg-destructive/[0.07] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-destructive/55">
                    +markup
                  </span>
                )}
              </div>

            </div>
          );
        })}
      </div>

      {/* Price */}
      <div className="mt-auto border-t border-border/60 pt-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          {priceLabel}
        </p>
        <p
          className={`mt-1 font-display font-bold leading-none tracking-tight ${
            bad ? "text-foreground/30 line-through decoration-2" : "text-accent"
          }`}
          style={{ fontSize: "clamp(2.5rem, 6vw, 3.5rem)" }}
        >
          {price}
        </p>
      </div>

    </div>
  );
}
