import { Button } from "@/components/ui/button";
import { Upload, LayoutGrid, Eye, Sparkles } from "lucide-react";

const roomImg = "/images/inspiration-living.jpg";

const steps = [
  {
    icon: Upload,
    step: "1",
    title: "Upload Your Floor Plan",
    description: "PNG, JPG or PDF",
  },
  {
    icon: LayoutGrid,
    step: "2",
    title: "Choose Your Furniture",
    description: "Select from the catalog",
  },
  {
    icon: Eye,
    step: "3",
    title: "See If It Fits",
    description: "Scaled to your space",
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
            <div className="absolute -bottom-5 left-5 flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2.5 text-white shadow-lg">
              <Sparkles className="h-4 w-4 shrink-0" strokeWidth={1.75} />
              <span className="text-sm font-semibold uppercase tracking-wider">AI-Powered</span>
            </div>
          </div>

          <div className="order-1 md:order-2">
            <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-[2.75rem] lg:text-5xl">
              Does It Fit?
            </h2>
            <p className="mt-4 text-base text-foreground/70">
              Upload your floor plan. See what fits before you buy.
            </p>

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
                className="h-14 bg-accent px-8 text-base font-semibold text-accent-foreground hover:bg-accent/90"
                asChild
              >
                <a href="/products">Try Room Planner</a>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 border-foreground/20 bg-background px-8 text-base font-semibold hover:bg-secondary"
                asChild
              >
                <a href="https://wa.me/6580000000" target="_blank" rel="noopener noreferrer">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0" style={{ fill: "#25D366" }}><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
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
