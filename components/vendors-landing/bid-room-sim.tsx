"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE_OUT, QrGlyph, cx, pad } from "@/components/brand/primitives";
import { OFFERS, PROXIMITY_EDGE, RIVALS } from "./data";

type Phase = "pick" | "sending" | "result" | "won" | "scanned";

const START_SECONDS = 108;
const BASE_STATS = { won: 3, scanned: 11, booked: 14 };

export function BidRoomSim() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { amount: 0.4 });

  const [phase, setPhase] = useState<Phase>("pick");
  const [offerId, setOfferId] = useState("round");
  const [left, setLeft] = useState(START_SECONDS);
  const [stats, setStats] = useState(BASE_STATS);
  const timers = useRef<number[]>([]);
  const interacted = useRef(false);
  const autoplayed = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const offer = OFFERS.find((o) => o.id === offerId) ?? OFFERS[2];
  const myScore = offer.value + PROXIMITY_EDGE;
  const topRival = RIVALS.reduce((a, b) => (b.value > a.value ? b : a));
  const leading = myScore > topRival.value;
  const edgeDecided = leading && offer.value <= topRival.value;

  const board = [
    { id: "you", name: "You", km: 1.2, offer: offer.label, score: myScore },
    ...RIVALS.map((r) => ({ id: r.id, name: r.name, km: r.km, offer: r.offer, score: r.value })),
  ].sort((a, b) => b.score - a.score);

  const send = useCallback(() => {
    clearTimers();
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    const k = reduce ? 0.15 : 1;
    setPhase("sending");
    later(() => setPhase("result"), 1500 * k);
    if (offer.value + PROXIMITY_EDGE > topRival.value) {
      later(() => setPhase("won"), 3600 * k);
      later(() => {
        setPhase("scanned");
        setStats((s) => ({ won: s.won + 1, scanned: s.scanned + 4, booked: s.booked + 1 }));
      }, 6200 * k);
    }
  }, [offer.value, reduce, topRival.value]);

  // Raising keeps the Beacon's clock running; "Next Beacon" starts a fresh one.
  const raise = () => {
    clearTimers();
    setPhase("pick");
  };
  const reset = () => {
    raise();
    setLeft(START_SECONDS);
  };

  // Play once on arrival so the flow is visible without interaction.
  useEffect(() => {
    if (!inView || autoplayed.current || reduce) return;
    const id = window.setTimeout(() => {
      if (interacted.current) return;
      autoplayed.current = true;
      send();
    }, 3200);
    return () => window.clearTimeout(id);
  }, [inView, reduce, send]);

  const ticking = phase === "pick" || phase === "sending" || phase === "result";
  useEffect(() => {
    if (!ticking || !inView) return;
    const id = window.setInterval(() => setLeft((s) => Math.max(0, s - 1)), 1000);
    return () => window.clearInterval(id);
  }, [ticking, inView]);

  const status =
    phase === "pick"
      ? { tone: "muted", title: "2 other venues can see this Beacon", sub: "One offer each. Best one wins." }
      : phase === "sending"
        ? { tone: "muted", title: "Bids are in…", sub: "Comparing offers" }
        : phase === "result" && leading
          ? { tone: "lead", title: "Your offer is leading", sub: edgeDecided ? "Being closest gave you the edge" : "2 other venues bidding" }
          : phase === "result"
            ? { tone: "out", title: `Outbid by ${topRival.name}`, sub: topRival.offer }
            : phase === "won"
              ? { tone: "lead", title: "You won the table", sub: "Group of 4 arriving around 7:40 PM" }
              : { tone: "done", title: "4 guests scanned in", sub: "You're charged now, not before" };

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[500px]"
      onPointerDown={() => (interacted.current = true)}
      onKeyDown={() => (interacted.current = true)}
    >
      <div className="mb-3 flex items-center justify-between px-1 text-[12px] font-medium uppercase tracking-[0.14em] text-kh-muted">
        {/* <span className="flex items-center gap-2">
          <span aria-hidden="true" className="kh-live inline-block h-1.5 w-1.5 bg-kh-ember" />
          Interactive demo
        </span> */}
        {/* <span>Try a bid</span> */}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.5 }}
        className="relative overflow-hidden rounded-[28px] bg-kh-ink p-5 text-kh-cream shadow-[0_40px_100px_-30px_rgba(26,26,26,0.6)] sm:p-6"
      >
        <div aria-hidden="true" className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-kh-ember/25 blur-3xl" />

        <div className="relative flex items-center justify-between gap-3">
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em] text-kh-ember">Bid Room · new Beacon</span>
          <span className="text-[13px] tabular-nums text-kh-mist">
            {phase === "won" || phase === "scanned" ? "Closed" : `${Math.floor(left / 60)}:${pad(left % 60)} left`}
          </span>
        </div>
        <p className="relative m-0 mt-4 text-[22px] font-medium leading-tight">Group of 4 · after work</p>
        <p className="relative m-0 mt-1 text-[15px] text-kh-cream/70">LKR 3–5k each · 1.2 km from you</p>
        <div className="relative mt-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-kh-cream px-3 py-1 text-[13px] text-kh-ink">#rooftop</span>
          <span className="rounded-full bg-kh-cream px-3 py-1 text-[13px] text-kh-ink">#cocktails</span>
          <span className="flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1 text-[13px] text-kh-cream/80">
            <CheckIcon className="h-3.5 w-3.5 text-kh-ember" />
            Matches your vibe
          </span>
        </div>

        <div className="relative mt-5 min-h-[252px]">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "pick" && (
              <motion.fieldset
                key="pick"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: EASE_OUT }}
                className="m-0 border-0 p-0"
              >
                <legend className="mb-2 p-0 text-[13px] text-kh-mist">Your offer</legend>
                <div className="flex flex-col gap-1.5">
                  {OFFERS.map((o) => {
                    const on = o.id === offerId;
                    return (
                      <label
                        key={o.id}
                        className={cx(
                          "group relative flex h-11 cursor-pointer items-center gap-3 rounded-xl px-3.5 text-[14px] transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-[3px] has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-kh-ember",
                          on ? "bg-kh-cream text-kh-ink" : "bg-white/[0.05] text-kh-cream/80 hover:bg-white/10",
                        )}
                      >
                        <input
                          type="radio"
                          name="bid-offer"
                          value={o.id}
                          checked={on}
                          onChange={() => setOfferId(o.id)}
                          className="sr-only"
                        />
                        <span
                          aria-hidden="true"
                          className={cx(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                            on ? "border-kh-ink" : "border-white/30",
                          )}
                        >
                          {on && <motion.span layoutId="bid-dot" className="block h-2 w-2 rounded-full bg-kh-ember" />}
                        </span>
                        <span className="min-w-0 flex-1 truncate">{o.label}</span>
                        <Strength value={o.value} dark={on} />
                      </label>
                    );
                  })}
                </div>
                <motion.button
                  type="button"
                  onClick={send}
                  whileTap={{ scale: 0.98 }}
                  className="kh-focus group relative mt-3 flex h-12 w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-kh-ember text-[15px] font-medium text-kh-ink"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[420%]"
                  />
                  Send bid
                </motion.button>
              </motion.fieldset>
            )}

            {(phase === "sending" || phase === "result") && (
              <motion.div
                key="board"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <p className="m-0 mb-2 text-[13px] text-kh-mist">Offers on this Beacon</p>
                <ol className="m-0 flex list-none flex-col gap-2 p-0">
                  {(phase === "result" ? board : board.filter((b) => b.id === "you")).map((b, i) => {
                    const me = b.id === "you";
                    const top = phase === "result" && i === 0;
                    return (
                      <motion.li
                        key={b.id}
                        layout
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ type: "spring", stiffness: 360, damping: 30, delay: me ? 0 : 0.1 + i * 0.15 }}
                        className={cx(
                          "rounded-xl border px-3.5 py-2.5",
                          me ? "border-kh-ember/70 bg-white/[0.07]" : "border-white/[0.08] bg-white/[0.03]",
                        )}
                      >
                        <div className="flex items-center justify-between gap-3 text-[12px] text-kh-mist">
                          <span>
                            {b.name} · {b.km} km
                          </span>
                          {top && (
                            <span className={cx("rounded-full px-2 py-0.5 text-[11px]", me ? "bg-kh-ember text-kh-ink" : "border border-white/20 text-kh-cream")}>
                              Leading
                            </span>
                          )}
                        </div>
                        <p className={cx("m-0 mt-0.5 truncate text-[14px]", me ? "text-kh-cream" : "text-kh-cream/70")}>{b.offer}</p>
                        <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
                          <motion.div
                            className={cx("h-full rounded-full", me ? "bg-kh-ember" : "bg-kh-cream/40")}
                            initial={{ width: 0 }}
                            animate={{ width: `${(b.score / 4.3) * 100}%` }}
                            transition={{ duration: 0.8, ease: EASE_OUT, delay: 0.2 }}
                          />
                        </div>
                      </motion.li>
                    );
                  })}
                </ol>
                {phase === "sending" && (
                  <div className="kh-typing mt-3 flex gap-1 px-1 text-kh-mist" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </div>
                )}
              </motion.div>
            )}

            {(phase === "won" || phase === "scanned") && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="flex min-h-[252px] items-center gap-5"
              >
                <div className="relative shrink-0 overflow-hidden rounded-2xl bg-kh-cream p-2.5">
                  <QrGlyph seed={"win" + offerId} className="h-[120px] w-[120px]" />
                  {phase === "won" && (
                    <motion.span
                      aria-hidden="true"
                      className="kh-motion-only absolute inset-x-0 h-0.5 bg-kh-ember shadow-[0_0_12px_2px_rgba(232,116,77,0.8)]"
                      initial={{ top: "8%" }}
                      animate={{ top: ["8%", "92%", "8%"] }}
                      transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                    />
                  )}
                  <AnimatePresence>
                    {phase === "scanned" && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.6 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                        className="absolute inset-0 flex items-center justify-center bg-kh-cream/85"
                      >
                        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-kh-ember text-kh-ink">
                          <CheckIcon className="h-7 w-7" draw />
                        </span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="min-w-0">
                  <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-kh-ember">
                    {phase === "won" ? "At your door" : "Scanned in"}
                  </p>
                  <p className="m-0 mt-1 text-[18px] font-medium leading-snug">{offer.label}</p>
                  <p className="m-0 mt-1 text-[14px] text-kh-cream/70">
                    {phase === "won" ? "Staff scan the group's pass on any phone." : "Table T7 · 4 guests · 7:41 PM"}
                  </p>
                  {phase === "scanned" && (
                    <button
                      type="button"
                      onClick={reset}
                      className="kh-focus mt-4 h-10 rounded-xl border border-white/20 px-4 text-[13px] transition-colors hover:bg-white/10"
                    >
                      Next Beacon
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Status strip */}
      <motion.div
        layout
        aria-live="polite"
        className={cx(
          "mt-3 flex items-center justify-between gap-4 rounded-[18px] border-2 bg-white px-5 py-3.5 transition-colors duration-500",
          status.tone === "lead" || status.tone === "done" ? "border-kh-ember" : status.tone === "out" ? "border-kh-ink" : "border-kh-sand",
        )}
      >
        <div className="min-w-0">
          <p className="m-0 text-[15px] font-medium">{status.title}</p>
          <p className="m-0 truncate text-[13px] text-kh-muted">{status.sub}</p>
        </div>
        {phase === "result" && !leading && (
          <button
            type="button"
            onClick={raise}
            className="kh-focus shrink-0 rounded-xl bg-kh-ink px-4 py-2.5 text-[13px] font-medium text-kh-cream transition-colors hover:bg-black"
          >
            Raise your bid
          </button>
        )}
        {status.tone === "lead" && <span aria-hidden="true" className="kh-live h-2.5 w-2.5 shrink-0 bg-kh-ember" />}
      </motion.div>

      {/* Live stats */}
      <dl className="m-0 mt-3 grid grid-cols-3 gap-2.5">
        {[
          { k: "Beacons won", v: stats.won },
          { k: "Guests scanned", v: stats.scanned },
          { k: "Tables booked", v: stats.booked },
        ].map((s) => (
          <div key={s.k} className="flex flex-col-reverse gap-1 rounded-2xl border border-kh-sand bg-white p-3.5">
            <dt className="text-[12px] text-kh-muted">{s.k}</dt>
            <dd className="relative m-0 h-7 overflow-hidden text-[22px] font-medium tabular-nums leading-7">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={s.v}
                  className="block"
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -24, opacity: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT }}
                >
                  {s.v}
                </motion.span>
              </AnimatePresence>
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function Strength({ value, dark }: { value: number; dark: boolean }) {
  return (
    <span aria-hidden="true" className="flex items-end gap-0.5">
      {[1, 2, 3, 4].map((n) => (
        <span
          key={n}
          className={cx(
            "block w-1 rounded-full",
            n <= value ? (dark ? "bg-kh-ink" : "bg-kh-ember") : dark ? "bg-kh-ink/20" : "bg-white/15",
          )}
          style={{ height: 4 + n * 3 }}
        />
      ))}
    </span>
  );
}

function CheckIcon({ className, draw = false }: { className?: string; draw?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        initial={draw ? { pathLength: 0 } : false}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 0.15 }}
      />
    </svg>
  );
}
