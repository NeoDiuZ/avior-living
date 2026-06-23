# Avior Living — SEO + AI-SEO (GEO) Strategy

## Context

Avior Living is a Singapore D2C factory-direct furniture brand (live at `aviorliving.com`, Next.js 15 + Shopify Storefront API, hosted on Vercel) positioning against Castlery, FortyTwo, and Muji on price (40% off retail) while matching or beating them on service (free delivery/assembly/disposal, 2-year warranty, WhatsApp support — the "Avior Assurance" bundle). There's a flat **$219 opening-sale** across multiple categories, ending **31 Jul 2026**. The goal is to dominate organic search for terms like "affordable furniture Singapore" / "furniture for compact living Singapore" **and** to get surfaced/recommended by AI answer engines (ChatGPT, Claude, Gemini, Perplexity) — both classic SEO and the emerging discipline of GEO (Generative Engine Optimization).

Research (4 parallel tracks: codebase audit, technical/local SEO, AI-SEO/GEO, SG market & competitor sentiment) plus direct file verification surfaced three things that reshape the approach:

1. **The codebase has almost no SEO infrastructure** — no sitemap, robots.txt, structured data, canonical URLs, or `next/image` — but the underlying brand messaging and FAQ content are already strong and reusable.
2. **Trust, not price, is the binding constraint.** A 2025 TikTok-livestream furniture scam burned 30+ SG buyers for $40k+ using the exact trust signals (real warehouse, deposits, social proof) a new D2C brand naturally leans on. Avior currently has ACRA/UEN registration but **no public address and no written return policy** — a real gap, not just a perception problem.
3. **The user's original plan to host comparison blogs on a separate, seemingly-independent site is the wrong shape for the goal.** Third-party-style content genuinely outperforms on-site self-promotion (research confirms this for both SEO and GEO), but an *undisclosed* second site secretly owned by Avior is exactly the "self-serving listicle" / "reciprocal promotional arrangement" pattern Google's 2025 spam updates target, and exactly the shill pattern SG forums (RenoTalk, HardwareZone) call out on sight. This plan replaces it with a **disclosed** Avior-published editorial site, which keeps the SEO/content benefits without the detection/reputation risk.

Two real bugs were also found and are fixed as part of Phase 0: the announcement bar says "$189" instead of the actual flat $219 sale price, and two places in the codebase (`FAQ.tsx`, `ProductContent.tsx`) say "1-year warranty" when the real warranty (per `Hero.tsx` and the business owner) is 2 years.

---

## Phase 0 — Technical SEO foundation (implementing now, this session)

**New files:**
- `src/lib/seo/config.ts` — `SITE_URL` (from `NEXT_PUBLIC_SITE_URL`, falls back to `https://aviorliving.com`), plus business constants for JSON-LD: `BUSINESS_LEGAL_NAME = "Avior Living Pte Ltd"` (matches `Footer.tsx`), `BUSINESS_UEN`/`RETURN_POLICY_URL` left `undefined` with TODO comments (omitted from schema until real, never filled with placeholder text — a fake value in live JSON-LD is worse than an absent field).
- `src/lib/seo/jsonld.ts` — typed builder functions: `buildOrganizationJsonLd()`, `buildProductJsonLd(input)`, `buildBreadcrumbJsonLd(items)`, `buildFaqPageJsonLd(faqs)`. Plain objects, no schema-dts dependency needed.
- `src/components/seo/JsonLd.tsx` — one shared `<script type="application/ld+json">` renderer (with `<`→`<` escaping, since product titles/descriptions are Shopify-admin-editable content rendered via `dangerouslySetInnerHTML`).
- `src/app/sitemap.ts` — static routes + every product handle via a new `getAllProductHandles()` export added to `client.ts` (loops `PAGINATED_PRODUCTS_QUERY` at `first: 250` across pages — catalog is low hundreds of SKUs, nowhere near the 50k/file cap, so a single flat array is sufficient; no `generateSitemaps()` pagination needed).
- `src/app/robots.ts` — allow all, disallow `/api/*` and `/*?sale=*`, point at the sitemap.

**Key decisions:**
- **Canonical for `/product/[handle]?sale=opening`:** always canonicalize to the bare `/product/[handle]` URL and disallow `?sale=*` in robots.txt. The $219 price is a UI-only override of the same Shopify product/variant — there's no distinct entity for the sale-tagged URL to represent, and it's explicitly temporary (sale ends 31 Jul 2026). Product JSON-LD on the canonical URL reflects the real Shopify variant price, since that's what the indexed/canonical resource actually shows.
- **`Organization` schema now, not `LocalBusiness`.** `LocalBusiness` needs a real address to be eligible for any rich-result/local-pack value — shipping it without one is inert at best, spammy-looking at worst. Ship `Organization` (legal name, logo, URL) today; switching to `LocalBusiness`/`FurnitureStore` + address is a one-line follow-up once a real address exists.
- **`getAllProductHandles()`** must call `storefrontApiRequest` defensively — that function calls `sonner`'s `toast.error()` on a Shopify 402 (billing-lapse) response, which is a client-only toast call. In the new server-only sitemap path, treat a `null` result as "skip these pages," not a thrown error, so a Shopify billing issue degrades the sitemap rather than failing the build.

**Modified files:**
- `src/app/layout.tsx` — add `metadataBase: new URL(SITE_URL)` (makes every relative OG/canonical URL sitewide resolve correctly) + render `<JsonLd data={buildOrganizationJsonLd()} />`.
- `src/app/product/[handle]/page.tsx` — rewrite `generateMetadata` to fetch the real product (reusing `storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle })`, the same pair `ProductContent.tsx` already uses) and return the real `product.title`, a description derived from `product.description` (word-safe truncation, ~155 chars, never invented copy), and `openGraph.images` from the product's first image. Add `alternates.canonical` (relative path is fine given `metadataBase`). Add `Product` + `BreadcrumbList` JSON-LD from the same fetch.
- `next.config.ts` — add `images.remotePatterns` for `cdn.shopify.com` (required before any Shopify-sourced image can use `next/image`).
- `src/components/site/Hero.tsx` — convert the hero `<img>` to `next/image` with `priority` (this is the homepage LCP element — the single highest-leverage Core Web Vitals fix available).
- `src/app/product/[handle]/_components/ProductContent.tsx` — convert the main product image (not the 4 thumbnails) to `next/image` with `priority`, since it's the PDP's LCP element and PDPs are the pages SEO traffic will land on directly. Fix the stale "1-year warranty" fallback text (line ~431) to "2-year warranty." Add visible breadcrumb UI near the top.
- `src/components/site/FAQ.tsx` — fix "1-year warranty" → "2-year warranty" in the warranty FAQ entry; render `<JsonLd data={buildFaqPageJsonLd(faqs)} />` inline (check for `"use client"` first — if absent, this is a clean server-side addition right next to the visible accordion so content and schema can't drift apart).
- `src/components/site/AnnouncementBar.tsx` — fix hardcoded `"$189"` → `"$219"`.
- `src/app/products/page.tsx` and the 4 room/sale `page.tsx` files (`living-room`, `bedroom`, `dining-room`, `opening-sale`) — add visible breadcrumb + matching `BreadcrumbList` JSON-LD (these are server components, so schema renders directly here even though the listing UI itself lives in a client component).

**Explicitly deferred (not this pass, no urgency):** converting `ProductCard.tsx` grid thumbnails and PDP gallery thumbnails to `next/image` — these are below-the-fold/secondary, several already have `loading="lazy"` set correctly, and bundling a 5-file mechanical image pass into the same PR as the structured-data work adds review risk for no indexing-deadline benefit. Flagged as a fast-follow once `remotePatterns` is proven live.

**Explicitly skipped:** `llms.txt`. Research consensus (Ahrefs' 137k-site study, OtterlyAI's 90-day bot-traffic experiment, Google's Gary Illyes on record) is that no major consumer-facing AI crawler (ChatGPT, Claude, Gemini, Perplexity, Google AI Overviews) actually reads it — it only matters for AI coding agents reading developer docs, which doesn't apply here.

### Verification
- `npm run build` succeeds with no type errors.
- Visit `/sitemap.xml` and `/robots.txt` on the dev server and confirm real URLs/product handles appear.
- Run a couple of PDP and homepage URLs through Google's Rich Results Test (or paste the rendered JSON-LD into schema.org's validator) to confirm `Organization`/`Product`/`BreadcrumbList`/`FAQPage` all validate.
- Lighthouse run on homepage and one PDP — confirm LCP element is the hero/product image and is no longer flagged as render-blocking/lazy.
- Confirm `$219` and "2-year warranty" now read consistently across `AnnouncementBar`, `Hero`, `FAQ`, and `ProductContent`.

---

## Phase 1 — Trust & legitimacy content (next priority — this is the actual conversion blocker, not price)

- **Return policy**: doesn't exist yet — needs to be written (even a simple, generous policy beats none; FortyTwo's 100-day window and Castlery's tiered warranty are the local bar). I can draft policy copy once you confirm terms; this then feeds `Organization.hasMerchantReturnPolicy` in the schema already built in Phase 0.
- **ACRA/UEN**: registered but not yet displayed anywhere on-site. Add the UEN to the footer and to `Organization` JSON-LD (`taxID`) once you provide the number — this is a one-line follow-up to Phase 0's builder.
- **Public address**: none yet. Until there's a real, disclosable address, do not add one to schema or Google Business Profile (a vague/unverifiable local listing is worse than no listing — see Phase 0's `LocalBusiness` decision). Revisit this the moment a showroom/warehouse address is available.
- **Reviews**: none exist yet. The Twilio WhatsApp integration already built for the coupon flow can be extended into a simple post-delivery review request — diffuse, real reviews (Google/Trustpilot/Facebook) read as far more trustworthy to both SG buyers and AI answer engines than on-site testimonials alone.

## Phase 2 — Local SEO & measurement setup (your action required — account access)

- **Google Search Console**: verify `aviorliving.com`, submit the new sitemap, set explicit Singapore targeting under International Targeting (compensates for not having a `.sg`/`.com.sg` ccTLD).
- **Google Analytics 4 / GTM**: not installed anywhere in the codebase — needed before any of this can be measured. I can wire the tracking snippet in once you have a GA4 property ID.
- **Google Business Profile**: set up as a service-area business (no public address yet, per Phase 1) — still unlocks Maps/local visibility for "furniture singapore" type queries even without a storefront.
- **Optional, low-priority**: consider buying `aviorliving.sg` purely as a defensive 301 redirect (cheap insurance, no migration of the live `.com` site required) — `.sg`/`.com.sg` get automatic Singapore geo-association that `.com` doesn't, but Search Console's manual targeting above covers most of the gap without disrupting anything already live.

## Phase 3 — Content strategy: comparisons, buying guides, and the editorial site

**Recommendation: a disclosed Avior-published editorial/guide site** (e.g., "Avior Living Home Guide" on its own subdomain or separate Vercel project), not an undisclosed independent-looking comparison site. Same benefits you were after (comparison content lives off the main commerce domain, can take a more editorial tone, doesn't read as a sales pitch bolted onto product pages) without the risk: if a HardwareZone/Reddit user or Google's spam systems trace the WHOIS/hosting/registration back to Avior — which is discoverable — an undisclosed "independent" site that always ranks Avior #1 reads as exactly the shill pattern this market already calls out on sight, and risks both a manual action and a much worse reputational hit than just not having the content.

**Content angles, derived directly from the research** (each needs real specifics — measurements, photos, sourcing — not just "we're cheaper," per Google's 2025 stance on self-serving comparisons):
- **Castlery comparisons**: their actual weakness is fulfillment (6–8 week delivery, outsourced support), not design — lead with delivery-speed and transparency comparisons, not just price.
- **FortyTwo comparisons**: they already own the "factory-direct/no middleman" message at scale — don't repeat that claim, differentiate on curation and QC (their forums are full of defect/missing-part complaints).
- **Muji-angle content** (open lane — Muji does zero content marketing and is resented for "feel tax" pricing in SG forums): "minimalist look for less" style guides are uncontested territory.
- **HDB/BTO-specific buying guides**: sizing for lift/corridor/doorway fit, 3-room vs 4-room layouts — this is the underexploited "compact living" keyword gap vs. international retailers, and it's exactly the logistics anxiety SG forum threads independently surface.

**Format rules (serves both classic SEO and GEO simultaneously):** direct-answer opening paragraphs, FAQ sections with `FAQPage` schema (reuse the `buildFaqPageJsonLd` helper from Phase 0), comparison tables with real numbers, one concrete stat roughly every 150–200 words, author byline with a real name (not "Team Avior"). Favor more frequent, narrower, fact-dense posts over occasional exhaustive guides — this matches what gets cited by AI answer engines, not just what classic SEO guides recommend.

## Phase 4 — AI-SEO/GEO & community presence

- **Third-party placement over self-publishing**: pitch Singapore home/lifestyle blogs (Home & Decor SG, Renopedia, Renonation, Renodots) for inclusion in existing "affordable furniture Singapore" roundups — being mentioned in content AI engines already cite is worth more than any amount of self-published content.
- **Reddit/HardwareZone**: authentic, disclosed participation only — answer real sizing/delivery/assembly questions as a clearly-identified Avior rep, never undisclosed promotion. Research confirms AI engines (especially Perplexity) cite old, settled, low-upvote threads for years — this is a long-game channel, not a launch-week tactic, and astroturfing is both against community norms (RenoTalk/HardwareZone call out shill accounts immediately) and explicitly flagged as a detection target by practitioners.
- **Monitoring**: Otterly.ai (~$29/mo entry tier) to track presence across ChatGPT/Perplexity/Gemini/AI Overviews for a fixed prompt set ("affordable furniture singapore," "furniture for small HDB flat," etc.) — the AI-era equivalent of rank tracking.

## Phase 5 — Opening-sale urgency tactics (deadline: 31 Jul 2026)

- Opening-sale collection page (`/products/opening-sale`) gets an `Offer` schema with an explicit `priceValidUntil: "2026-07-31"` so it doesn't read as stale/expired to crawlers as the date approaches.
- Time-sensitive content (the sale ending, specific category drops) is exactly the kind of fresh/local content that live-retrieval AI systems (Perplexity in particular) fetch and cite fastest — worth a short WhatsApp/social push timed close to the deadline, using infrastructure that already exists (Twilio).
- **Post-31 Jul plan**: decide now what happens to the $219 messaging and the opening-sale URL after the deadline (redirect to a regular-priced equivalent collection, or replace with a new offer) so there's no dead/expired-offer page sitting in the index — this should be revisited as the date approaches, not left to expire silently.

---

## What I need from you next (to move Phase 1–2 forward)
- Return policy terms (even a first draft to react to).
- The actual UEN/ACRA number, once you're comfortable publishing it.
- Confirmation of whether you want me to start drafting the first 1–2 comparison/buying-guide articles now (Phase 3) using the disclosed-editorial-site framing, or wait until Phase 0 ships.
- A domain/name preference for the editorial site if you'd like me to scaffold it.
