export type { PhotoKey } from "@/components/brand/assets";
import type { PhotoKey } from "@/components/brand/assets";

export type Vibe =
  | "rooftop"
  | "chill"
  | "datenight"
  | "afterwork"
  | "livemusic"
  | "sundaybrunch"
  | "latenight"
  | "party";

export const VIBES: Vibe[] = [
  "rooftop",
  "chill",
  "datenight",
  "afterwork",
  "livemusic",
  "sundaybrunch",
  "latenight",
  "party",
];

/* ── Hero simulator ── */

export type SimVibe = "rooftop" | "livemusic" | "chill" | "datenight" | "afterwork";

export const SIM_VIBES: SimVibe[] = ["rooftop", "livemusic", "chill", "datenight", "afterwork"];

export const SIM_BUDGETS = ["2–3k", "3–5k", "5k+"];

export type Bid = {
  id: string;
  venue: string;
  km: number;
  offer: (group: number) => string;
  strength: number;
  photo: PhotoKey;
};

// Listed in arrival order; the strongest arrives second so the lead visibly changes hands.
export const SIM_BIDS: Record<SimVibe, Bid[]> = {
  rooftop: [
    { id: "st", venue: "Salt Terrace", km: 1.2, offer: () => "20% off the whole bill", strength: 2, photo: "seafood" },
    { id: "ly", venue: "Lantern Yard", km: 1.9, offer: (n) => `Free first round for ${n}, before 8 PM`, strength: 3, photo: "rooftop" },
    { id: "ud", venue: "The Upper Deck", km: 2.6, offer: () => "Free starter platter", strength: 1, photo: "fusion" },
  ],
  livemusic: [
    { id: "ly", venue: "Lantern Yard", km: 1.9, offer: () => "A welcome drink each", strength: 2, photo: "rooftop" },
    { id: "rs", venue: "Rooftop Sessions", km: 1.6, offer: (n) => `Stage-side table for ${n}, free entry`, strength: 3, photo: "culture" },
    { id: "gb", venue: "Garden Bar", km: 2.4, offer: () => "15% off food", strength: 1, photo: "cocktail" },
  ],
  chill: [
    { id: "cl", venue: "Café Luna", km: 0.8, offer: () => "2-for-1 iced coffee", strength: 2, photo: "juice" },
    { id: "tp", venue: "The Patio", km: 1.4, offer: (n) => `Dessert platter for ${n} on the house`, strength: 3, photo: "sweets" },
    { id: "gb", venue: "Garden Bar", km: 2.4, offer: () => "10% off the bill", strength: 1, photo: "cocktail" },
  ],
  datenight: [
    { id: "sr", venue: "Spice Route", km: 1.5, offer: () => "Tasting menu, 25% off", strength: 2, photo: "fusion" },
    { id: "hl", venue: "Harbour Lights", km: 1.1, offer: () => "Window table and a glass of bubbly each", strength: 3, photo: "seafood" },
    { id: "tl", venue: "The Loft", km: 2.8, offer: () => "Dessert to share, free", strength: 1, photo: "sweets" },
  ],
  afterwork: [
    { id: "st", venue: "Salt Terrace", km: 1.2, offer: () => "Free bar-bites platter", strength: 2, photo: "seafood" },
    { id: "hb", venue: "The Hangover Bar", km: 0.6, offer: (n) => `Happy hour held till 9 PM for ${n}`, strength: 3, photo: "cocktail" },
    { id: "sd", venue: "Salt & Tide", km: 2.9, offer: () => "10% off cocktails", strength: 1, photo: "market" },
  ],
};

/* ── Browse by vibe ── */

export type OfferKind = "deal" | "event" | "info";

export type Place = {
  name: string;
  area: string;
  km: number;
  bearing: number; // degrees clockwise from north, used to place the pin on the map
  note: string;
  kind: OfferKind;
  photo: PhotoKey;
};

export const RADII = [1, 2, 3, 5];

export const PLACES: Record<Vibe, Place[]> = {
  rooftop: [
    { name: "Salt Terrace", area: "Rooftop · Colombo 3", km: 1.2, bearing: 200, note: "20% off cocktails · ends 7:30", kind: "deal", photo: "seafood" },
    { name: "Lantern Yard", area: "Rooftop · Colombo 7", km: 1.9, bearing: 120, note: "Acoustic set at 9", kind: "event", photo: "rooftop" },
    { name: "The Upper Deck", area: "Rooftop · Galle Face", km: 2.6, bearing: 330, note: "Table free at 8", kind: "info", photo: "fusion" },
    { name: "Skyline 27", area: "Rooftop · Colombo 2", km: 4.4, bearing: 20, note: "Happy hour till 8", kind: "info", photo: "cocktail" },
  ],
  chill: [
    { name: "Café Luna", area: "Café · Colombo 5", km: 0.8, bearing: 150, note: "Quiet courtyard", kind: "info", photo: "juice" },
    { name: "The Patio", area: "Garden · Colombo 7", km: 1.4, bearing: 80, note: "2-for-1 iced coffee", kind: "deal", photo: "sweets" },
    { name: "Garden Bar", area: "Bar · Battaramulla", km: 4.1, bearing: 100, note: "Live jazz at 8", kind: "event", photo: "cocktail" },
  ],
  datenight: [
    { name: "Harbour Lights", area: "Seafood · Colombo 1", km: 1.1, bearing: 340, note: "Window table free at 8", kind: "info", photo: "seafood" },
    { name: "Spice Route", area: "Sri Lankan · Colombo 4", km: 1.5, bearing: 190, note: "Set menu for two", kind: "deal", photo: "fusion" },
    { name: "The Loft", area: "Rooftop · Colombo 7", km: 2.8, bearing: 110, note: "Candlelit terrace", kind: "info", photo: "rooftop" },
  ],
  afterwork: [
    { name: "The Hangover Bar", area: "Bar · Colombo 3", km: 0.6, bearing: 230, note: "30% off cocktails · ends 8", kind: "deal", photo: "cocktail" },
    { name: "Salt Terrace", area: "Rooftop · Colombo 3", km: 1.2, bearing: 200, note: "Happy hour till 7:30", kind: "info", photo: "seafood" },
    { name: "Salt & Tide", area: "Seafood · Colombo 2", km: 4.2, bearing: 10, note: "Half-price oysters", kind: "deal", photo: "market" },
  ],
  livemusic: [
    { name: "Rooftop Sessions", area: "Live music · Colombo 3", km: 1.6, bearing: 250, note: "Doors at 9", kind: "event", photo: "culture" },
    { name: "Lantern Yard", area: "Rooftop · Colombo 7", km: 1.9, bearing: 120, note: "Acoustic set at 9", kind: "event", photo: "rooftop" },
    { name: "Garden Bar", area: "Bar · Battaramulla", km: 4.1, bearing: 100, note: "Live jazz at 8", kind: "event", photo: "cocktail" },
  ],
  sundaybrunch: [
    { name: "Café Luna", area: "Café · Colombo 5", km: 0.8, bearing: 150, note: "Seats till noon", kind: "info", photo: "bakery" },
    { name: "The Patio", area: "Garden · Colombo 7", km: 1.4, bearing: 80, note: "Bottomless coffee", kind: "deal", photo: "juice" },
    { name: "Garden Brunch", area: "Pop-up · Battaramulla", km: 2.4, bearing: 95, note: "Pop-up until 3", kind: "event", photo: "feast" },
  ],
  latenight: [
    { name: "The Groove", area: "Club · Colombo 2", km: 0.8, bearing: 20, note: "DJ till close", kind: "event", photo: "cocktail" },
    { name: "Black Cat Lounge", area: "Lounge · Colombo 3", km: 1.8, bearing: 215, note: "2-for-1 before 10", kind: "deal", photo: "fusion" },
    { name: "Midnight Kottu", area: "Street food · Colombo 6", km: 3.4, bearing: 175, note: "Kitchen open till 2", kind: "info", photo: "stall" },
  ],
  party: [
    { name: "The Groove", area: "Club · Colombo 2", km: 0.8, bearing: 20, note: "House DJ at 11", kind: "event", photo: "cocktail" },
    { name: "Black Cat Lounge", area: "Lounge · Colombo 3", km: 1.8, bearing: 215, note: "2-for-1 entry before 10", kind: "deal", photo: "fusion" },
    { name: "Skyline 27", area: "Rooftop · Colombo 2", km: 4.4, bearing: 20, note: "Foam night", kind: "event", photo: "culture" },
  ],
};

/* ── Beacon story ── */

export const BEACON_STEPS = [
  { title: "Cast your Beacon", body: "How many of you, your budget per head, your vibe and how far you'll go. Takes ten seconds." },
  { title: "Matching venues see it", body: "Only nearby venues that fit your vibe get your Beacon. A rooftop crowd never hears from a karaoke bar." },
  { title: "They compete", body: "Each venue sends its best offer: a free round, a discount, a held table. The strongest one reaches you." },
  { title: "Accept and walk in", body: "Tap accept and get a QR pass. Show it at the door and the offer is yours." },
];

export const BEACON_FACTS = [
  { value: 10, suffix: "s", label: "to cast a Beacon" },
  { value: 2, suffix: "h", label: "your Beacon stays live" },
  { value: 1, suffix: "", label: "winning offer, not a flood" },
  { value: 0, prefix: "LKR ", suffix: "", label: "for diners. Always." },
];

export const BEACON_PROMISES = [
  { title: "Anonymous", body: "Venues see your group and vibe, never your name." },
  { title: "No spam", body: "One winning offer, then quiet. No flood of ads." },
  { title: "Always free", body: "Casting a Beacon costs you nothing. Venues pay to win you." },
];

/* ── Features ── */

export const DISHES = [
  { id: "kingfish", name: "Grilled kingfish, mango sambol", up: 142 },
  { id: "kottu", name: "Cheese kottu", up: 141 },
  { id: "watalappan", name: "Watalappan", up: 139 },
  { id: "prawn", name: "Tamarind prawn curry", up: 138 },
];

export const SLOTS = ["7:00", "7:30", "8:00", "8:30", "9:00"];

/* ── Day parts ── */

export const DAY_PARTS: {
  time: string;
  title: string;
  body: string;
  beacon: string;
  photo: PhotoKey;
  bg: string;
  dark: boolean;
}[] = [
  { time: "10 AM", title: "Sunday brunch", body: "Garden cafés, bottomless coffee, long tables.", beacon: "6 people · LKR 2–3k · #sundaybrunch", photo: "bakery", bg: "#F6E6D3", dark: false },
  { time: "1 PM", title: "Lunch", body: "Set menus near the office, in and out in an hour.", beacon: "3 people · LKR 1–2k · #quicklunch", photo: "juice", bg: "#F3EFE7", dark: false },
  { time: "6 PM", title: "After work", body: "Cast for the team and let the happy hours bid.", beacon: "8 people · LKR 3–5k · #afterwork", photo: "cocktail", bg: "#F2C7AD", dark: false },
  { time: "8 PM", title: "Date night", body: "Quiet corners, a view, a table that's held for you.", beacon: "2 people · LKR 5k+ · #datenight", photo: "seafood", bg: "#2B211C", dark: true },
  { time: "11 PM", title: "Late night", body: "DJs, mic nights and kottu at 1 AM.", beacon: "5 people · LKR 2–3k · #latenight", photo: "market", bg: "#100F0D", dark: true },
];

/* ── FAQ ── */

export const FAQS = [
  { q: "What is a Beacon?", a: "A 2-hour signal that says you're out: how many of you, your budget and your vibe. Matching venues nearby compete with offers, and the best one comes to you." },
  { q: "Do venues see who I am?", a: "No. Venues only see your group size, budget, vibe and rough distance. Your name is shared only if you accept an offer and book." },
  { q: "Is Kohedha free?", a: "Yes. Casting Beacons, booking, claiming deals and voting on dishes are all free for diners." },
  { q: "What if I don't like the offer?", a: "Pass on it. Your Beacon stays live for its 2 hours, or you can switch it off and browse by vibe instead." },
  { q: "Where does Kohedha work?", a: "Greater Colombo today: Colombo 1–7, Galle Face and Battaramulla. Kandy, Galle and Negombo are next." },
];
