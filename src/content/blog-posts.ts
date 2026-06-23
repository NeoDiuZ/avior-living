export type BlogBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "callout"; text: string }
  | { type: "quote"; text: string; attribution?: string };

export interface BlogFaqEntry {
  q: string;
  a: string;
}

export interface BlogSource {
  label: string;
  url: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  dek: string;
  description: string;
  category: string;
  datePublished: string;
  // TODO: replace with a real named author before publishing - Google/AI engines
  // weight bylined, named-author content over generic "Team" attribution.
  authorName: string;
  authorRole: string;
  readTime: string;
  coverImage: string;
  coverImageAlt: string;
  blocks: BlogBlock[];
  faqs?: BlogFaqEntry[];
  sources?: BlogSource[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "avior-vs-ikea-muji-fortytwo-castlery-singapore-furniture-compared",
    title: "Avior Living vs IKEA, Muji, FortyTwo, and Castlery: The Real Cost of Furnishing a Singapore Home",
    dek: "The sticker price is only part of the bill. Delivery fees, assembly fees, lift surcharges, and return terms decide what you actually pay, and what happens if something goes wrong.",
    description:
      "A fact-checked comparison of Avior Living against IKEA, Muji, FortyTwo, and Castlery on delivery, assembly, warranty, returns, and room-planning tools.",
    category: "Comparisons",
    datePublished: "2026-06-23",
    authorName: "Avior Living Team",
    authorRole: "Avior Living Editorial",
    readTime: "9 min read",
    coverImage: "/images/hero-living-room.jpg",
    coverImageAlt: "A bright, furnished living room styled for a Singapore home",
    blocks: [
      {
        type: "p",
        text: "Furniture shopping in Singapore rarely ends at the listed price. IKEA charges by weight and floor count, FortyTwo adds delivery surcharges for certain locations, and Muji's furniture delivery fee depends on your basket size. None of that is hidden or wrong, it is just easy to miss until checkout. This comparison lays out what five Singapore furniture options actually charge and cover, using each company's own published policies.",
      },
      {
        type: "h2",
        text: "Why furniture costs what it costs",
      },
      {
        type: "p",
        text: "Most furniture in Singapore passes through four hands before it reaches your home: the factory that makes it, a distributor that imports it, a retailer that lists it, and a showroom that displays it. Each layer adds its own margin to cover staff, rent, and logistics. A showroom on Orchard Road or in a mall is one of the largest fixed costs a furniture retailer carries, and it gets paid for in the price tag regardless of whether you ever visit it. Avior sources directly from the same factories that supply established brands and skips the distributor and showroom layers entirely, which is reflected in pricing roughly 40% below typical retail.",
      },
      {
        type: "h2",
        text: "Delivery and assembly, line by line",
      },
      {
        type: "table",
        headers: ["", "Avior Living", "IKEA (SG)", "Muji (SG)", "FortyTwo (SG)", "Castlery (SG)"],
        rows: [
          ["Delivery", "Free, 5-10 business days", "$35 home delivery, or $5-15 for small parcels", "Charged below $250 in the Furniture Department", "$9.90-$35 depending on cart, plus a $30 surcharge for select locations", "2-4 weeks for in-stock items"],
          ["Assembly", "Free, included on every order", "10-20% of product retail price, or $35 call-out fee for a separate trip", "Not publicly specified for furniture", "Free on most products; fee stated per item if not included", "Availability varies by product"],
          ["No-lift / upper-floor delivery", "Included, no surcharge per Avior's published delivery terms", "+$20 if no lift access from the 3rd floor up", "Not publicly specified", "First non-lift floor free, then $10 per item per floor after that", "Not publicly specified"],
          ["Warranty", "2 years on manufacturing defects, hardware, and surface issues", "Varies by product, per individual guarantee documents", "Not publicly specified for furniture", "Up to 10 years on manufacturing defects (select mattresses up to 20 years)", "Varies by product category"],
          ["Returns", "On the spot, before our delivery team leaves; final after that", "365 days with proof of purchase, unassembled, original packaging", "Not publicly specified for furniture", "100 days; refund excludes delivery and assembly fees already paid", "30 days, 20% restocking fee deducted from refund"],
          ["Support channel", "WhatsApp, response within 1 business day", "Phone and online contact form", "In-store or email", "Help centre and email", "Email (help.sg@castlery.com)"],
        ],
      },
      {
        type: "callout",
        text: "Avior's return window is short by design: inspect your furniture while the delivery team is still there and flag any issue before they leave. Read the full return policy for details. It's the trade-off for a flat, no-surcharge price.",
      },
      {
        type: "h2",
        text: "Plan before you buy: the Room Planner",
      },
      {
        type: "p",
        text: "IKEA's Kreativ tool lets you scan your own room and try products in a virtual version of it, which is a genuinely useful AR feature. Avior's Room Planner takes a more direct route for a smaller catalogue: upload your actual floor plan, then place pieces from Avior's exact in-stock range to scale against your real room dimensions, no app download or room scan required. Neither Muji, FortyTwo, nor Castlery publish a comparable planning tool today.",
      },
      {
        type: "quote",
        text: "Knowing a sofa fits before you order it removes the single most common reason furniture gets returned: it simply didn't fit the space.",
      },
      {
        type: "p",
        text: "The Room Planner is visual guidance, not a substitute for measuring your own doorways and corridors, but it catches the obvious mismatches (a sofa too long for the wall, a bed frame too wide for the room) before you commit to an order.",
      },
      {
        type: "h2",
        text: "What 'cheap' actually means at Avior",
      },
      {
        type: "p",
        text: "Avior's opening sale prices a flat $219 across multiple categories, ending 31 July 2026. The number on the page is the number you pay: delivery, assembly, and packaging disposal are already included, so there's no surcharge added at checkout the way there can be with a lift-access fee or a delivery-distance charge elsewhere. That bundle, free delivery, free assembly, free disposal, a 2-year warranty, and WhatsApp support with a 1-business-day response, is what Avior calls the Avior Assurance: the cost of using the product is covered, even if the upfront sticker price is lower than competitors who charge several of those items separately.",
      },
      {
        type: "h2",
        text: "Which option actually fits",
      },
      {
        type: "list",
        items: [
          "Want the longest return window and don't mind a higher starting price: IKEA's 365-day policy is the most generous of the five.",
          "Want the longest warranty: FortyTwo's up to 10-year manufacturing warranty is the longest published figure here.",
          "Want price transparency with delivery, assembly, and disposal already factored into the listed price: that's the model Avior is built around.",
          "Want to check fit before ordering without downloading an app: Avior's Room Planner works from your own floor plan upload.",
        ],
      },
    ],
    faqs: [
      {
        q: "Does IKEA charge for furniture assembly in Singapore?",
        a: "Yes. Per IKEA Singapore's published assembly service page, the fee is 20% of the original retail price for most furniture and 10% for sofas and sofa beds, with a separate $35 call-out fee if you book assembly as its own trip.",
      },
      {
        q: "How long is FortyTwo's furniture warranty?",
        a: "FortyTwo publishes warranty coverage of up to 10 years on manufacturing defects and missing components, with select mattresses covered up to 20 years by the manufacturer.",
      },
      {
        q: "Is delivery free with Avior Living?",
        a: "Yes. Delivery, assembly, and packaging disposal are included at no extra charge on every order, with most in-stock items delivered within 5-10 business days.",
      },
      {
        q: "Does Avior have a return policy?",
        a: "Yes. Avior's return window is on the spot: inspect your furniture while the delivery team is still there and let them know before they leave if you want to return it, with no return fee. Once the team has left, the order is final.",
      },
    ],
    sources: [
      { label: "IKEA Singapore - Delivery Services", url: "https://www.ikea.com/sg/en/customer-service/services/delivery/" },
      { label: "IKEA Singapore - Assembly Service", url: "https://www.ikea.com/sg/en/customer-service/services/assembly/" },
      { label: "IKEA Singapore - 365 Day Return Policy", url: "https://www.ikea.com/sg/en/customer-service/returns-claims/return-policy/" },
      { label: "IKEA - Design and Planning Tools (Kreativ)", url: "https://www.ikea.com/us/en/planners/" },
      { label: "Muji Singapore - Delivery Charge", url: "https://www.muji.com/sg/blog/topics/delivery-charge/" },
      { label: "FortyTwo Help Centre - Delivery Fee", url: "https://support.fortytwo.sg/hc/en-us/articles/201882229-How-much-is-the-Delivery-Fee" },
      { label: "FortyTwo Help Centre - Return and Refund Policy", url: "https://support.fortytwo.sg/hc/en-us/articles/202731345-What-is-your-Return-and-Refund-Policy" },
      { label: "FortyTwo - New and Improved Warranty", url: "https://www.fortytwo.sg/new-and-improved-warranty" },
      { label: "Castlery Singapore - Delivery", url: "https://www.castlery.com/sg/delivery" },
      { label: "Castlery Singapore - Sales and Refunds", url: "https://www.castlery.com/sg/sales-and-refunds" },
    ],
  },
  {
    slug: "avior-vs-castlery-delivery-price-returns-compared",
    title: "Avior Living vs Castlery: Delivery Speed, Pricing, and Returns Compared",
    dek: "Two Singapore direct-to-consumer brands, two different bets on what matters more: how fast it arrives, or how easily you can send it back.",
    description:
      "A fact-checked comparison of Avior Living and Castlery on delivery time, pricing, returns, and warranty for Singapore furniture buyers.",
    category: "Comparisons",
    datePublished: "2026-06-23",
    authorName: "Avior Living Team",
    authorRole: "Avior Living Editorial",
    readTime: "6 min read",
    coverImage: "/images/inspiration-living.jpg",
    coverImageAlt: "A furnished Singapore living room with a sofa and coffee table",
    blocks: [
      {
        type: "p",
        text: "Avior Living and Castlery both sell direct-to-consumer furniture in Singapore, but they differ most on delivery speed and how returns are handled. Avior delivers in-stock items in 5-10 business days with free assembly and disposal included. Castlery's own site states 2-4 weeks for in-stock items, with a 30-day return window subject to a 20% restocking fee. Below is a line-by-line breakdown using each company's own published policies.",
      },
      {
        type: "h2",
        text: "Delivery time",
      },
      {
        type: "p",
        text: "Castlery publishes a 2-4 week delivery window for in-stock furniture on its own Singapore site, and customer reviews on Trustpilot describe both smooth on-time deliveries and, less often, delays beyond that window. Avior's standard delivery window for in-stock items is 5-10 business days, with a confirmation WhatsApp message sent immediately after checkout and a delivery-window update closer to the date.",
      },
      {
        type: "quote",
        text: "A 5-10 business day window is the difference between furnishing around your move-in date and furnishing around the delivery's schedule.",
      },
      {
        type: "h2",
        text: "Pricing model",
      },
      {
        type: "p",
        text: "Avior sources directly from the same factories that supply established Singapore brands and removes the distributor-and-showroom layer, which is reflected in pricing roughly 40% below typical retail. Castlery operates its own DTC model as well, with pricing positioned as a mid-range alternative to traditional showroom retailers. Both brands compete on cutting out a traditional showroom markup. The difference shows up more in delivery speed and service inclusions than in the pricing model itself.",
      },
      {
        type: "h2",
        text: "Returns and warranty",
      },
      {
        type: "table",
        headers: ["", "Avior Living", "Castlery (SG)"],
        rows: [
          ["Delivery (in-stock)", "5-10 business days", "2-4 weeks"],
          ["Delivery, assembly, disposal", "All included free", "Delivery fees vary by order; assembly availability varies by product"],
          ["Return window", "On the spot, before our delivery team leaves; final after that", "30 days, 20% restocking fee deducted from refund"],
          ["Warranty", "2 years on manufacturing defects, hardware, and surface issues", "Varies by product category, per Castlery's published warranty page"],
          ["Support channel", "WhatsApp, response within 1 business day", "Email (help.sg@castlery.com)"],
        ],
      },
      {
        type: "callout",
        text: "Avior's return window closes when the delivery team leaves, so inspect your furniture and raise any issue on the spot. Castlery's 30-day window is longer but carries a 20% restocking fee. Read the full return policy for details.",
      },
      {
        type: "h2",
        text: "Which one fits your timeline",
      },
      {
        type: "p",
        text: "If you're furnishing against a hard move-in date, such as a BTO handover or a lease start, a 5-10 business day delivery window is the more predictable option versus a 2-4 week window that some customers report stretching further. If a longer, fee-bearing return window matters more to you than delivery speed, Castlery's 30-day policy gives you that flexibility, at the cost of a 20% restocking fee on anything sent back.",
      },
    ],
    faqs: [
      {
        q: "Is Castlery more expensive than Avior Living?",
        a: "Both brands sell direct-to-consumer and avoid traditional showroom markups. Avior's pricing is positioned roughly 40% below typical retail by sourcing directly from factory; exact price comparisons depend on the specific piece, so it's worth comparing equivalent products directly.",
      },
      {
        q: "Does Castlery charge for returns?",
        a: "Yes. Per Castlery's published Sales and Refunds policy, returns must be requested within 30 days of delivery and a 20% restocking fee is deducted from the refund.",
      },
      {
        q: "How long does Avior Living take to deliver?",
        a: "Most in-stock items are delivered within 5-10 business days, with a confirmation WhatsApp sent right after checkout and a delivery window confirmed closer to the date.",
      },
    ],
    sources: [
      { label: "Castlery Singapore - Delivery", url: "https://www.castlery.com/sg/delivery" },
      { label: "Castlery Singapore - Sales and Refunds", url: "https://www.castlery.com/sg/sales-and-refunds" },
      { label: "Castlery Singapore - Product Warranty", url: "https://www.castlery.com/sg/warranty" },
    ],
  },
  {
    slug: "hdb-bto-furniture-buying-guide-sizing-lift-access",
    title: "The HDB & BTO Furniture Buying Guide: Sizing, Lift Access, and What Actually Fits",
    dek: "The two things that derail most furniture orders in Singapore aren't style or price. They're doorway width and lift access.",
    description:
      "A practical sizing guide for furnishing HDB and BTO flats in Singapore: doorway widths, lift access timing, and 3-room vs 4-room layout tips.",
    category: "Buying Guides",
    datePublished: "2026-06-23",
    authorName: "Avior Living Team",
    authorRole: "Avior Living Editorial",
    readTime: "7 min read",
    coverImage: "/images/inspiration-bedroom.jpg",
    coverImageAlt: "A compact, well-organised bedroom in a Singapore HDB flat",
    blocks: [
      {
        type: "p",
        text: "A sofa that looks right in a showroom can be physically impossible to get through a standard HDB corridor unit door, and furniture ordered without confirming lift booking windows can sit in a delivery queue for weeks. Here's how to plan around both.",
      },
      {
        type: "h2",
        text: "Standard HDB doorway and corridor widths",
      },
      {
        type: "p",
        text: "Most HDB unit entrance doors are around 850mm-900mm wide, and internal bedroom doors are often narrower, around 700mm-800mm. Corridor units add a second constraint: the common corridor width and any turns near the lift lobby. Before ordering anything large, such as a 3-seater sofa, a queen bed frame, or a wide wardrobe, check the product's packed dimensions, not just the assembled dimensions, against your narrowest doorway, not just your front door.",
      },
      {
        type: "quote",
        text: "Measure the narrowest doorway between the lift and the room, not the front door. That's the dimension that actually decides whether a piece gets in.",
      },
      {
        type: "h2",
        text: "Lift booking and delivery timing",
      },
      {
        type: "p",
        text: "Many HDB blocks require residents to book the lift in advance for large deliveries, particularly for upper floors or blocks without a dedicated cargo lift. If you're coordinating a BTO move-in, confirm your block's lift booking process with your Town Council or MCST before locking in a delivery date. A furniture delivery scheduled without a matching lift booking is the single most common cause of last-minute rescheduling.",
      },
      {
        type: "h2",
        text: "3-room vs 4-room layouts: what changes",
      },
      {
        type: "list",
        items: [
          "3-room flats (typically 60-65 sqm): bedrooms often fit a queen bed only if a wardrobe is kept compact or built-in; a loft bed or storage bed frees significant floor area in the second bedroom.",
          "4-room flats (typically 90-95 sqm): more flexibility for a full dining set plus a 3-seater sofa, but living rooms are still narrower than condo equivalents. Measure the distance from sofa-back to TV console wall before buying a deep-seat sofa.",
          "Both layouts: corridor and lift-lobby width near the unit, not just the unit's internal floor area, is what actually determines whether a piece can be delivered intact.",
        ],
      },
      {
        type: "h2",
        text: "Checking fit before you order",
      },
      {
        type: "p",
        text: "Avior's Room Planner lets you upload a floor plan or enter your room dimensions to visualise how a specific piece sits in your space before ordering. It's a useful first pass, but always cross-check the listed product dimensions against your actual doorway and corridor measurements. Visualisation tools account for floor area, not always door swing and corridor turns.",
      },
    ],
    faqs: [
      {
        q: "What's the standard HDB bedroom doorway width?",
        a: "Internal bedroom doors in most HDB flats are typically around 700mm-800mm wide. Always measure your specific unit, since older and newer HDB designs vary.",
      },
      {
        q: "Do I need to book the lift for furniture delivery in an HDB block?",
        a: "Many blocks require advance lift booking for large deliveries, especially on upper floors. Check with your Town Council or MCST ahead of your delivery date to avoid rescheduling.",
      },
      {
        q: "Is a loft bed worth it for a 3-room flat?",
        a: "If the second bedroom needs to double as storage or a study, a loft bed frees up significant floor area compared to a standard bed frame plus wardrobe combination.",
      },
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}
