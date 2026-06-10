import { Button } from "@/components/ui/button";
import { Upload, LayoutGrid, Eye } from "lucide-react";

const roomImg = "/images/inspiration-living.jpg";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Upload Your Floor Plan",
    description: "PNG, JPG or PDF accepted",
  },
  {
    icon: LayoutGrid,
    step: "2",
    title: "Choose Your Furniture",
    description: "Select from available pieces",
  },
  {
    icon: Eye,
    step: "3",
    title: "See If It Fits",
    description: "Visual guide for your space",
  },
];

export function RoomPlanner() {
  return (
    <section id="room-planner" className="bg-background py-16 md:py-24">
      <div className="container-page">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          <div className="relative order-2 md:order-1">
            <div className="overflow-hidden rounded-3xl bg-sand">
              <img
                src={roomImg}
                alt="Avior Living room planner preview"
                loading="lazy"
                width={1024}
                height={1280}
                className="h-auto w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-primary-foreground shadow-lg">
              <span className="text-sm font-semibold uppercase tracking-wider">AI-Powered</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-[2.75rem] lg:text-5xl">
              Not Sure If It Will Fit?
            </h2>
            <p className="mt-5 max-w-lg text-base text-foreground/70 sm:text-lg">
              Upload your floor plan or room image and get a clearer idea of whether your furniture will fit before placing an order. Useful for BTOs, condos and rental homes.
            </p>

            {/* 3-step process */}
            <div className="mt-8 space-y-3">
              {steps.map(({ icon: Icon, step, title, description }) => (
                <div key={step} className="flex items-center gap-4 rounded-xl bg-secondary px-5 py-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                    {step}
                  </div>
                  <Icon className="h-5 w-5 shrink-0 text-accent" strokeWidth={1.75} />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{title}</p>
                    <p className="text-xs text-muted-foreground">{description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button
                size="lg"
                className="h-14 bg-primary px-8 text-base font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Try Find Your Fit
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
            <p className="mt-4 text-xs text-muted-foreground">
              Room planning results are for visual guidance only. Please confirm final measurements before purchase.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
