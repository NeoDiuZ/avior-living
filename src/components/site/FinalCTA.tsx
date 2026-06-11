import { Button } from "@/components/ui/button";

export function FinalCTA() {
  return (
    <section className="bg-primary py-16 text-primary-foreground md:py-24">
      <div className="container-page text-center">
        <h2 className="font-display text-4xl leading-[1] tracking-tight sm:text-5xl md:text-6xl">
          Furnish Smarter
        </h2>
        <p className="mx-auto mt-4 max-w-sm text-base text-primary-foreground/70">
          Factory direct. Free delivery and assembly. No surprises.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Button
            asChild
            size="lg"
            className="h-14 bg-primary-foreground px-10 text-base font-semibold text-primary hover:bg-primary-foreground/90"
          >
            <a href="#opening-sale">Shop $189 Opening Sale</a>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="h-14 border-primary-foreground/25 bg-transparent px-10 text-base font-semibold text-primary-foreground hover:bg-primary-foreground/10"
          >
            <a href="#room-planner">Find What Fits My Home</a>
          </Button>
        </div>
        <p className="mt-6 text-sm text-primary-foreground/60">
          Need help choosing?{" "}
          <a
            href="https://wa.me/6580000000"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-primary-foreground/90 underline underline-offset-4 hover:text-primary-foreground"
          >
            Chat with us on WhatsApp
          </a>
        </p>
      </div>
    </section>
  );
}
