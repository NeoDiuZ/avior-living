"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

const steps = [
  {
    step: "1",
    title: "Upload Your Floor Plan",
    description: "PNG or JPG — takes seconds",
  },
  {
    step: "2",
    title: "Place Furniture to Scale",
    description: "Pick pieces from the Avior catalogue",
  },
  {
    step: "3",
    title: "Know Before You Buy",
    description: "Scale-accurate to your actual room",
  },
];

// Strong expo ease-out — faster initial movement, smooth settle
const EASE = "cubic-bezier(0.23, 1, 0.32, 1)";

export function RoomPlanner() {
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section id="room-planner" className="bg-background py-20 md:py-28">
      <div ref={sectionRef} className="container-page">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">

          {/* ── Left: video in browser frame ── */}
          <div
            className="relative order-2 md:order-1 motion-safe:transition-[opacity,transform] motion-safe:duration-700"
            style={{
              transitionTimingFunction: EASE,
              transitionDelay: visible ? "0ms" : "0ms",
              opacity: visible ? 1 : undefined,
              transform: visible ? "translateY(0)" : undefined,
            }}
          >
            {/* Outer wrapper handles the initial hidden state for motion users */}
            <div
              className={[
                "motion-safe:transition-[opacity,transform] motion-safe:duration-700",
                visible
                  ? "opacity-100 translate-y-0"
                  : "motion-safe:opacity-0 motion-safe:translate-y-8",
              ].join(" ")}
              style={{ transitionTimingFunction: EASE }}
            >
              {/* Browser chrome frame */}
              <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-[0_20px_60px_-4px_oklch(0_0_0_/_0.12)]">
                {/* Chrome bar */}
                <div className="flex h-9 shrink-0 items-center gap-2.5 border-b border-border bg-secondary/60 px-3.5">
                  <div className="flex gap-1.5">
                    <div className="h-2.5 w-2.5 rounded-full bg-foreground/[0.13]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-foreground/[0.13]" />
                    <div className="h-2.5 w-2.5 rounded-full bg-foreground/[0.13]" />
                  </div>
                  <div className="flex h-[18px] flex-1 items-center rounded bg-background/75 px-2.5">
                    <span className="select-none truncate text-[10px] text-muted-foreground/60">
                      aviorliving.com · Room Planner
                    </span>
                  </div>
                </div>

                {/* Autoplay video — muted + playsInline required for mobile autoplay */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block w-full"
                  aria-hidden="true"
                >
                  <source src="/videos/final.mp4" type="video/mp4" />
                </video>
              </div>

              {/* Floating badge */}
              <div className="absolute -bottom-4 left-5 flex items-center gap-1.5 rounded-full bg-accent px-3.5 py-2 text-accent-foreground shadow-lg shadow-accent/20">
                <Sparkles className="h-3.5 w-3.5 shrink-0" strokeWidth={2} />
                <span className="text-xs font-semibold tracking-wide">AI-Powered</span>
              </div>
            </div>
          </div>

          {/* ── Right: heading + timeline steps ── */}
          <div
            className={[
              "order-1 md:order-2 motion-safe:transition-[opacity,transform] motion-safe:duration-700",
              visible
                ? "opacity-100 translate-y-0"
                : "motion-safe:opacity-0 motion-safe:translate-y-8",
            ].join(" ")}
            style={{ transitionTimingFunction: EASE, transitionDelay: "120ms" }}
          >
            <h2
              className="font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-[2.75rem] lg:text-5xl"
              style={{ textWrap: "balance" } as React.CSSProperties}
            >
              Does It Fit?
            </h2>
            <p className="mt-4 max-w-[42ch] text-base text-foreground/70">
              Upload your floor plan. Place furniture to scale. Know before you buy.
            </p>

            {/* Timeline steps — vertical list with connector, not card grid */}
            <div className="mt-9">
              {steps.map(({ step, title, description }, i) => (
                <div
                  key={step}
                  className={[
                    "flex gap-4 motion-safe:transition-[opacity,transform] motion-safe:duration-500",
                    visible
                      ? "opacity-100 translate-y-0"
                      : "motion-safe:opacity-0 motion-safe:translate-y-6",
                  ].join(" ")}
                  style={{
                    transitionTimingFunction: EASE,
                    transitionDelay: visible ? `${260 + i * 55}ms` : "0ms",
                  }}
                >
                  {/* Number circle + connecting line */}
                  <div className="flex flex-col items-center">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {step}
                    </div>
                    {i < steps.length - 1 && (
                      <div className="mt-1.5 w-px grow bg-border" />
                    )}
                  </div>

                  {/* Step text */}
                  <div className={i < steps.length - 1 ? "pb-7 pt-1" : "pt-1"}>
                    <p className="text-sm font-semibold leading-snug text-foreground">
                      {title}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* CTAs */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-14 bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90 active:scale-[0.97]"
                style={{ transition: "background-color 160ms ease-out, transform 120ms ease-out" }}
                asChild
              >
                <a href="/products">Try Room Planner</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-foreground/20 bg-background px-8 text-base font-semibold hover:bg-secondary active:scale-[0.97]"
                style={{ transition: "background-color 160ms ease-out, transform 120ms ease-out" }}
                asChild
              >
                <a href="https://wa.me/6580000000" target="_blank" rel="noopener noreferrer">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4 shrink-0"
                    style={{ fill: "#25D366" }}
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              Visual guidance only. Confirm measurements before ordering.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
