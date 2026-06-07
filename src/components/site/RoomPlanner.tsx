import { Button } from "@/components/ui/button";
import { Sparkles, Ruler, Eye } from "lucide-react";
import roomImg from "@/assets/inspiration-living.jpg";

export function RoomPlanner() {
  return (
    <section id="room-planner" className="bg-background py-20 md:py-28">
      <div className="container-page">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative order-2 md:order-1">
            <div className="overflow-hidden rounded-2xl bg-sand">
              <img
                src={roomImg}
                alt="Avior Room Planner preview — visualise furniture in your Singapore home before you buy"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 right-4 flex items-center gap-2 rounded-xl border border-border bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
              <Sparkles className="h-4 w-4 text-accent" />
              <span className="text-xs font-medium">AI-powered fit & style preview</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <span className="chip mb-4">Room planner</span>
            <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
              Not sure if it'll fit?
            </h2>
            <p className="mt-4 max-w-lg text-base text-muted-foreground">
              Upload a photo of your room or share your floor plan — and see how any Avior
              piece will actually look in your home, at the right scale, before you spend
              a single cent.
            </p>

            <ul className="mt-6 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Ruler className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span>True-to-scale previews built for Singapore HDB and condo layouts.</span>
              </li>
              <li className="flex items-start gap-3">
                <Eye className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span>Try different fabrics, colours and configurations side by side.</span>
              </li>
              <li className="flex items-start gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                <span>Get pieces recommended for your space — and your budget.</span>
              </li>
            </ul>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" className="h-12 bg-primary px-6 text-primary-foreground hover:bg-primary/90">
                Try the Room Planner
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 border-foreground/15 bg-background px-6 hover:bg-secondary"
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
