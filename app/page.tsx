"use client";

import { useState } from "react";
import Link from "next/link";
import "./home-landing.css";

const VIBES = [
  "Chill",
  "Date night",
  "Party",
  "Sunday brunch",
  "After work",
  "Live music",
  "Late night",
  "Rooftop",
];

const FEATURES = [
  {
    n: "01",
    title: "Places",
    desc: "Venue listings filtered by your vibe and location. Browse photos, menus, events, and live deals before you decide.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M12 21s7-5.5 7-11a7 7 0 1 0-14 0c0 5.5 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
  },
  {
    n: "02",
    title: "Events",
    desc: "Live music, themed nights, pop-ups — all hosted at venues on your map. Filter by date, vibe, or distance.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <rect x="3" y="4.5" width="18" height="16" rx="2" />
        <path d="M3 9h18M8 2.5v4M16 2.5v4" />
      </svg>
    ),
  },
  {
    n: "03",
    title: "Deals",
    desc: "Real-time offers from venues near you. Happy hours, set menus, exclusive discounts — active now or coming soon.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
        <path d="M20.6 8.4 12 3 3.4 8.4v7.2L12 21l8.6-5.4z" />
        <path d="M12 3v18M3.4 8.4 12 12l8.6-3.6" />
      </svg>
    ),
  },
];

const PINS = [
  { layer: "places", left: "38%", top: "34%", lab: "Café Luna" },
  { layer: "places", left: "64%", top: "62%", lab: "The Rooftop" },
  { layer: "events", left: "33%", top: "66%", lab: "Night Market" },
  { layer: "events", left: "72%", top: "30%", lab: "Rooftop Sessions" },
  { layer: "deals", left: "54%", top: "44%", lab: "50% off drinks" },
  { layer: "deals", left: "46%", top: "72%", lab: "Set menu" },
];

const VENUES = [
  {
    bg: "linear-gradient(150deg,#1A1A1A,#3a3320)",
    vibe: "Chill",
    live: true,
    loc: "Colombo 7 · Opens 11 AM",
    name: "The Patio",
  },
  {
    bg: "linear-gradient(150deg,#2a1410,#5a2018)",
    vibe: "Date night",
    live: false,
    loc: "Colombo 1 · Opens 6 PM",
    name: "Harbour Lights",
  },
  {
    bg: "linear-gradient(150deg,#101b2a,#1f3550)",
    vibe: "Live music",
    live: true,
    loc: "Colombo 3 · Opens 7 PM",
    name: "Rooftop Sessions",
  },
];

const EVENTS = [
  {
    bg: "linear-gradient(150deg,#2a1410,#6a2a1a)",
    d: "14",
    m: "Jun",
    vibe: "Live music",
    title: "Rooftop Sessions Vol. 4",
    meta: "Colombo 3 · 9:00 PM",
  },
  {
    bg: "linear-gradient(150deg,#1a2410,#3a4a1a)",
    d: "15",
    m: "Jun",
    vibe: "Party",
    title: "Night Market After Dark",
    meta: "Galle Face · 6:00 PM",
  },
  {
    bg: "linear-gradient(150deg,#101b2a,#28405e)",
    d: "18",
    m: "Jun",
    vibe: "Date night",
    title: "Jazz & Small Plates",
    meta: "Colombo 7 · 7:30 PM",
  },
  {
    bg: "linear-gradient(150deg,#2a1024,#54204a)",
    d: "21",
    m: "Jun",
    vibe: "Sunday brunch",
    title: "Garden Brunch Pop-up",
    meta: "Battaramulla · 11:00 AM",
  },
];

const INITIAL_DISHES = [
  { name: "Grilled kingfish with mango sambol", pct: 95, up: 142, down: 8 },
  { name: "Wood-fired flatbread", pct: 89, up: 98, down: 12 },
  { name: "Coconut panna cotta", pct: 71, up: 76, down: 31 },
  { name: "Tamarind prawn curry", pct: 59, up: 63, down: 44 },
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

export default function HomePage() {
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(
    new Set(["Chill", "Live music"]),
  );
  const [layers, setLayers] = useState({
    places: true,
    events: true,
    deals: true,
  });
  const [radius, setRadius] = useState(3);
  const [dishes, setDishes] = useState(INITIAL_DISHES);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(vibe)) {
        next.delete(vibe);
      } else {
        next.add(vibe);
      }
      return next;
    });
  };

  const toggleLayer = (layer: "places" | "events" | "deals") => {
    setLayers((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const vote = (index: number, dir: "up" | "down") => {
    setDishes((prev) =>
      prev.map((d, i) =>
        i === index ? { ...d, [dir]: d[dir] + 1 } : d,
      ),
    );
  };

  const ringPct = 30 + (radius / 10) * 62;

  return (
    <div className="lp-home">
      {/* ===================== HERO ===================== */}
      <section className="hero sec-dark" id="discover">
        <div className="hero-inner wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <div className="hero-eyebrow eyebrow on-dark">Mission</div>
              <h1 className="hero-h1">
                Every venue,
                <br />
                perfectly matched
                <br />
                to your <span className="mood">mood</span>.
              </h1>
              <p className="hero-sub">
                Kohedha was built for Sri Lanka&apos;s dining culture — where the
                vibe matters as much as the menu. We connect you to places that
                fit how you&apos;re feeling{" "}
                <em style={{ color: "var(--y)", fontStyle: "normal" }}>
                  right now
                </em>
                , not just what you want to eat.
              </p>
              <div className="hero-actions">
                <Link href="#explore" className="btn">
                  Start exploring <span className="arr">→</span>
                </Link>
                <Link href="#app" className="btn btn-ghost on-dark">
                  Get the app
                </Link>
              </div>
              <div className="hero-stats">
                <div>
                  <div className="hstat-n">142</div>
                  <div className="hstat-l">beacons live now</div>
                </div>
                <div>
                  <div className="hstat-n">38</div>
                  <div className="hstat-l">venues competing</div>
                </div>
                <div>
                  <div className="hstat-n">12k+</div>
                  <div className="hstat-l">nights out planned</div>
                </div>
              </div>
            </div>

            <div className="hero-vis">
              <div className="beacon">
                <div className="beacon-lbl">
                  <span className="d"></span>Beacon · live
                </div>
                <div className="beacon-h">
                  Tell the city
                  <br />
                  you&apos;re out.
                </div>
                <div className="beacon-b">
                  Broadcast a 2-hour beacon. Nearby venues compete with deals
                  matched to your vibe. One winning offer arrives.
                </div>
              </div>
              <div className="hero-chips">
                <span className="tag tag-y">Rooftop</span>
                <span className="tag tag-k">Live music</span>
                <span className="tag tag-live">
                  <span className="dot"></span>Buzzing now
                </span>
              </div>
            </div>
          </div>

          {/* vibe band */}
          <div className="vibe-band" id="explore">
            <div className="vibe-head">
              <div className="vibe-title">Filter by vibe</div>
              <div className="vibe-note">
                Pick your mood and the map finds venues, events, and deals that
                match — all within your chosen radius.
              </div>
            </div>
            <div className="chips">
              {VIBES.map((vibe) => (
                <button
                  key={vibe}
                  className={`chip${selectedVibes.has(vibe) ? " sel" : ""}`}
                  onClick={() => toggleVibe(vibe)}
                >
                  {vibe}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURES ===================== */}
      <section
        className="wrap"
        style={{
          maxWidth: "none",
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
        }}
      >
        <div className="wrap">
          <div className="sec-head">
            <div className="eyebrow">Everything you need</div>
            <h2 className="h-sec">
              One app for the
              <br />
              whole night out.
            </h2>
          </div>
          <div className="feat-grid">
            {FEATURES.map((f) => (
              <div className="feat" key={f.n}>
                <div className="feat-n">{f.n}</div>
                <div className="feat-ic">{f.icon}</div>
                <h3>{f.title}</h3>
                <p>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== RADIUS EXPLORER ===================== */}
      <section className="sec-dark">
        <div className="wrap radius-grid">
          <div className="radius-copy">
            <div className="eyebrow on-dark">Radius explorer</div>
            <h2 className="h-sec">
              Drop a radius.
              <br />
              Find your <em>scene</em>.
            </h2>
            <p className="lead on-dark">
              Set how far you&apos;re willing to go. The map pulls every venue,
              event, and deal within your reach — toggle layers to see exactly
              what you want.
            </p>
            <div className="radius-toggles">
              {(["places", "events", "deals"] as const).map((layer) => (
                <button
                  key={layer}
                  className="layer-tog"
                  data-layer={layer}
                  data-on={layers[layer] ? "true" : "false"}
                  onClick={() => toggleLayer(layer)}
                >
                  <span className="sw"></span>
                  {layer.charAt(0).toUpperCase() + layer.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="map">
            <div className="map-grid"></div>
            <svg
              className="map-roads"
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
            >
              <path
                d="M0 30 L100 38"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.8}
              />
              <path
                d="M22 0 L30 100"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.8}
              />
              <path
                d="M70 0 L66 100"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.8}
              />
              <path
                d="M0 72 L100 66"
                stroke="rgba(255,255,255,0.08)"
                strokeWidth={0.8}
              />
            </svg>
            <div
              className="radius-ring"
              style={{ width: `${ringPct}%`, height: `${ringPct}%` }}
            ></div>
            <div className="radius-core"></div>

            {PINS.map((pin) => (
              <div
                key={pin.lab}
                className="pin"
                data-layer={pin.layer}
                data-hidden={
                  layers[pin.layer as "places" | "events" | "deals"]
                    ? "false"
                    : "true"
                }
                style={{ left: pin.left, top: pin.top }}
              >
                <span className="dot"></span>
                <span className="lab">{pin.lab}</span>
              </div>
            ))}

            <div className="map-foot">
              <div className="radius-slider">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={radius}
                  aria-label="Radius"
                  onChange={(e) => setRadius(Number(e.target.value))}
                />
              </div>
              <div className="radius-val">
                <span>{radius}</span> km<small>your reach</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BOOKINGS ===================== */}
      <section className="sec-warm">
        <div className="wrap book-grid">
          <div>
            <div className="eyebrow">Manage your bookings</div>
            <h2 className="h-sec" style={{ margin: "16px 0 18px" }}>
              Your night,
              <br />
              in one place.
            </h2>
            <p className="lead">
              Every reservation and event in a single view. Your QR token waits
              on your phone — walk in, scan, sit down.
            </p>
            <Link href="#" className="btn" style={{ marginTop: "26px" }}>
              Reserve your seat <span className="arr">→</span>
            </Link>
          </div>
          <div className="book-cards">
            <div className="book-card">
              <div
                className="bk-thumb"
                style={{ background: "var(--y)", color: "var(--k)" }}
              >
                P
              </div>
              <div className="bk-main">
                <div className="bk-name">The Patio — Colombo 7</div>
                <div className="bk-tags">Chill · Date night</div>
                <div className="bk-when">Tonight · 7:30 PM · Table 4</div>
              </div>
              <div className="bk-qr">
                <svg viewBox="0 0 40 40" fill="var(--y)">
                  <rect x="2" y="2" width="11" height="11" />
                  <rect x="27" y="2" width="11" height="11" />
                  <rect x="2" y="27" width="11" height="11" />
                  <rect x="5" y="5" width="5" height="5" fill="var(--k)" />
                  <rect x="30" y="5" width="5" height="5" fill="var(--k)" />
                  <rect x="5" y="30" width="5" height="5" fill="var(--k)" />
                  <rect x="19" y="2" width="4" height="4" />
                  <rect x="19" y="10" width="4" height="4" />
                  <rect x="27" y="19" width="4" height="4" />
                  <rect x="35" y="19" width="3" height="4" />
                  <rect x="19" y="19" width="4" height="4" />
                  <rect x="19" y="27" width="4" height="11" />
                  <rect x="27" y="27" width="4" height="4" />
                  <rect x="34" y="27" width="4" height="11" />
                  <rect x="27" y="34" width="4" height="4" />
                </svg>
              </div>
            </div>
            <div className="book-card">
              <div
                className="bk-thumb"
                style={{ background: "var(--r)", color: "var(--y)" }}
              >
                R
              </div>
              <div className="bk-main">
                <div className="bk-name">Rooftop Sessions</div>
                <div className="bk-tags">Live music · Party</div>
                <div className="bk-when">Sat 14 · 9:00 PM · Event</div>
              </div>
              <span className="tag tag-live" style={{ flexShrink: 0 }}>
                <span className="dot"></span>Going
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== STEPS ===================== */}
      <section
        className="wrap"
        style={{
          maxWidth: "none",
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
        }}
      >
        <div className="wrap">
          <div className="sec-head" style={{ maxWidth: "640px" }}>
            <div className="eyebrow">Reserve your seat</div>
            <h2 className="h-sec">
              Discover dining <em>with ease</em>.
            </h2>
            <p className="lead" style={{ marginTop: "18px" }}>
              No calls. No waiting. Pick your table, pick your time, and your QR
              token is ready before you leave the house. Walk in, scan, sit
              down.
            </p>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-n">1</div>
              <h4>Pick your vibe &amp; venue</h4>
              <p>
                Browse the map, filter by mood, and find the spot that fits the
                night you want.
              </p>
            </div>
            <div className="step s-mid">
              <div className="step-n">2</div>
              <h4>Reserve your seat</h4>
              <p>
                Choose your table and time slot in seconds — no phone calls, no
                back-and-forth.
              </p>
            </div>
            <div className="step">
              <div className="step-n">3</div>
              <h4>Walk in &amp; scan</h4>
              <p>
                Your QR token is ready on the app. Scan at the door and
                you&apos;re seated.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== TRENDING VENUES ===================== */}
      <section
        className="wrap"
        id="deals"
        style={{
          maxWidth: "none",
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
          background: "var(--ws)",
        }}
      >
        <div className="wrap">
          <div className="row-head">
            <div>
              <div className="eyebrow">Trending venues</div>
              <h2 className="h-sec" style={{ marginTop: "14px" }}>
                The most-booked
                <br />
                spots right now.
              </h2>
            </div>
            <Link href="#" className="btn btn-ghost">
              See all venues <span className="arr">→</span>
            </Link>
          </div>
          <div className="venues">
            {VENUES.map((v) => (
              <div className="venue" key={v.name}>
                <div className="venue-img" style={{ background: v.bg }}>
                  <span className="tag tag-y vibe">{v.vibe}</span>
                  {v.live && (
                    <span className="tag tag-live live">
                      <span className="dot"></span>Live
                    </span>
                  )}
                  <div className="ph">{v.name}</div>
                </div>
                <div className="venue-body">
                  <div className="venue-loc">{v.loc}</div>
                  <h3>{v.name}</h3>
                  <div className="venue-acts">
                    <Link className="va primary" href="#">
                      Book a table
                    </Link>
                    <Link className="va" href="#">
                      Events
                    </Link>
                    <Link className="va" href="#">
                      Deals
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRENDING EVENTS ===================== */}
      <section
        className="wrap"
        id="events"
        style={{
          maxWidth: "none",
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
        }}
      >
        <div className="wrap">
          <div className="row-head">
            <div>
              <div className="eyebrow">Trending events</div>
              <h2 className="h-sec" style={{ marginTop: "14px" }}>
                What&apos;s on this week.
              </h2>
              <p>Across Sri Lanka, hand-picked by vibe.</p>
            </div>
            <Link href="#" className="btn btn-ghost">
              See all events <span className="arr">→</span>
            </Link>
          </div>
          <div className="events">
            {EVENTS.map((ev) => (
              <div className="event" key={ev.title}>
                <div className="event-img" style={{ background: ev.bg }}>
                  <div className="event-date">
                    <div className="d">{ev.d}</div>
                    <div className="m">{ev.m}</div>
                  </div>
                </div>
                <div className="event-body">
                  <div className="event-vibe">{ev.vibe}</div>
                  <h3>{ev.title}</h3>
                  <div className="event-meta">{ev.meta}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== MENU RATINGS ===================== */}
      <section className="sec-warm" id="about">
        <div className="wrap taste-grid">
          <div>
            <div className="eyebrow">Taste · Menu ratings</div>
            <h2 className="h-sec" style={{ margin: "16px 0 18px" }}>
              Restaurants competing
              <br />
              with <em>themselves</em>.
            </h2>
            <p className="lead">
              After your visit, rate individual dishes. Venues see which items
              are loved — and which to drop. Your taste shapes the menu.
            </p>
          </div>
          <div className="dishes">
            {dishes.map((dish, i) => (
              <div className="dish" key={dish.name}>
                <span className="dish-name">{dish.name}</span>
                <span className="dish-bar">
                  <i style={{ width: `${dish.pct}%` }}></i>
                </span>
                <button className="vote up" onClick={() => vote(i, "up")}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M5 13l7-7 7 7" />
                  </svg>
                  <b>{dish.up}</b>
                </button>
                <button className="vote down" onClick={() => vote(i, "down")}>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path d="M19 11l-7 7-7-7" />
                  </svg>
                  <b>{dish.down}</b>
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== APP CTA ===================== */}
      <section className="sec-dark app-cta" id="app">
        <div className="inner">
          <div className="eyebrow on-dark" style={{ justifyContent: "center" }}>
            App
          </div>
          <h2 className="h-sec">
            Reserve your seat.
            <br />
            <em>Save the hassle.</em>
          </h2>
          <p className="lead on-dark" style={{ margin: "0 auto" }}>
            Full booking available on web — or download the app for QR entry,
            push alerts, and exclusive in-app deals.
          </p>
          <div className="store-btns">
            <Link href="#" className="store">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 1.5c.1 1-.3 2-1 2.7-.7.8-1.7 1.3-2.7 1.2-.1-1 .4-2 1-2.6.7-.8 1.8-1.3 2.7-1.3zM19 17c-.4 1-.6 1.4-1.1 2.3-.8 1.3-1.9 2.9-3.3 2.9-1.2 0-1.5-.8-3.1-.8s-2 .8-3.1.8c-1.4 0-2.4-1.4-3.2-2.7C2.7 16.6 2.4 12.3 4 10c.9-1.4 2.3-2.2 3.7-2.2 1.3 0 2.1.8 3.1.8 1 0 1.6-.8 3.1-.8 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9 1.7 7.4z" />
              </svg>
              <span className="t">
                <small>Download on the</small>
                <b>App Store</b>
              </span>
            </Link>
            <Link href="#" className="store alt">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3.6 2.3 13 11.7 3.6 21.1c-.3-.2-.5-.6-.5-1V3.3c0-.4.2-.8.5-1zM14.7 9.9 5.7 1.6l11 6.4-2 1.9zm0 4.2 2 1.9-11 6.4 9-8.3zM18.4 11.1l2.8 1.6c.6.3.6 1.2 0 1.5l-2.8 1.6L16.1 12l2.3-2.3z" />
              </svg>
              <span className="t">
                <small>Get it on</small>
                <b>Google Play</b>
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* ===================== FAQ ===================== */}
      <section
        className="wrap"
        style={{
          maxWidth: "none",
          paddingLeft: "var(--pad)",
          paddingRight: "var(--pad)",
        }}
      >
        <div className="faq-wrap">
          <div
            className="sec-head"
            style={{
              textAlign: "center",
              maxWidth: "none",
              marginBottom: "clamp(32px,4vw,52px)",
            }}
          >
            <div className="eyebrow" style={{ justifyContent: "center" }}>
              FAQ
            </div>
            <h2 className="h-sec" style={{ marginTop: "14px" }}>
              Frequently asked questions
            </h2>
            <p className="lead" style={{ margin: "14px auto 0" }}>
              Everything you need to know before your first booking.
            </p>
          </div>
          <div>
            {FAQS.map((faq, i) => {
              const open = openFaq === i;
              return (
                <div className={`faq${open ? " open" : ""}`} key={faq.q}>
                  <button
                    className="faq-q"
                    onClick={() => setOpenFaq(open ? null : i)}
                  >
                    {faq.q}
                    <span className="faq-ic"></span>
                  </button>
                  <div
                    className="faq-a"
                    style={{ maxHeight: open ? "500px" : 0 }}
                  >
                    <p>{faq.a}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
