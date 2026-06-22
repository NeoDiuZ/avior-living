import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="bg-primary py-10 text-primary-foreground md:py-14">
      <div className="container-page text-center">
        <h2 className="font-display text-3xl font-bold leading-[1] tracking-tight sm:text-4xl md:text-5xl">
          Save 40% Off
        </h2>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 bg-primary-foreground px-8 text-sm font-semibold text-primary hover:bg-primary-foreground/90"
          >
            <a href="#opening-sale">Shop $219 Opening Sale</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-12 border-primary-foreground/25 bg-transparent px-8 text-sm font-semibold text-primary-foreground hover:bg-primary-foreground/10"
          >
            <a href="#room-planner">Find What Fits My Home</a>
          </Button>
        </div>
      </div>
    </section>
  );
}
