"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { PLACES, RADII, VIBES, type Place, type Vibe } from "./data";
import { ArrowRight, EASE_OUT, Kicker, Photo, Reveal, SplitHeading, cx } from "@/components/brand/primitives";

const MAP = { size: 400, cx: 215, cy: 205, kmPx: 34 };

const plural = (n: number, w: string) => `${n} ${w}${n === 1 ? "" : "s"}`;

function pinXY(p: Place) {
  const a = (p.bearing * Math.PI) / 180;
  return { x: MAP.cx + Math.sin(a) * p.km * MAP.kmPx, y: MAP.cy - Math.cos(a) * p.km * MAP.kmPx };
}

export function Browse() {
  const [vibe, setVibe] = useState<Vibe>("rooftop");
  const [radius, setRadius] = useState(3);
  const [hover, setHover] = useState<string | null>(null);

  const all = PLACES[vibe];
  const inRange = all.filter((p) => p.km <= radius).sort((a, b) => a.km - b.km);
  const deals = inRange.filter((p) => p.kind === "deal").length;
  const events = inRange.filter((p) => p.kind === "event").length;
  const wider = RADII.find((r) => r > radius);

  return (
    <section id="explore" aria-labelledby="explore-title" className="bg-kh-cream pb-20 pt-24 text-kh-ink sm:pb-24 sm:pt-32 lg:pb-28 lg:pt-40">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            {/* <Kicker>Rather look around?</Kicker> */}
            <SplitHeading
              id="explore-title"
              text={"Browse by *vibe,*\nnot by cuisine."}
              accentClassName="text-kh-ember-deep"
              className="m-0 mt-6 text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.02] tracking-[-0.04em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="m-0 text-[18px] leading-relaxed text-kh-body">
              Pick a mood and a radius. The map shows every venue, live deal and event that fits, from street food to
              rooftops.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <LayoutGroup id="browse">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="relative -mx-4 sm:mx-0">
                <div
                  role="group"
                  aria-label="Pick a vibe"
                  className="kh-no-scrollbar flex gap-2 overflow-x-auto px-4 pb-1 sm:flex-wrap sm:overflow-visible sm:px-0"
                >
                  {VIBES.map((v) => (
                    <button
                      key={v}
                      type="button"
                      aria-pressed={vibe === v}
                      onClick={() => setVibe(v)}
                      className={cx(
                        "kh-focus relative h-11 shrink-0 rounded-full px-5 text-[15px] transition-colors duration-300",
                        vibe === v ? "text-kh-cream" : "text-kh-body hover:text-kh-ink",
                      )}
                    >
                      {vibe === v ? (
                        <motion.span
                          layoutId="vibe-pill"
                          className="absolute inset-0 rounded-full bg-kh-ink"
                          transition={{ type: "spring", stiffness: 400, damping: 34 }}
                        />
                      ) : (
                        <span className="absolute inset-0 rounded-full border border-kh-line" />
                      )}
                      <span className="relative">#{v}</span>
                    </button>
                  ))}
                </div>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-kh-cream sm:hidden"
                />
              </div>

              <div
                role="group"
                aria-label="Distance from you"
                className="grid w-full shrink-0 grid-cols-4 gap-1 rounded-full bg-kh-sand p-1 sm:w-auto"
              >
                {RADII.map((r) => (
                  <button
                    key={r}
                    type="button"
                    aria-pressed={radius === r}
                    onClick={() => setRadius(r)}
                    className={cx(
                      "kh-focus relative h-10 rounded-full px-5 text-[14px] tabular-nums transition-colors",
                      radius === r ? "text-kh-cream" : "text-kh-muted hover:text-kh-ink",
                    )}
                  >
                    {radius === r && (
                      <motion.span
                        layoutId="radius-pill"
                        className="absolute inset-0 rounded-full bg-kh-ink"
                        transition={{ type: "spring", stiffness: 400, damping: 34 }}
                      />
                    )}
                    <span className="relative">{r} km</span>
                  </button>
                ))}
              </div>
            </div>
          </LayoutGroup>

          <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8">
            <VibeMap all={all} radius={radius} hover={hover} setHover={setHover} />

            <div className="flex flex-col rounded-[32px] border border-kh-line bg-white p-4 sm:p-6">
              <div className="flex items-center justify-between px-1 pb-4">
                <div>
                  <p className="m-0 text-[13px] text-kh-muted">Tonight near you</p>
                  <p className="m-0 text-[22px] font-medium tracking-[-0.02em]">#{vibe}</p>
                </div>
                <span className="flex items-center gap-2 rounded-full bg-kh-sand px-3 py-1.5 text-[13px]">
                  <span aria-hidden="true" className="kh-live inline-block h-1.5 w-1.5 rounded-full bg-kh-ember" />
                  Open now
                </span>
              </div>

              <ul className="m-0 flex min-h-[312px] list-none flex-col gap-2.5 p-0">
                <AnimatePresence mode="popLayout" initial={false}>
                  {inRange.map((p) => (
                    <motion.li
                      key={vibe + p.name}
                      layout
                      initial={{ opacity: 0, y: 16, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      onPointerEnter={() => setHover(p.name)}
                      onPointerLeave={() => setHover(null)}
                      className={cx(
                        "group flex items-center gap-4 rounded-[22px] p-2.5 pr-4 transition-colors duration-300",
                        hover === p.name ? "bg-kh-sand" : "bg-kh-cream",
                      )}
                    >
                      <div className="h-[72px] w-[72px] shrink-0 overflow-hidden rounded-2xl">
                        <Photo
                          name={p.photo}
                          decorative
                          sizes="72px"
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="m-0 truncate text-[16px] font-medium">{p.name}</p>
                        <p className="m-0 truncate text-[13px] text-kh-muted">
                          {p.area} · {p.km} km
                        </p>
                        <span
                          className={cx(
                            "mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[12px]",
                            p.kind === "deal" && "bg-kh-ember text-kh-ink",
                            p.kind === "event" && "bg-kh-ink text-kh-cream",
                            p.kind === "info" && "bg-kh-sand text-kh-body",
                          )}
                        >
                          {p.kind === "deal" ? "Deal · " : p.kind === "event" ? "Event · " : ""}
                          {p.note}
                        </span>
                      </div>
                    </motion.li>
                  ))}
                  {inRange.length === 0 && (
                    <motion.li
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-1 flex-col items-center justify-center gap-2 rounded-[22px] bg-kh-cream p-8 text-center text-[15px] text-kh-body"
                    >
                      Nothing for #{vibe} within {radius} km yet.
                      {wider && (
                        <button
                          type="button"
                          onClick={() => setRadius(wider)}
                          className="kh-focus kh-link font-medium text-kh-ink"
                        >
                          Try {wider} km
                        </button>
                      )}
                    </motion.li>
                  )}
                </AnimatePresence>
              </ul>

              <div className="mt-4 flex flex-col gap-3 border-t border-kh-line px-1 pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="m-0 text-[13px] text-kh-muted" aria-live="polite">
                  {plural(inRange.length, "place")} · {plural(deals, "live deal")} · {plural(events, "event")} within{" "}
                  {radius} km
                </p>
                <Link href="/places" className="kh-focus group inline-flex items-center gap-2 text-[15px] font-medium">
                  <span className="kh-link">Open the full map</span>
                  <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function VibeMap({
  all,
  radius,
  hover,
  setHover,
}: {
  all: Place[];
  radius: number;
  hover: string | null;
  setHover: (name: string | null) => void;
}) {
  return (
    <div
      role="img"
      aria-label={`Map around Colombo 3 with a ${radius} km radius. ${all.filter((p) => p.km <= radius).length} of ${all.length} places fall inside it.`}
      className="relative aspect-square w-full overflow-hidden rounded-[32px] border border-kh-line bg-[#F3EFE8] lg:aspect-auto lg:min-h-[520px]"
    >
      <svg viewBox={`0 0 ${MAP.size} ${MAP.size}`} preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" aria-hidden="true">
        {/* Sea along the west coast */}
        <path d="M0 0 H62 C48 60 70 110 54 160 C40 210 66 260 50 310 C40 350 58 380 52 400 H0 Z" fill="#E3DED4" />
        {[40, 90, 150, 220, 290, 350].map((y) => (
          <path key={y} d={`M8 ${y} q8 -5 16 0 t16 0`} stroke="#D2CBBF" strokeWidth="1.2" fill="none" />
        ))}
        {/* Streets */}
        <g stroke="#E6E0D6" strokeWidth="7" strokeLinecap="round" fill="none">
          <path d="M70 60 L380 110" />
          <path d="M60 200 L400 230" />
          <path d="M70 330 L390 300" />
          <path d="M150 0 L190 400" />
          <path d="M280 0 L250 400" />
          <path d="M60 130 C160 150 250 90 400 60" />
        </g>
        <g stroke="#ECE7DE" strokeWidth="3" fill="none">
          <path d="M100 0 L120 400" />
          <path d="M330 0 L350 400" />
          <path d="M60 270 L400 260" />
          <path d="M60 95 L400 170" />
        </g>
        {/* Park */}
        <rect x="292" y="140" width="46" height="34" rx="10" fill="#E2E4D6" />
        <g fontFamily="inherit" fontSize="9" fill="#9A9288" letterSpacing="0.08em">
          <text x="70" y="44">GALLE FACE</text>
          <text x="388" y="130" textAnchor="end">COLOMBO 7</text>
          <text x="112" y="380">COLOMBO 4</text>
          <text x="388" y="360" textAnchor="end">BATTARAMULLA</text>
        </g>

        {/* Radius */}
        <motion.circle
          cx={MAP.cx}
          cy={MAP.cy}
          fill="rgba(232,116,77,0.08)"
          stroke="#E8744D"
          strokeWidth="1.5"
          strokeDasharray="5 5"
          initial={false}
          animate={{ r: radius * MAP.kmPx }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </svg>

      {/* You */}
      <div
        aria-hidden="true"
        className="absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: `${(MAP.cx / MAP.size) * 100}%`, top: `${(MAP.cy / MAP.size) * 100}%` }}
      >
        <span className="kh-live block h-4 w-4 border-2 border-white bg-kh-ink" />
        <span className="absolute left-6 top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-kh-ink px-2 py-0.5 text-[11px] text-kh-cream">
          You
        </span>
      </div>

      {/* Pins */}
      <div aria-hidden="true">
        {all.map((p, i) => {
          const { x, y } = pinXY(p);
          const inside = p.km <= radius;
          const hot = hover === p.name;
          return (
            <span
              key={p.name + p.bearing}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${(x / MAP.size) * 100}%`, top: `${(y / MAP.size) * 100}%`, zIndex: hot ? 10 : 1 }}
              onPointerEnter={() => setHover(p.name)}
              onPointerLeave={() => setHover(null)}
            >
              <motion.span
                className="relative block"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: inside ? 1 : 0.4, scale: hot ? 1.35 : 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 22, delay: i * 0.05 }}
              >
                <span
                  className={cx(
                    "block h-4 w-4 border-2 border-white shadow-[0_4px_12px_rgba(26,26,26,0.25)] transition-colors duration-300",
                    inside ? (p.kind === "deal" ? "bg-kh-ember" : "bg-kh-ink") : "bg-kh-mist",
                  )}
                />
              </motion.span>
              <span
                className={cx(
                  "pointer-events-none absolute left-1/2 -translate-x-1/2",
                  y > MAP.cy ? "top-6" : "bottom-6",
                )}
              >
                <AnimatePresence>
                  {(hot || (inside && p.kind === "deal")) && (
                    <motion.span
                      initial={{ opacity: 0, y: y > MAP.cy ? -4 : 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: y > MAP.cy ? -4 : 4 }}
                      transition={{ duration: 0.2, ease: EASE_OUT }}
                      className="block whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] font-medium text-kh-ink shadow-md"
                    >
                      {p.name}
                    </motion.span>
                  )}
                </AnimatePresence>
              </span>
            </span>
          );
        })}
      </div>

      <div className="absolute bottom-4 left-4 flex items-center gap-4 rounded-full bg-white/90 px-4 py-2 text-[12px] text-kh-body backdrop-blur">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-kh-ember" /> Deal
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-kh-ink" /> Venue
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="h-2.5 w-2.5 bg-kh-mist" /> Too far
        </span>
      </div>
    </div>
  );
}
