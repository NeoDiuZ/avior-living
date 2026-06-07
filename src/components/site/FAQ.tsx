import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How can your prices be up to 40% lower than other Singapore retailers?",
    a: "We source directly from the same factories that supply Singapore's major furniture brands — no distributors, no showrooms, no middleman markup. The savings go straight to you.",
  },
  {
    q: "Is delivery and assembly really included?",
    a: "Yes. Every order across mainland Singapore includes two-person white-glove delivery into the room of your choice, full assembly, and packaging disposal — at no extra cost.",
  },
  {
    q: "How long does delivery take?",
    a: "In-stock items are typically delivered within 5–10 working days. We'll confirm your slot over WhatsApp once your order is placed.",
  },
  {
    q: "What if the furniture doesn't fit my space?",
    a: "Use our Room Planner to visualise it before you buy, or chat with us on WhatsApp with your dimensions — we'll recommend pieces that actually work for your home.",
  },
  {
    q: "What's your warranty and returns policy?",
    a: "All Avior pieces come with a 1-year structural warranty. If something arrives damaged or isn't right, contact us within 7 days and we'll make it right.",
  },
  {
    q: "Do you serve all areas of Singapore?",
    a: "Yes — we deliver islandwide, including HDBs, condos and landed homes. Sentosa and restricted-access areas may have a small surcharge confirmed before delivery.",
  },
];

export function FAQ() {
  return (
    <section id="faq" className="bg-background py-20 md:py-28">
      <div className="container-page grid gap-12 md:grid-cols-12">
        <div className="md:col-span-4">
          <span className="chip mb-3">FAQ</span>
          <h2 className="font-display text-3xl tracking-tight sm:text-4xl md:text-5xl">
            Questions, answered.
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            Still unsure? Message us on WhatsApp — most replies come back inside 10 minutes.
          </p>
          <a
            href="https://wa.me/6580000000"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
          >
            Chat with us on WhatsApp →
          </a>
        </div>

        <div className="md:col-span-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                value={`item-${i}`}
                className="border-b border-border"
              >
                <AccordionTrigger className="py-5 text-left font-display text-lg hover:no-underline">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
