/**
 * Commercial terms shown on /vendors. The design leaves these as placeholders, so the
 * paid-plan prices and deal limit below are the ones the previous /vendors page published.
 * Set `launchOffer` to a string (e.g. "3 months of Growth free") to show the founding-venue banner.
 */
export const PRICING = {
  growth: "LKR 4,900",
  pro: "LKR 9,900",
  starterDeals: 2,
  launchOffer: null as string | null,
};

export const SECTIONS = [
  { id: "bid-room", label: "The Bid Room" },
  { id: "pricing", label: "Pricing" },
  { id: "faq", label: "FAQ" },
];

/* ── Hero: Bid Room simulator ── */

export type OfferOption = { id: string; label: string; value: number };

export const OFFERS: OfferOption[] = [
  { id: "starter", label: "Free starter platter", value: 1 },
  { id: "discount", label: "20% off the bill", value: 2 },
  { id: "round", label: "Free first round for 4 before 8 PM", value: 3 },
  { id: "table", label: "Rooftop table held + first round free", value: 4 },
];

// Anonymous rival bids on the same Beacon. Your venue is closest, which is worth a small edge.
export const RIVALS = [
  { id: "b", name: "Venue B", km: 1.9, offer: "20% off the bill", value: 2 },
  { id: "c", name: "Venue C", km: 2.6, offer: "Free first round, all night", value: 3.2 },
];
export const PROXIMITY_EDGE = 0.3;

/* ── Pay per guest ── */

export const PAY_POINTS = [
  { title: "Scan-verified", body: "Staff scan the guest's QR pass on any phone. The visit is logged the moment they walk in." },
  { title: "A flat fee, not a cut", body: "No percentage of the bill. You know the cost of every guest before you bid." },
  { title: "No-shows cost nothing", body: "If nobody scans in, nothing is charged. The risk stays with us, not you." },
];

/* ── Bid Room ── */

export const BID_ROOM_POINTS = [
  "Only Beacons that match your vibe reach you, so no wrong crowd",
  "Closer venues have an edge, farther ones bid a little more",
  "Quiet hour? Bid harder. Full house? Let it pass.",
  "You only pay when the group is scanned in",
];

export const INBOX = [
  { id: "g4", title: "Group of 4 · after work", meta: "LKR 3–5k each · #rooftop #cocktails · 1.2 km", seconds: 108 },
  { id: "c2", title: "Couple · date night", meta: "LKR 6–8k each · #rooftop #finedining · 2.4 km", seconds: 37 },
  { id: "g8", title: "Group of 8 · birthday", meta: "LKR 2–3k each · #party #livemusic · 0.9 km", seconds: 214 },
];

/* ── Deals ── */

export const DEAL_OFFERS = ["20% off mains", "2-for-1 cocktails", "Free dessert with any main"];
export const DEAL_WINDOWS = ["5:00 – 7:00 PM", "6:00 – 8:00 PM", "9:00 – 11:00 PM"];
export const DEAL_TAGS = ["#afterwork", "#datenight", "#latenight"];

export const DEAL_POINTS = [
  "Set the offer, the time window and how many claims",
  "A push goes to matching diners within about 2 km",
  "Guests see a live countdown and how many are left",
];

/* ── Menu intelligence ── */

export type Verdict = "Promote" | "Keep" | "Retune" | "Drop?";

export const MENU = [
  { name: "Grilled kingfish", up: 142, down: 8, verdict: "Promote" as Verdict, tip: "Your strongest dish. Put it in tonight's bid: “free kingfish starter for the table”." },
  { name: "Wood-fired flatbread", up: 98, down: 12, verdict: "Keep" as Verdict, tip: "Steady and loved. No action needed." },
  { name: "Tamarind prawn curry", up: 63, down: 44, verdict: "Retune" as Verdict, tip: "Split opinion. Worth a tasting with your chef before it starts to drag." },
  { name: "Chicken kottu (old recipe)", up: 31, down: 40, verdict: "Drop?" as Verdict, tip: "More downvotes than upvotes. It may be quietly costing you regulars." },
];

/* ── Onboarding ── */

export const ONBOARDING = [
  { title: "Claim your profile", body: "Name, location, hours, photos, and the vibe tags that decide which Beacons reach you.", time: "15 min" },
  { title: "Send your menu", body: "A PDF, a photo or a spreadsheet. We upload it and you approve it.", time: "2 min" },
  { title: "Lay out your floor", body: "Drag sections and tables onto a floor plan. About ten minutes.", time: "10 min" },
  { title: "Show staff the scan", body: "One phone, one scan per guest. That's the whole training.", time: "1 min" },
];

/* ── Pricing ── */

export const PLANS = [
  {
    id: "starter",
    name: "Starter",
    tagline: "Get on the map",
    price: "Free",
    cadence: "always",
    features: [
      "Venue page with photos and vibe tags",
      "Receive and bid on Beacons",
      "Table reservations with QR entry",
      "Menu with dish ratings",
      `Up to ${PRICING.starterDeals} active deals`,
    ],
    cta: "List free",
    featured: false,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Win more tables",
    price: PRICING.growth,
    cadence: "/ month",
    features: [
      "Everything in Starter",
      "Unlimited deals and events",
      "Priority placement on the map",
      "Menu and bid analytics",
      "Push to your followers",
    ],
    cta: "Start with Growth",
    featured: true,
    badge: "Most venues",
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Be the first name they see",
    price: PRICING.pro,
    cadence: "/ month",
    features: [
      "Everything in Growth",
      "Featured placement and badge",
      "Customer insights and reports",
      "Multi-branch management",
      "Dedicated support",
    ],
    cta: "Start with Pro",
    featured: false,
  },
];

export const ADD_ONS = [
  { name: "Boosted deal push", price: "LKR 1,500", body: "Alert every diner in a radius you choose. Up to 2 a week." },
  { name: "Featured event, 48 h", price: "LKR 3,500", body: "Pinned to the top of the Events tab." },
  { name: "Promoted listing, 7 days", price: "LKR 5,000", body: "A top-3 spot on the map near you." },
];

/* ── FAQ ── */

export const VENDOR_FAQS = [
  { q: "Which Beacons will I see?", a: "Only groups nearby whose vibe matches your tags. A date-night couple looking for fine dining won't be sent to a sports bar." },
  { q: "What does a winning bid cost?", a: "You set your offer. A fee applies only when the group is scanned in at your door, and you see it before you bid." },
  { q: "Do I need new equipment?", a: "No. You run everything from a browser, and staff scan guests with any smartphone." },
  { q: "What if a guest doesn't show up?", a: "Nothing is charged. Fees only apply to guests who are scanned in at your venue." },
  { q: "Is there a contract?", a: "No. Starter is free for good, and paid plans are month to month." },
];
