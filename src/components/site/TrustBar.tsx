const stats = [
  { big: "40%", small: "Below Retail" },
  { big: "10,000+", small: "Singapore Homes" },
  { big: "$0", small: "Delivery & Assembly" },
  { big: "7 Days", small: "WhatsApp Support" },
];

export function TrustBar() {
  return (
    <section aria-label="Avior Assurance" className="bg-primary text-primary-foreground">
      <div className="container-page">
        <div className="grid grid-cols-2 divide-x divide-primary-foreground/15 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.small} className="px-4 py-8 text-center md:py-10">
              <p className="font-display text-4xl leading-none tracking-tight sm:text-5xl md:text-6xl">
                {s.big}
              </p>
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.15em] text-primary-foreground/80 sm:text-sm">
                {s.small}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
