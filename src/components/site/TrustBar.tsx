const stats = [
  { big: "40%", small: "Save on retail" },
  { big: "$189", small: "Opening sale" },
  { big: "$0", small: "Delivery assembly disposal" },
  { big: "7 Days", small: "WhatsApp support" },
];

export function TrustBar() {
  return (
    <section aria-label="Avior value points" className="bg-primary text-primary-foreground">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.small} className="border-primary-foreground/12 px-4 py-7 text-center not-last:border-r md:py-9">
              <p className="font-display text-4xl leading-none sm:text-5xl md:text-6xl">{s.big}</p>
              <p className="mt-2 text-sm font-semibold text-primary-foreground/80 sm:text-base">{s.small}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
