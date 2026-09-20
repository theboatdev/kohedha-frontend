"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import "./home-landing.css";

const VIBES = [
  { name: "Chill", venues: 34, events: 3, deals: 7 },
  { name: "Date night", venues: 22, events: 2, deals: 5 },
  { name: "Party", venues: 18, events: 5, deals: 9 },
  { name: "Sunday brunch", venues: 15, events: 1, deals: 4 },
  { name: "After work", venues: 27, events: 2, deals: 11 },
  { name: "Live music", venues: 12, events: 6, deals: 3 },
  { name: "Late night", venues: 19, events: 4, deals: 8 },
  { name: "Rooftop", venues: 9, events: 2, deals: 6 },
];

const MATCHES: Record<string, [string, string, string][]> = {
  Chill: [
    ["Café Luna", "Colombo 5 · 0.8 km", "Quiet courtyard"],
    ["The Patio", "Colombo 7 · 1.4 km", "Table free at 8"],
    ["Garden Bar", "Battaramulla · 2.1 km", "Live jazz later"],
  ],
  "Date night": [
    ["Harbour Lights", "Colombo 1 · 1.1 km", "Window table free"],
    ["The Loft", "Colombo 7 · 2.8 km", "BYOB rooftop"],
    ["Spice Route", "Colombo 4 · 1.5 km", "Set menu tonight"],
  ],
  Party: [
    ["Black Cat Lounge", "Colombo 3 · 1.8 km", "2-for-1 before 10"],
    ["The Groove", "Colombo 2 · 0.8 km", "House DJ at 11"],
    ["Rooftop 27", "Colombo 3 · 3.2 km", "Happy hour on"],
  ],
  "Sunday brunch": [
    ["Garden Brunch", "Battaramulla · 2.4 km", "Pop-up until 3"],
    ["Café Luna", "Colombo 5 · 0.8 km", "Seats till noon"],
    ["The Patio", "Colombo 7 · 1.4 km", "Bottomless coffee"],
  ],
  "After work": [
    ["The Hangover Bar", "Colombo 3 · 0.6 km", "30% off cocktails"],
    ["Salt & Tide", "Colombo 2 · 4.2 km", "Half-price oysters"],
    ["The Loft", "Colombo 7 · 2.8 km", "Free starter"],
  ],
  "Live music": [
    ["Rooftop Sessions", "Colombo 3 · 1.6 km", "Doors at 9"],
    ["Garden Bar", "Battaramulla · 2.1 km", "Live jazz · free"],
    ["Salt & Tide", "Colombo 2 · 4.2 km", "Sunset Sessions"],
  ],
  "Late night": [
    ["Black Cat Lounge", "Colombo 3 · 1.8 km", "Open till 3"],
    ["The Groove", "Colombo 2 · 0.8 km", "DJ till close"],
    ["The Hangover Bar", "Colombo 3 · 0.6 km", "Kitchen till 1"],
  ],
  Rooftop: [
    ["Rooftop 27", "Colombo 3 · 3.2 km", "Happy hour on"],
    ["The Loft", "Colombo 7 · 2.8 km", "BYOB · view"],
    ["Rooftop Sessions", "Colombo 3 · 1.6 km", "Live set at 9"],
  ],
};

const DEAL_SEEDS = [
  {
    venue: "The Hangover Bar",
    name: "30% off cocktails",
    desc: "Until 11pm · all signature drinks",
    ends: 2082,
    cap: 30,
    taken: 12,
  },
  {
    venue: "Salt & Tide",
    name: "Half-price oysters",
    desc: "First 12 customers · BYOB welcome",
    ends: 5382,
    cap: 12,
    taken: 6,
  },
  {
    venue: "Black Cat Lounge",
    name: "2-for-1 entry",
    desc: "Live DJ set · before 10pm",
    ends: 1002,
    cap: 50,
    taken: 47,
  },
];

const DISH_SEEDS = [
  { id: "d1", name: "Grilled kingfish with mango sambol", up: 142, down: 8 },
  { id: "d2", name: "Wood-fired flatbread", up: 98, down: 12 },
  { id: "d3", name: "Coconut panna cotta", up: 76, down: 31 },
  { id: "d4", name: "Tamarind prawn curry", up: 63, down: 44 },
];

const EVENTS = [
  {
    d: "14",
    m: "Jun",
    title: "Rooftop Sessions Vol. 4",
    meta: "Colombo 3 · 9:00 PM",
    vibe: "Live music",
  },
  {
    d: "15",
    m: "Jun",
    title: "Night Market After Dark",
    meta: "Galle Face · 6:00 PM",
    vibe: "Party",
  },
  {
    d: "18",
    m: "Jun",
    title: "Jazz & Small Plates",
    meta: "Colombo 7 · 7:30 PM",
    vibe: "Date night",
  },
  {
    d: "21",
    m: "Jun",
    title: "Garden Brunch Pop-up",
    meta: "Battaramulla · 11:00 AM",
    vibe: "Sunday brunch",
  },
];

const VENUES = [
  {
    name: "The Patio",
    loc: "Colombo 7 · Opens 11 AM",
    vibes: ["Chill"],
    live: true,
  },
  {
    name: "Harbour Lights",
    loc: "Colombo 1 · Opens 6 PM",
    vibes: ["Date night"],
    live: false,
  },
  {
    name: "Rooftop Sessions",
    loc: "Colombo 3 · Opens 7 PM",
    vibes: ["Live music"],
    live: true,
  },
];

const FAQS = [
  {
    q: "Do I need an account to browse venues?",
    a: "No. You can explore the map, filter by vibe, and browse venues, events, and live deals without an account. You'll only need to sign in when you're ready to reserve a table or save a beacon.",
  },
  {
    q: "Can I book a table on the website?",
    a: "Yes — full booking is available right here on the web. Pick your venue, time, and table, and your QR token is generated instantly. The app adds push alerts and exclusive in-app deals on top.",
  },
  {
    q: "How do menu ratings work?",
    a: "After your visit you can rate individual dishes up or down. Venues see which items are loved and which to drop, so the menu keeps improving — your taste shapes what stays on it.",
  },
  {
    q: "What cities is Kohedha available in?",
    a: "We're live across Greater Colombo — including Colombo 1 through 7, Galle Face, and Battaramulla — and expanding to Kandy, Galle, and Negombo next. Set your radius and the map shows what's reachable from you.",
  },
  {
    q: "Can I cancel or modify a reservation?",
    a: "Absolutely. Head to Manage Your Bookings, open the reservation, and change the time, table size, or cancel — free of charge up to two hours before your slot.",
  },
];

const PINS = [
  { key: "p1", km: 0.9, left: "30%", top: "34%", label: "Café Luna", dark: false },
  { key: "p2", km: 2.4, left: "58%", top: "26%", label: "The Rooftop", dark: false },
  { key: "p3", km: 1.6, left: "24%", top: "64%", label: "Rooftop Sessions", dark: false },
  { key: "p4", km: 3.8, left: "60%", top: "70%", label: "50% off drinks", dark: true },
];

function pad(n: number) {
  return n < 10 ? "0" + n : String(n);
}

function clock(sec: number) {
  if (sec <= 0) return "ended";
  return pad(Math.floor(sec / 60)) + ":" + pad(sec % 60);
}

function hm(sec: number) {
  if (sec <= 0) return "expired";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return h > 0 ? h + "h " + m + "m" : m + "m";
}

export default function HomePage() {
  const [t, setT] = useState(0);
  const [beacon, setBeacon] = useState(false);
  const [beaconStart, setBeaconStart] = useState(0);
  const [vibe, setVibe] = useState("Chill");
  const [radius, setRadius] = useState(3);
  const [votes, setVotes] = useState<Record<string, "up" | "down" | null>>({});

  useEffect(() => {
    const id = setInterval(() => setT((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const wave = (amp: number, per: number, off: number) =>
    Math.round(amp * Math.sin((t + off) / per));
  const liveBeacons = 142 + wave(7, 19, 0);
  const liveVenues = 38 + wave(4, 13, 5);

  const cur = VIBES.find((v) => v.name === vibe) || VIBES[0];
  const matches = MATCHES[vibe] || MATCHES.Chill;

  const deals = DEAL_SEEDS.map((d, i) => {
    const left = Math.max(0, d.ends - t);
    const taken = Math.min(d.cap, d.taken + Math.floor(t / (28 + i * 9)));
    return {
      ...d,
      clock: clock(left),
      claims: d.cap - taken + " claims left",
      ratio: taken + "/" + d.cap,
      barWidth: Math.round((taken / d.cap) * 100) + "%",
      barColor: taken / d.cap > 0.85 ? "#C8281A" : "#0D0D0D",
    };
  });

  const elapsed = beacon ? Math.max(0, t - beaconStart) : 0;
  const hasWinner = beacon && elapsed >= 6;
  const beaconLeft = beacon ? Math.max(0, 7200 - elapsed) : 7200;

  const ringPct = ({ 1: "30%", 2: "46%", 3: "62%", 5: "86%" } as Record<number, string>)[
    radius
  ] || "62%";
  const inReach = (km: number) => km <= radius;
  const reachCount = PINS.filter((p) => inReach(p.km)).length;

  const dishes = DISH_SEEDS.map((d) => {
    const mine = votes[d.id];
    const up = d.up + (mine === "up" ? 1 : 0);
    const down = d.down + (mine === "down" ? 1 : 0);
    const share = up / (up + down);
    return {
      ...d,
      up,
      down,
      pct: Math.round(share * 100) + "%",
      score: Math.round(share * 100) + "% would order again",
      color: share > 0.75 ? "#F5E642" : "rgba(13,13,13,0.2)",
      mine,
    };
  });

  const cast = (id: string, dir: "up" | "down") => {
    setVotes((st) => ({ ...st, [id]: st[id] === dir ? null : dir }));
  };

  return (
    <div
      style={{
        fontFamily: "var(--font-space-grotesk), 'Space Grotesk', system-ui, sans-serif",
        color: "#0D0D0D",
        background: "#F6F6F4",
        minHeight: "100vh",
      }}
    >
      {/* ── HERO ── */}
      <section id="top" style={{ background: "#0D0D0D", color: "#F6F6F4" }}>
        <div
          className="om-pad"
          style={{
            maxWidth: "1240px",
            margin: "0 auto",
            paddingTop: "160px",
            paddingBottom: "120px",
          }}
        >
          <h1 className="om-hero-h1" style={{ margin: 0, maxWidth: "15ch" }}>
            Every venue, perfectly matched to your mood.
          </h1>
          <p
            style={{
              margin: "40px 0 0",
              maxWidth: "56ch",
              fontSize: "18px",
              lineHeight: 1.65,
              fontWeight: 300,
              color: "rgba(246,246,244,0.6)",
            }}
          >
            Kohedha was built for Sri Lanka&apos;s dining culture — where the vibe
            matters as much as the menu. We connect you to places that fit how
            you&apos;re feeling{" "}
            <em style={{ fontStyle: "italic", color: "rgba(246,246,244,0.9)" }}>
              right now
            </em>
            , not just what you want to eat.
          </p>
          <div style={{ display: "flex", gap: "14px", marginTop: "48px", flexWrap: "wrap" }}>
            <Link
              href="#explore"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                background: "#F5E642",
                color: "#0D0D0D",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Start exploring →
            </Link>
            <Link
              href="#app"
              style={{
                display: "inline-flex",
                alignItems: "center",
                height: "52px",
                padding: "0 28px",
                borderRadius: "999px",
                border: "1px solid rgba(246,246,244,0.24)",
                color: "#F6F6F4",
                fontSize: "15px",
                textDecoration: "none",
              }}
            >
              Get the app
            </Link>
          </div>
          <div
            className="om-3col"
            style={{
              marginTop: "120px",
              paddingTop: "44px",
              borderTop: "1px solid rgba(246,246,244,0.12)",
              maxWidth: "720px",
              gap: "32px",
            }}
          >
            <div>
              <div style={{ fontSize: "40px", fontWeight: 300, letterSpacing: "-0.02em" }}>
                {liveBeacons}
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", color: "rgba(246,246,244,0.5)" }}>
                beacons live now
              </div>
            </div>
            <div>
              <div style={{ fontSize: "40px", fontWeight: 300, letterSpacing: "-0.02em" }}>
                {liveVenues}
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", color: "rgba(246,246,244,0.5)" }}>
                venues competing
              </div>
            </div>
            <div>
              <div style={{ fontSize: "40px", fontWeight: 300, letterSpacing: "-0.02em" }}>
                12k+
              </div>
              <div style={{ marginTop: "8px", fontSize: "13px", color: "rgba(246,246,244,0.5)" }}>
                nights out planned
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── BEACON ── */}
      <section style={{ maxWidth: "1240px", margin: "0 auto", padding: "150px 48px" }} className="om-pad om-sec">
        <div className="om-2col" style={{ alignItems: "start" }}>
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "9px",
                fontSize: "12px",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: "rgba(13,13,13,0.5)",
              }}
            >
              <span
                style={{
                  width: "6px",
                  height: "6px",
                  borderRadius: "999px",
                  background: "#C8281A",
                }}
              />
              Beacon · live
            </div>
            <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "16ch" }}>
              Tell the city you&apos;re out.
            </h2>
            <p
              style={{
                margin: "28px 0 0",
                maxWidth: "44ch",
                fontSize: "17px",
                lineHeight: 1.7,
                fontWeight: 300,
                color: "rgba(13,13,13,0.62)",
              }}
            >
              Broadcast a 2-hour beacon. Nearby venues compete with deals matched
              to your vibe. One winning offer arrives.
            </p>
            <div style={{ display: "flex", gap: "8px", marginTop: "36px", flexWrap: "wrap" }}>
              {["Rooftop", "Live music", "Buzzing now"].map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: "7px 14px",
                    borderRadius: "999px",
                    border: "1px solid rgba(13,13,13,0.16)",
                    fontSize: "13px",
                    color: "rgba(13,13,13,0.7)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(13,13,13,0.08)",
              borderRadius: "20px",
              padding: "32px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "13px",
                color: "rgba(13,13,13,0.5)",
              }}
            >
              <span>
                {beacon ? (hasWinner ? "Offer matched" : "Broadcasting") : "Idle"}
              </span>
              <span>
                {beacon ? "ends in " + hm(beaconLeft) : "not broadcasting"}
              </span>
            </div>
            <div
              style={{
                marginTop: "24px",
                height: "3px",
                background: "rgba(13,13,13,0.08)",
                borderRadius: "999px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: beacon ? Math.round((beaconLeft / 7200) * 100) + "%" : "0%",
                  height: "100%",
                  background: "#0D0D0D",
                  transition: "width 1s linear",
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                setBeacon((b) => !b);
                setBeaconStart(t);
              }}
              style={{
                marginTop: "24px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                height: "48px",
                padding: "0 20px",
                borderRadius: "999px",
                background: "#F5E642",
                color: "#0D0D0D",
                fontSize: "14px",
                cursor: "pointer",
                userSelect: "none",
                border: "none",
                width: "100%",
                fontFamily: "inherit",
              }}
            >
              <span>{beacon ? "Stop beacon" : "Start a 2-hour beacon"}</span>
              <span>→</span>
            </button>
            <div
              style={{
                marginTop: "28px",
                paddingTop: "24px",
                borderTop: "1px solid rgba(13,13,13,0.08)",
              }}
            >
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.45)",
                }}
              >
                Your offer
              </div>
              {!hasWinner ? (
                <div
                  style={{
                    padding: "22px 0 4px",
                    fontSize: "14px",
                    fontWeight: 300,
                    color: "rgba(13,13,13,0.45)",
                  }}
                >
                  {beacon
                    ? "Matching you with nearby venues…"
                    : "Start a beacon and one matched offer arrives. No spam."}
                </div>
              ) : (
                <div style={{ marginTop: "18px" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: "16px",
                    }}
                  >
                    <span style={{ fontSize: "17px" }}>The Hangover Bar</span>
                    <span style={{ fontSize: "12px", color: "rgba(13,13,13,0.45)" }}>
                      0.6 km · 94% match
                    </span>
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "15px",
                      fontWeight: 300,
                      color: "rgba(13,13,13,0.62)",
                    }}
                  >
                    30% off cocktails until 11pm
                  </div>
                  <div
                    style={{
                      marginTop: "18px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      height: "44px",
                      padding: "0 18px",
                      borderRadius: "999px",
                      border: "1px solid rgba(13,13,13,0.22)",
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    <span>Claim offer</span>
                    <span
                      style={{
                        fontVariantNumeric: "tabular-nums",
                        color: "rgba(13,13,13,0.5)",
                      }}
                    >
                      held {clock(Math.max(0, 2100 - Math.max(0, elapsed - 6)))}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── FILTER BY VIBE ── */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div className="om-2col" style={{ gridTemplateColumns: "1.15fr 1fr" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Filter by vibe
              </div>
              <p
                style={{
                  margin: "24px 0 0",
                  maxWidth: "44ch",
                  fontSize: "21px",
                  lineHeight: 1.55,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.72)",
                }}
              >
                Pick your mood and the map finds venues, events, and deals that
                match — all within your chosen radius.
              </p>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  marginTop: "44px",
                }}
              >
                {VIBES.map((v) => (
                  <button
                    key={v.name}
                    type="button"
                    onClick={() => setVibe(v.name)}
                    style={{
                      padding: "11px 20px",
                      borderRadius: "999px",
                      fontSize: "14px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      border:
                        v.name === vibe
                          ? "1px solid #0D0D0D"
                          : "1px solid rgba(13,13,13,0.16)",
                      background: v.name === vibe ? "#0D0D0D" : "transparent",
                      color: v.name === vibe ? "#F6F6F4" : "rgba(13,13,13,0.75)",
                    }}
                  >
                    {v.name}
                  </button>
                ))}
              </div>
              <div
                style={{
                  marginTop: "28px",
                  fontSize: "15px",
                  color: "rgba(13,13,13,0.55)",
                }}
              >
                {cur.venues} venues · {cur.events} events · {cur.deals} live deals
                match {vibe.toLowerCase()}
              </div>
            </div>
            <div
              style={{
                background: "#FFFFFF",
                border: "1px solid rgba(13,13,13,0.08)",
                borderRadius: "20px",
                padding: "30px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.45)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#C8281A",
                  }}
                />
                Open now · {vibe}
              </div>
              <div style={{ display: "flex", flexDirection: "column", marginTop: "8px" }}>
                {matches.map(([venue, where, note]) => (
                  <div
                    key={venue}
                    style={{
                      padding: "22px 0",
                      borderBottom: "1px solid rgba(13,13,13,0.08)",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: "20px",
                    }}
                  >
                    <div>
                      <div style={{ fontSize: "17px" }}>{venue}</div>
                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "13px",
                          color: "rgba(13,13,13,0.45)",
                        }}
                      >
                        {where}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: "13px",
                        color: "rgba(13,13,13,0.6)",
                        textAlign: "right",
                      }}
                    >
                      {note}
                    </span>
                  </div>
                ))}
              </div>
              <div
                style={{
                  marginTop: "22px",
                  fontSize: "13px",
                  color: "rgba(13,13,13,0.45)",
                }}
              >
                Updates as venues open and deals go live.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(13,13,13,0.5)",
            }}
          >
            Everything you need
          </div>
          <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "20ch" }}>
            One app for the whole night out.
          </h2>
          <div
            className="om-3col om-features"
            style={{
              gap: "1px",
              marginTop: "80px",
              background: "rgba(13,13,13,0.08)",
            }}
          >
            {[
              {
                n: "01",
                title: "Places",
                desc: "Venue listings filtered by your vibe and location. Browse photos, menus, events, and live deals before you decide.",
              },
              {
                n: "02",
                title: "Events",
                desc: "Live music, themed nights, pop-ups — all hosted at venues on your map. Filter by date, vibe, or distance.",
              },
              {
                n: "03",
                title: "Deals",
                desc: "Real-time offers from venues near you. Happy hours, set menus, exclusive discounts — active now or coming soon.",
              },
            ].map((f, i) => (
              <div
                key={f.n}
                style={{
                  background: "#F6F6F4",
                  padding:
                    i === 0
                      ? "40px 36px 44px 0"
                      : i === 2
                        ? "40px 0 44px 36px"
                        : "40px 36px 44px 36px",
                }}
                className="om-feature-cell"
              >
                <div style={{ fontSize: "13px", color: "rgba(13,13,13,0.4)" }}>
                  {f.n}
                </div>
                <h3
                  style={{
                    margin: "22px 0 0",
                    fontSize: "26px",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {f.title}
                </h3>
                <p
                  style={{
                    margin: "16px 0 0",
                    fontSize: "16px",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "rgba(13,13,13,0.6)",
                  }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RADIUS EXPLORER ── */}
      <section id="explore" style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div className="om-2col" style={{ alignItems: "center" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Radius explorer
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "16ch" }}>
                Drop a radius. Find your{" "}
                <em style={{ fontStyle: "italic" }}>scene</em>.
              </h2>
              <p
                style={{
                  margin: "28px 0 0",
                  maxWidth: "44ch",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.62)",
                }}
              >
                Set how far you&apos;re willing to go. The map pulls every venue,
                event, and deal within your reach — toggle layers to see exactly
                what you want.
              </p>
              <div style={{ display: "flex", gap: "8px", marginTop: "36px", flexWrap: "wrap" }}>
                {[1, 2, 3, 5].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setRadius(v)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "999px",
                      fontSize: "13px",
                      cursor: "pointer",
                      fontFamily: "inherit",
                      border:
                        v === radius
                          ? "1px solid #0D0D0D"
                          : "1px solid rgba(13,13,13,0.16)",
                      background: v === radius ? "#0D0D0D" : "transparent",
                      color: v === radius ? "#F6F6F4" : "rgba(13,13,13,0.7)",
                    }}
                  >
                    {v} km
                  </button>
                ))}
              </div>
              <div
                style={{
                  marginTop: "22px",
                  fontSize: "14px",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                {reachCount} of 4 places within reach
              </div>
            </div>
            <div
              style={{
                position: "relative",
                aspectRatio: "1",
                background: "#FFFFFF",
                border: "1px solid rgba(13,13,13,0.08)",
                borderRadius: "20px",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  backgroundImage:
                    "linear-gradient(rgba(13,13,13,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(13,13,13,0.045) 1px, transparent 1px)",
                  backgroundSize: "44px 44px",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: ringPct,
                  height: ringPct,
                  borderRadius: "999px",
                  border: "1px solid rgba(13,13,13,0.18)",
                  background: "rgba(245,230,66,0.07)",
                  transition:
                    "width 0.4s cubic-bezier(.32,.72,0,1), height 0.4s cubic-bezier(.32,.72,0,1)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "34%",
                  height: "34%",
                  borderRadius: "999px",
                  border: "1px dashed rgba(13,13,13,0.14)",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  left: "50%",
                  top: "50%",
                  transform: "translate(-50%,-50%)",
                  width: "12px",
                  height: "12px",
                  borderRadius: "999px",
                  background: "#0D0D0D",
                  boxShadow: "0 0 0 6px rgba(245,230,66,0.55)",
                }}
              />
              {PINS.map((p) => (
                <div
                  key={p.key}
                  style={{
                    position: "absolute",
                    left: p.left,
                    top: p.top,
                    fontSize: "12px",
                    padding: "6px 11px",
                    background: p.dark ? "#0D0D0D" : "#FFFFFF",
                    color: p.dark ? "#F6F6F4" : "#0D0D0D",
                    border: p.dark ? "none" : "1px solid rgba(13,13,13,0.12)",
                    borderRadius: "999px",
                    opacity: inReach(p.km) ? 1 : 0.22,
                    transition: "opacity 0.3s",
                  }}
                >
                  {p.label}
                </div>
              ))}
              <div
                style={{
                  position: "absolute",
                  left: "24px",
                  bottom: "22px",
                  fontSize: "13px",
                  color: "rgba(13,13,13,0.55)",
                }}
              >
                <span style={{ color: "#0D0D0D" }}>{radius} km</span> your reach
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MANAGE BOOKINGS ── */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div className="om-2col">
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Manage your bookings
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "14ch" }}>
                Your night, in one place.
              </h2>
              <p
                style={{
                  margin: "28px 0 0",
                  maxWidth: "44ch",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.62)",
                }}
              >
                Every reservation and event in a single view. Your QR token waits
                on your phone — walk in, scan, sit down.
              </p>
              <Link
                href="#app"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  height: "48px",
                  padding: "0 24px",
                  marginTop: "36px",
                  borderRadius: "999px",
                  border: "1px solid rgba(13,13,13,0.22)",
                  fontSize: "15px",
                  color: "#0D0D0D",
                  textDecoration: "none",
                }}
              >
                Reserve your seat →
              </Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                {
                  initial: "P",
                  name: "The Patio — Colombo 7",
                  tags: "Chill · Date night",
                  when: "Tonight · 7:30 PM",
                  extra: "Table 4",
                },
                {
                  initial: "R",
                  name: "Rooftop Sessions",
                  tags: "Live music · Party",
                  when: "Sat 14 · 9:00 PM",
                  extra: "Going",
                },
              ].map((b) => (
                <div
                  key={b.name}
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid rgba(13,13,13,0.08)",
                    borderRadius: "16px",
                    padding: "26px 28px",
                    display: "flex",
                    gap: "20px",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: "44px",
                      height: "44px",
                      borderRadius: "999px",
                      background: "rgba(13,13,13,0.06)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "15px",
                      flexShrink: 0,
                    }}
                  >
                    {b.initial}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "17px" }}>{b.name}</div>
                    <div
                      style={{
                        marginTop: "5px",
                        fontSize: "13px",
                        color: "rgba(13,13,13,0.5)",
                      }}
                    >
                      {b.tags}
                    </div>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "13px",
                      color: "rgba(13,13,13,0.6)",
                    }}
                  >
                    {b.when}
                    <br />
                    {b.extra}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── RESERVE STEPS ── */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: "rgba(13,13,13,0.5)",
            }}
          >
            Reserve your seat
          </div>
          <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "20ch" }}>
            Discover dining <em style={{ fontStyle: "italic" }}>with ease</em>.
          </h2>
          <p
            style={{
              margin: "28px 0 0",
              maxWidth: "56ch",
              fontSize: "17px",
              lineHeight: 1.7,
              fontWeight: 300,
              color: "rgba(13,13,13,0.62)",
            }}
          >
            No calls. No waiting. Pick your table, pick your time, and your QR
            token is ready before you leave the house. Walk in, scan, sit down.
          </p>
          <div className="om-3col" style={{ gap: "56px", marginTop: "80px" }}>
            {[
              {
                n: "1",
                title: "Pick your vibe & venue",
                desc: "Browse the map, filter by mood, and find the spot that fits the night you want.",
              },
              {
                n: "2",
                title: "Reserve your seat",
                desc: "Choose your table and time slot in seconds — no phone calls, no back-and-forth.",
              },
              {
                n: "3",
                title: "Walk in & scan",
                desc: "Your QR token is ready on the app. Scan at the door and you're seated.",
              },
            ].map((s) => (
              <div
                key={s.n}
                style={{
                  paddingTop: "26px",
                  borderTop: "1px solid rgba(13,13,13,0.14)",
                }}
              >
                <div style={{ fontSize: "13px", color: "rgba(13,13,13,0.4)" }}>
                  {s.n}
                </div>
                <h3
                  style={{
                    margin: "18px 0 0",
                    fontSize: "21px",
                    fontWeight: 400,
                    letterSpacing: "-0.015em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: "16px",
                    lineHeight: 1.7,
                    fontWeight: 300,
                    color: "rgba(13,13,13,0.6)",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRENDING VENUES ── */}
      <section style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Trending venues
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "18ch" }}>
                The most-booked spots right now.
              </h2>
            </div>
            <Link
              href="/places"
              style={{
                fontSize: "15px",
                color: "rgba(13,13,13,0.6)",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              See all venues →
            </Link>
          </div>
          <div className="om-3col" style={{ gap: "28px", marginTop: "72px" }}>
            {VENUES.map((v) => (
              <div key={v.name}>
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4/3",
                    background: "rgba(13,13,13,0.055)",
                    borderRadius: "16px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "12px",
                    color: "rgba(13,13,13,0.32)",
                  }}
                >
                  Venue photo
                  <div
                    style={{
                      position: "absolute",
                      left: "16px",
                      top: "16px",
                      right: "16px",
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                    }}
                  >
                    {v.vibes.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.92)",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                    {v.live && (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 12px",
                          borderRadius: "999px",
                          background: "rgba(255,255,255,0.92)",
                          fontSize: "12px",
                          whiteSpace: "nowrap",
                        }}
                      >
                        <span
                          style={{
                            width: "5px",
                            height: "5px",
                            borderRadius: "999px",
                            background: "#C8281A",
                          }}
                        />
                        Live
                      </span>
                    )}
                  </div>
                </div>
                <h3
                  style={{
                    margin: "22px 0 0",
                    fontSize: "22px",
                    fontWeight: 400,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {v.name}
                </h3>
                <div
                  style={{
                    marginTop: "7px",
                    fontSize: "14px",
                    color: "rgba(13,13,13,0.5)",
                  }}
                >
                  {v.loc}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: "18px",
                    marginTop: "20px",
                    fontSize: "14px",
                  }}
                >
                  <Link
                    href="/book"
                    style={{
                      borderBottom: "1px solid rgba(13,13,13,0.25)",
                      paddingBottom: "2px",
                      color: "#0D0D0D",
                      textDecoration: "none",
                    }}
                  >
                    Book a table
                  </Link>
                  <Link
                    href="/events"
                    style={{ color: "rgba(13,13,13,0.55)", textDecoration: "none" }}
                  >
                    Events
                  </Link>
                  <Link
                    href="/deals"
                    style={{ color: "rgba(13,13,13,0.55)", textDecoration: "none" }}
                  >
                    Deals
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LIVE DEALS ── */}
      <section id="live-deals" style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "9px",
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                <span
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "999px",
                    background: "#C8281A",
                  }}
                />
                Deals · live
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "18ch" }}>
                Live offers, ending soon.
              </h2>
            </div>
            <Link
              href="/deals"
              style={{
                fontSize: "15px",
                color: "rgba(13,13,13,0.6)",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              See all deals →
            </Link>
          </div>
          <div className="om-3col" style={{ gap: "28px", marginTop: "72px" }}>
            {deals.map((d) => (
              <div
                key={d.name}
                style={{
                  background: "#FFFFFF",
                  border: "1px solid rgba(13,13,13,0.08)",
                  borderRadius: "18px",
                  padding: "28px",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "20px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(13,13,13,0.45)",
                      }}
                    >
                      {d.venue}
                    </div>
                    <div
                      style={{
                        marginTop: "12px",
                        fontSize: "24px",
                        fontWeight: 400,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      {d.name}
                    </div>
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "11px",
                        letterSpacing: "0.1em",
                        textTransform: "uppercase",
                        color: "rgba(13,13,13,0.4)",
                      }}
                    >
                      Ends in
                    </div>
                    <div
                      style={{
                        marginTop: "6px",
                        fontSize: "20px",
                        fontVariantNumeric: "tabular-nums",
                        letterSpacing: "-0.01em",
                      }}
                    >
                      {d.clock}
                    </div>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: "14px",
                    fontSize: "15px",
                    fontWeight: 300,
                    color: "rgba(13,13,13,0.6)",
                  }}
                >
                  {d.desc}
                </div>
                <div
                  style={{
                    marginTop: "28px",
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: "13px",
                    color: "rgba(13,13,13,0.55)",
                  }}
                >
                  <span>{d.claims}</span>
                  <span>{d.ratio}</span>
                </div>
                <div
                  style={{
                    marginTop: "10px",
                    height: "3px",
                    background: "rgba(13,13,13,0.08)",
                    borderRadius: "999px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: d.barWidth,
                      height: "100%",
                      background: d.barColor,
                      transition: "width 0.6s ease",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section id="events" style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              gap: "40px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Trending events
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0" }}>
                What&apos;s on this week.
              </h2>
              <p
                style={{
                  margin: "20px 0 0",
                  fontSize: "17px",
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.6)",
                }}
              >
                Across Sri Lanka, hand-picked by vibe.
              </p>
            </div>
            <Link
              href="/events"
              style={{
                fontSize: "15px",
                color: "rgba(13,13,13,0.6)",
                whiteSpace: "nowrap",
                textDecoration: "none",
              }}
            >
              See all events →
            </Link>
          </div>
          <div style={{ marginTop: "64px", borderTop: "1px solid rgba(13,13,13,0.1)" }}>
            {EVENTS.map((ev) => (
              <Link
                key={ev.title}
                href="/events"
                className="om-event-row"
                style={{
                  display: "grid",
                  gridTemplateColumns: "96px 1fr auto",
                  gap: "32px",
                  alignItems: "center",
                  padding: "30px 8px",
                  borderBottom: "1px solid rgba(13,13,13,0.1)",
                  color: "#0D0D0D",
                  textDecoration: "none",
                  transition: "background 0.15s",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: "30px",
                      fontWeight: 300,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {ev.d}
                  </span>{" "}
                  <span style={{ fontSize: "13px", color: "rgba(13,13,13,0.5)" }}>
                    {ev.m}
                  </span>
                </div>
                <div>
                  <div
                    style={{
                      fontSize: "22px",
                      fontWeight: 400,
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {ev.title}
                  </div>
                  <div
                    style={{
                      marginTop: "6px",
                      fontSize: "14px",
                      color: "rgba(13,13,13,0.5)",
                    }}
                  >
                    {ev.meta}
                  </div>
                </div>
                <div style={{ fontSize: "13px", color: "rgba(13,13,13,0.55)" }}>
                  {ev.vibe}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── TASTE / MENU RATINGS ── */}
      <section id="deals" style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div className="om-2col">
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                Taste · Menu ratings
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "16ch" }}>
                Restaurants competing with{" "}
                <em style={{ fontStyle: "italic" }}>themselves</em>.
              </h2>
              <p
                style={{
                  margin: "28px 0 0",
                  maxWidth: "44ch",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.62)",
                }}
              >
                After your visit, rate individual dishes. Venues see which items
                are loved — and which to drop. Your taste shapes the menu.
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {dishes.map((dish) => (
                <div key={dish.id}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "20px",
                      fontSize: "16px",
                    }}
                  >
                    <div>
                      <div>{dish.name}</div>
                      <div
                        style={{
                          marginTop: "5px",
                          fontSize: "13px",
                          color: "rgba(13,13,13,0.45)",
                        }}
                      >
                        {dish.score}
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
                      <button
                        type="button"
                        onClick={() => cast(dish.id, "up")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 13px",
                          borderRadius: "999px",
                          border:
                            dish.mine === "up"
                              ? "1px solid #0D0D0D"
                              : "1px solid rgba(13,13,13,0.16)",
                          background: dish.mine === "up" ? "#F5E642" : "transparent",
                          fontSize: "12px",
                          cursor: "pointer",
                          color:
                            dish.mine === "up" ? "#0D0D0D" : "rgba(13,13,13,0.55)",
                          fontVariantNumeric: "tabular-nums",
                          fontFamily: "inherit",
                        }}
                      >
                        ▲ {dish.up}
                      </button>
                      <button
                        type="button"
                        onClick={() => cast(dish.id, "down")}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          padding: "6px 13px",
                          borderRadius: "999px",
                          border:
                            dish.mine === "down"
                              ? "1px solid #C8281A"
                              : "1px solid rgba(13,13,13,0.16)",
                          background:
                            dish.mine === "down"
                              ? "rgba(200,40,26,0.08)"
                              : "transparent",
                          fontSize: "12px",
                          cursor: "pointer",
                          color:
                            dish.mine === "down"
                              ? "#C8281A"
                              : "rgba(13,13,13,0.55)",
                          fontVariantNumeric: "tabular-nums",
                          fontFamily: "inherit",
                        }}
                      >
                        ▼ {dish.down}
                      </button>
                    </div>
                  </div>
                  <div
                    style={{
                      marginTop: "12px",
                      height: "4px",
                      borderRadius: "999px",
                      background: "rgba(13,13,13,0.08)",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        width: dish.pct,
                        height: "100%",
                        background: dish.color,
                        transition: "width 0.4s ease",
                      }}
                    />
                  </div>
                </div>
              ))}
              <div style={{ fontSize: "13px", color: "rgba(13,13,13,0.45)" }}>
                Vote up or down — the menu re-ranks live.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── APP CTA ── */}
      <section id="app" style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div className="om-2col" style={{ alignItems: "end" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                App
              </div>
              <h2 className="om-h2" style={{ margin: "28px 0 0", maxWidth: "16ch" }}>
                Reserve your seat.{" "}
                <em style={{ fontStyle: "italic" }}>Save the hassle.</em>
              </h2>
            </div>
            <div>
              <p
                style={{
                  margin: 0,
                  maxWidth: "46ch",
                  fontSize: "17px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.62)",
                }}
              >
                Full booking available on web — or download the app for QR entry,
                push alerts, and exclusive in-app deals.
              </p>
              <div style={{ display: "flex", gap: "12px", marginTop: "32px", flexWrap: "wrap" }}>
                <a
                  href="https://apps.apple.com/lk/app/kohedha/id6748849700"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    padding: "12px 22px",
                    borderRadius: "12px",
                    background: "#0D0D0D",
                    color: "#F6F6F4",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "11px", opacity: 0.6 }}>
                    Download on the
                  </span>
                  <span style={{ fontSize: "16px" }}>App Store</span>
                </a>
                <a
                  href="https://play.google.com/store/apps/details?id=com.theboat.kohedaapp"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    padding: "12px 22px",
                    borderRadius: "12px",
                    border: "1px solid rgba(13,13,13,0.2)",
                    color: "#0D0D0D",
                    textDecoration: "none",
                  }}
                >
                  <span style={{ fontSize: "11px", color: "rgba(13,13,13,0.55)" }}>
                    Get it on
                  </span>
                  <span style={{ fontSize: "16px" }}>Google Play</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="about" style={{ borderTop: "1px solid rgba(13,13,13,0.08)" }}>
        <div
          className="om-pad om-sec"
          style={{ maxWidth: "1240px", margin: "0 auto", paddingTop: "150px", paddingBottom: "150px" }}
        >
          <div className="om-2col" style={{ gridTemplateColumns: "1fr 1.4fr" }}>
            <div>
              <div
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  color: "rgba(13,13,13,0.5)",
                }}
              >
                FAQ
              </div>
              <h2
                className="om-h2"
                style={{ margin: "28px 0 0", fontSize: "44px", lineHeight: 1.08 }}
              >
                Frequently asked questions
              </h2>
              <p
                style={{
                  margin: "24px 0 0",
                  fontSize: "16px",
                  lineHeight: 1.7,
                  fontWeight: 300,
                  color: "rgba(13,13,13,0.6)",
                }}
              >
                Everything you need to know before your first booking.
              </p>
            </div>
            <div style={{ borderTop: "1px solid rgba(13,13,13,0.1)" }}>
              {FAQS.map((faq) => (
                <details
                  key={faq.q}
                  style={{ borderBottom: "1px solid rgba(13,13,13,0.1)" }}
                >
                  <summary
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "24px",
                      padding: "26px 4px",
                      fontSize: "19px",
                    }}
                  >
                    {faq.q}
                    <span
                      className="om-plus"
                      style={{
                        fontSize: "20px",
                        fontWeight: 300,
                        color: "rgba(13,13,13,0.45)",
                        transition: "transform 0.2s",
                        flexShrink: 0,
                      }}
                    >
                      +
                    </span>
                  </summary>
                  <p
                    style={{
                      margin: 0,
                      padding: "0 80px 28px 4px",
                      fontSize: "16px",
                      lineHeight: 1.75,
                      fontWeight: 300,
                      color: "rgba(13,13,13,0.62)",
                    }}
                  >
                    {faq.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
