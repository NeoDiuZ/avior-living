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
          ["Return window", "Contact via WhatsApp for current policy", "30 days, 20% restocking fee deducted from refund"],
          ["Warranty", "2 years on manufacturing defects, hardware, and surface issues", "Varies by product category, per Castlery's published warranty page"],
          ["Support channel", "WhatsApp, response within 1 business day", "Email (help.sg@castlery.com)"],
        ],
      },
      {
        type: "callout",
        text: "Avior's return policy is being finalized and will be published here once live. Until then, reach out on WhatsApp before ordering if return terms are a deciding factor.",
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
