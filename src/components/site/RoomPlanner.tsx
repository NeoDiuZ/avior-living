import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import roomImg from "@/assets/inspiration-living.jpg";

export function RoomPlanner() {
  return (
    <section id="room-planner" className="bg-background py-16 md:py-24">
      <div className="container-page">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative order-2 md:order-1">
            <div className="overflow-hidden rounded-3xl bg-sand">
              <img
                src={roomImg}
                alt="Avior Room Planner preview"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-2xl bg-accent px-5 py-3 text-accent-foreground shadow-lg">
              <Sparkles className="h-5 w-5" />
              <span className="text-sm font-semibold uppercase tracking-wider">AI Preview</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-accent">
              Room Planner
            </p>
            <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-6xl md:text-7xl">
              Will it fit?
              <br />
              <span className="text-accent">See it first.</span>
            </h2>
            <p className="mt-5 max-w-lg text-lg font-medium text-foreground/80">
              Snap a photo. We show you exactly how it looks in your HDB or condo.
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="h-14 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90">
                Try Room Planner
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-foreground/20 bg-background px-8 text-base font-semibold hover:bg-secondary"
                asChild
              >
                <a href="https://wa.me/6580000000" target="_blank" rel="noopener noreferrer">
                  Ask on WhatsApp
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
