"use client";

import { useMemo, useState } from "react";
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
    loc: "Colombo 7",
    when: "Opens 11 AM",
    name: "The Patio",
    blurb: "Garden tables, slow lunch, easy music.",
  },
  {
    bg: "linear-gradient(150deg,#2a1410,#5a2018)",
    vibe: "Date night",
    live: false,
    loc: "Colombo 1",
    when: "Opens 6 PM",
    name: "Harbour Lights",
    blurb: "Harbour view, small plates, two-hour sittings.",
  },
  {
    bg: "linear-gradient(150deg,#101b2a,#1f3550)",
    vibe: "Live music",
    live: true,
    loc: "Colombo 3",
    when: "Opens 7 PM",
    name: "Rooftop Sessions",
    blurb: "Sets from 9. Book a table or just the door.",
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
    q: "Do I need an account to look around?",
    a: "No. Browse venues, events, and deals without signing in. You only need an account when you want to book a table or drop a beacon.",
  },
  {
    q: "Can I book from the website?",
    a: "Yes. Pick a venue, time, and table here — your QR is ready straight away. The app adds alerts and a few in-app deals on top.",
  },
  {
    q: "How do dish ratings work?",
    a: "After you eat, you can thumbs-up or thumbs-down individual dishes. Kitchens see what people actually finish — not just a star score for the room.",
  },
  {
    q: "Where does this work?",
    a: "Greater Colombo for now — 1 through 7, Galle Face, Battaramulla. Kandy, Galle, and Negombo are next. Set your radius and the map only shows what you can actually reach.",
  },
];

export default function HomePage() {
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set());
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
      prev.map((d, i) => (i === index ? { ...d, [dir]: d[dir] + 1 } : d)),
    );
  };

  const ringPct = 30 + (radius / 10) * 62;

  const filteredVenues = useMemo(
    () =>
      selectedVibes.size === 0
        ? VENUES
        : VENUES.filter((v) => selectedVibes.has(v.vibe)),
    [selectedVibes],
  );

  const filteredEvents = useMemo(
    () =>
      selectedVibes.size === 0
        ? EVENTS
        : EVENTS.filter((e) => selectedVibes.has(e.vibe)),
    [selectedVibes],
  );

  return (
    <div className="lp-home">
      {/* ===================== HERO ===================== */}
      <section className="hero sec-dark" id="discover">
        <div className="hero-inner wrap">
          <div className="hero-grid">
            <div className="hero-copy">
              <h1 className="hero-h1">
                What&apos;s the vibe
                <br />
                tonight?
              </h1>
              <p className="hero-sub">
                Rooftops in Colombo 3, late kitchens in 7, live sets by the
                water. Pick a mood — we&apos;ll show what&apos;s actually on
                within reach.
              </p>
              <div className="hero-actions">
                <Link href="#tonight" className="btn">
                  See tonight <span className="arr">→</span>
                </Link>
                <Link href="#app" className="hero-textlink">
                  Get the app
                </Link>
              </div>
              <p className="hero-aside">
                Or drop a two-hour beacon and let nearby venues send you a deal.
              </p>
            </div>

            <div className="hero-vis">
              <div className="tonight-board">
                <div className="tonight-board-h">
                  <span>Tonight</span>
                  <span className="tonight-board-sub">Greater Colombo</span>
                </div>
                {VENUES.map((v) => (
                  <div className="tonight-row" key={v.name}>
                    <div className="tonight-row-main">
                      <div className="tonight-name">{v.name}</div>
                      <div className="tonight-meta">
                        {v.loc} · {v.when}
                      </div>
                    </div>
                    <div className="tonight-row-side">
                      <span className="tag tag-line">{v.vibe}</span>
                      {v.live && (
                        <span className="tag tag-live">
                          <span className="dot"></span>Open
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="vibe-band" id="explore">
            <div className="vibe-head">
              <div className="vibe-title">Mood</div>
              <div className="vibe-note">
                Tap to narrow the lists.
                {selectedVibes.size > 0 && (
                  <>
                    {" "}
                    <button
                      className="vibe-clear"
                      onClick={() => setSelectedVibes(new Set())}
                    >
                      Clear
                    </button>
                  </>
                )}
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

      {/* ===================== TONIGHT — VENUES ===================== */}
      <section className="sec-list" id="tonight">
        <div className="wrap">
          <div className="row-head">
            <div>
              <h2 className="h-sec">Tables worth booking</h2>
              <p>Rooms that stay busy. Open the full list when you want more of Colombo.</p>
            </div>
            <Link href="/places" className="btn btn-ghost">
              All venues <span className="arr">→</span>
            </Link>
          </div>
          {filteredVenues.length === 0 ? (
            <p className="empty-note">
              Nothing in that mix — add another vibe, or clear a few.
            </p>
          ) : (
            <div
              className={
                filteredVenues.length === 3 ? "venues venues-bento" : "venues"
              }
            >
              {filteredVenues.map((v, i) => (
                <div
                  className={`venue${i === 0 && filteredVenues.length === 3 ? " featured" : ""}`}
                  key={v.name}
                >
                  <div className="venue-img" style={{ background: v.bg }}>
                    <span className="tag tag-y vibe">{v.vibe}</span>
                    {v.live && (
                      <span className="tag tag-live live">
                        <span className="dot"></span>Open
                      </span>
                    )}
                    <div className="ph">{v.name}</div>
                  </div>
                  <div className="venue-body">
                    <div className="venue-loc">
                      {v.loc} · {v.when}
                    </div>
                    <h3>{v.name}</h3>
                    <p className="venue-blurb">{v.blurb}</p>
                    <div className="venue-acts">
                      <Link className="va primary" href="/places">
                        Book a table
                      </Link>
                      <Link className="va" href="/events">
                        Events
                      </Link>
                      <Link className="va" href="/deals">
                        Deals
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== TONIGHT — EVENTS ===================== */}
      <section className="sec-list sec-warm" id="events">
        <div className="wrap">
          <div className="row-head">
            <div>
              <h2 className="h-sec">This week</h2>
              <p>Live sets, a market, a brunch.</p>
            </div>
            <Link href="/events" className="btn btn-ghost">
              All events <span className="arr">→</span>
            </Link>
          </div>
          {filteredEvents.length === 0 ? (
            <p className="empty-note">
              No events for those vibes this week. Try Live music or Party.
            </p>
          ) : (
            <div
              className={
                filteredEvents.length >= 3 ? "events" : "events events-few"
              }
            >
              {filteredEvents.map((ev) => (
                <Link className="event" href="/events" key={ev.title}>
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
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ===================== RADIUS EXPLORER ===================== */}
      <section className="sec-dark">
        <div className="wrap radius-grid">
          <div className="radius-copy">
            <h2 className="h-sec">
              How far
              <br />
              will you go?
            </h2>
            <p className="lead on-dark">
              One to ten kilometres. Toggle places, events, and deals — only
              what sits inside your circle.
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
                  aria-label="Radius in kilometres"
                  onChange={(e) => setRadius(Number(e.target.value))}
                />
              </div>
              <div className="radius-val">
                <span>{radius}</span> km<small>from you</small>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== BOOKING + STEPS ===================== */}
      <section className="sec-book">
        <div className="wrap book-grid">
          <div>
            <h2 className="h-sec" style={{ margin: "0 0 18px" }}>
              Book here.
              <br />
              Walk in with a QR.
            </h2>
            <p className="lead">
              No phone call. Pick a table and a time — the token sits on your
              phone. Scan at the door, sit down.
            </p>
            <div className="steps-inline">
              <div className="step-inline">
                <span>1</span>
                Pick a vibe and a room
              </div>
              <div className="step-inline">
                <span>2</span>
                Reserve the slot
              </div>
              <div className="step-inline">
                <span>3</span>
                Scan and sit
              </div>
            </div>
            <Link href="/places" className="btn" style={{ marginTop: "28px" }}>
              Find a table <span className="arr">→</span>
            </Link>
          </div>
          <div className="book-cards">
            <div className="book-card">
              <div
                className="bk-thumb"
                style={{ background: "var(--k)", color: "var(--w)" }}
              >
                P
              </div>
              <div className="bk-main">
                <div className="bk-name">The Patio — Colombo 7</div>
                <div className="bk-tags">Chill · Date night</div>
                <div className="bk-when">Tonight · 7:30 PM · Table 4</div>
              </div>
              <div className="bk-qr">
                <svg viewBox="0 0 40 40" fill="var(--w)">
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
                style={{ background: "var(--r)", color: "var(--w)" }}
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

      {/* ===================== MENU RATINGS ===================== */}
      <section className="sec-warm" id="about">
        <div className="wrap taste-grid">
          <div>
            <h2 className="h-sec" style={{ margin: "0 0 18px" }}>
              Rate the dish,
              <br />
              not the room.
            </h2>
            <p className="lead">
              After you eat, thumbs on individual plates. Kitchens see what
              people finish — and what to take off.
            </p>
          </div>
          <div className="dishes">
            {dishes.map((dish, i) => (
              <div className="dish" key={dish.name}>
                <span className="dish-name">{dish.name}</span>
                <span className="dish-bar">
                  <i style={{ width: `${dish.pct}%` }}></i>
                </span>
                <button
                  className="vote up"
                  onClick={() => vote(i, "up")}
                  aria-label={`Upvote ${dish.name}`}
                >
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
                <button
                  className="vote down"
                  onClick={() => vote(i, "down")}
                  aria-label={`Downvote ${dish.name}`}
                >
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
          <h2 className="h-sec">
            On the phone
            <br />
            for the door.
          </h2>
          <p className="lead on-dark" style={{ margin: "0 auto" }}>
            Booking works in the browser. The app is for the QR, the ping when
            your table&apos;s ready, and a few deals that stay in-app.
          </p>
          <div className="store-btns">
            <Link
              href="https://apps.apple.com/lk/app/kohedha/id6748849700"
              target="_blank"
              rel="noopener noreferrer"
              className="store"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M16.5 1.5c.1 1-.3 2-1 2.7-.7.8-1.7 1.3-2.7 1.2-.1-1 .4-2 1-2.6.7-.8 1.8-1.3 2.7-1.3zM19 17c-.4 1-.6 1.4-1.1 2.3-.8 1.3-1.9 2.9-3.3 2.9-1.2 0-1.5-.8-3.1-.8s-2 .8-3.1.8c-1.4 0-2.4-1.4-3.2-2.7C2.7 16.6 2.4 12.3 4 10c.9-1.4 2.3-2.2 3.7-2.2 1.3 0 2.1.8 3.1.8 1 0 1.6-.8 3.1-.8 1.2 0 2.5.7 3.4 1.8-3 1.6-2.5 5.9 1.7 7.4z" />
              </svg>
              <span className="t">
                <small>Download on the</small>
                <b>App Store</b>
              </span>
            </Link>
            <Link
              href="https://play.google.com/store/apps/details?id=com.theboat.kohedaapp"
              target="_blank"
              rel="noopener noreferrer"
              className="store alt"
            >
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
      <section className="sec-list">
        <div className="faq-wrap">
          <h2 className="h-sec faq-h">Before you go out</h2>
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
