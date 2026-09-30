"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { SIM_BIDS, SIM_BUDGETS, SIM_VIBES, type SimVibe } from "./data";
import { EASE_OUT, Photo, QrGlyph, Radar, cx, hms } from "@/components/brand/primitives";

type Phase = "idle" | "casting" | "bidding" | "won" | "pass";
type Target = "plus" | `budget-${number}` | `vibe-${SimVibe}` | "cast" | "accept";

/** One beat of the looping demo: what the card shows, where the tap-cursor is, and for how long. */
type Frame = {
  phase: Phase;
  group: number;
  budget: number;
  vibe: SimVibe | null;
  arrived: number;
  cursor: Target | null;
  tap: boolean;
  dur: number;
};

// Each loop plays a different Beacon so it doesn't feel canned.
const SCENARIOS: { group: number; budget: number; vibe: SimVibe }[] = [
  { group: 4, budget: 1, vibe: "rooftop" },
  { group: 2, budget: 2, vibe: "datenight" },
  { group: 6, budget: 0, vibe: "livemusic" },
];

function buildTimeline(sc: (typeof SCENARIOS)[number]): Frame[] {
  const frames: Frame[] = [];
  let f: Frame = { phase: "idle", group: 2, budget: 0, vibe: null, arrived: 0, cursor: null, tap: false, dur: 0 };
  const beat = (patch: Partial<Frame>) => {
    f = { ...f, tap: false, ...patch };
    frames.push(f);
  };

  beat({ dur: 1100 });
  // Pick the group size, one tap per extra person
  if (sc.group > 2) {
    beat({ cursor: "plus", dur: 700 });
    for (let g = 3; g <= sc.group; g++) beat({ group: g, tap: true, dur: 420 });
  }
  beat({ cursor: `budget-${sc.budget}`, dur: 700 });
  beat({ budget: sc.budget, tap: true, dur: 650 });
  beat({ cursor: `vibe-${sc.vibe}`, dur: 700 });
  beat({ vibe: sc.vibe, tap: true, dur: 700 });
  beat({ cursor: "cast", dur: 700 });
  beat({ tap: true, dur: 450 });
  // Cast, bids arrive, the lead changes hands
  beat({ phase: "casting", cursor: null, dur: 1900 });
  beat({ phase: "bidding", arrived: 0, dur: 350 });
  for (let n = 1; n <= SIM_BIDS[sc.vibe].length; n++) beat({ arrived: n, dur: 950 });
  beat({ phase: "won", dur: 1800 });
  beat({ cursor: "accept", dur: 700 });
  beat({ tap: true, dur: 450 });
  beat({ phase: "pass", cursor: null, dur: 3600 });
  return frames;
}

const TIMELINES = SCENARIOS.map(buildTimeline);
const WON_FRAME = TIMELINES[0].findIndex((f) => f.phase === "won");
const BEACON_SECONDS = 2 * 60 * 60;

/**
 * Self-playing Beacon demo for the hero. Purely illustrative (hidden from assistive tech, with a
 * text summary instead); it loops only while on screen and not paused, and holds on the winning
 * offer for reduced-motion visitors.
 */
export function BeaconSimulator({ paused = false }: { paused?: boolean }) {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const targets = useRef(new Map<Target, HTMLElement>());
  const inView = useInView(rootRef, { amount: 0.3 });

  const [loop, setLoop] = useState(0);
  const [step, setStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });

  const scenario = loop % SCENARIOS.length;
  const frame = TIMELINES[scenario][step];
  const { phase, group, budget, vibe, arrived } = frame;

  // Reduced motion: show the most informative moment instead of the empty form.
  useEffect(() => {
    if (reduce) setStep(WON_FRAME);
  }, [reduce]);

  // Advance the script.
  useEffect(() => {
    if (paused || !inView) return;
    const id = window.setTimeout(() => {
      if (step + 1 < TIMELINES[scenario].length) setStep(step + 1);
      else {
        setLoop((l) => l + 1);
        setStep(0);
      }
    }, frame.dur);
    return () => window.clearTimeout(id);
  }, [paused, inView, scenario, step, frame.dur]);

  // Beacon countdown while bids are live; restarts with each Beacon.
  useEffect(() => setElapsed(0), [loop]);
  const live = phase === "bidding" || phase === "won";
  useEffect(() => {
    if (!live || paused || !inView) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [live, paused, inView]);

  // Glide the tap-cursor to whatever this beat points at.
  useLayoutEffect(() => {
    if (!frame.cursor) return;
    const place = () => {
      const el = targets.current.get(frame.cursor!);
      const card = cardRef.current;
      if (!el || !card) return false;
      const r = el.getBoundingClientRect();
      const c = card.getBoundingClientRect();
      setCursorPos({ x: r.left - c.left + r.width / 2 + 6, y: r.top - c.top + r.height / 2 + 8 });
      return true;
    };
    if (!place()) {
      const id = requestAnimationFrame(place);
      return () => cancelAnimationFrame(id);
    }
  }, [frame.cursor, loop, step]);

  // Park the cursor low on the card before its first move.
  useLayoutEffect(() => {
    const card = cardRef.current;
    if (card) setCursorPos({ x: card.offsetWidth * 0.78, y: card.offsetHeight * 0.92 });
  }, []);

  const register = useCallback(
    (key: Target) => (el: HTMLElement | null) => {
      if (el) targets.current.set(key, el);
      else targets.current.delete(key);
    },
    [],
  );
  const tapping = (key: Target) => frame.tap && frame.cursor === key;

  const bids = vibe ? SIM_BIDS[vibe].slice(0, arrived).sort((a, b) => b.strength - a.strength) : [];
  const winnerAll = vibe ? [...SIM_BIDS[vibe]].sort((a, b) => b.strength - a.strength)[0] : null;
  const shownVibe = vibe ?? SCENARIOS[scenario].vibe;

  return (
    <div ref={rootRef} className="relative w-full max-w-[468px]">
      <p className="sr-only">
        Animated example: a group picks its size, budget per head and vibe, then casts a Beacon. Nearby venues send
        offers, the strongest one wins, and accepting it turns it into a QR pass to show at the door.
      </p>

      <div
        ref={cardRef}
        aria-hidden="true"
        className="relative select-none overflow-hidden rounded-[28px] border border-white/10 bg-[#161412]/80 p-5 text-kh-cream shadow-[0_40px_120px_-24px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-6"
      >
        <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-kh-ember/20 blur-3xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between gap-3">
          <p className="m-0 text-[17px] font-medium">Your Beacon</p>
          <StatusPill phase={phase} left={BEACON_SECONDS - elapsed} />
        </div>

        <AnimatePresence initial={false}>
          {phase !== "idle" && (
            <motion.div
              key="summary"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4, ease: EASE_OUT }}
              className="relative overflow-hidden"
            >
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2 pt-3 text-[14px] text-kh-cream/70">
                <span>
                  {group} people · LKR {SIM_BUDGETS[budget]} each · within 3 km
                </span>
                <span className="rounded-full bg-kh-cream px-3 py-1 text-[12px] font-medium text-kh-ink">#{shownVibe}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-5 min-h-[384px]">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "idle" && (
              <motion.div
                key={`form-${loop}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="flex flex-col gap-5"
              >
                <Field label="How many of you?">
                  <div className="flex h-12 items-center justify-between rounded-2xl border border-white/[0.12] bg-white/[0.04] p-1">
                    <StepGlyph>
                      <path d="M5 12h14" />
                    </StepGlyph>
                    <span className="relative h-6 overflow-hidden text-[15px] tabular-nums">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={group}
                          className="block"
                          initial={{ y: 18, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -18, opacity: 0 }}
                          transition={{ duration: 0.25, ease: EASE_OUT }}
                        >
                          {group} people
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <StepGlyph ref={register("plus")} pressed={tapping("plus")}>
                      <path d="M12 5v14M5 12h14" />
                    </StepGlyph>
                  </div>
                </Field>

                <Field label="Budget per head">
                  <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/[0.12] bg-white/[0.04] p-1">
                    {SIM_BUDGETS.map((b, i) => (
                      <span
                        key={b}
                        ref={register(`budget-${i}`)}
                        className={cx(
                          "relative flex h-10 items-center justify-center rounded-xl text-[14px] transition-colors duration-300",
                          budget === i ? "text-kh-ink" : "text-kh-cream/70",
                        )}
                      >
                        {budget === i && (
                          <motion.span
                            layoutId="sim-budget"
                            className="absolute inset-0 rounded-xl bg-kh-cream"
                            transition={{ type: "spring", stiffness: 420, damping: 34 }}
                          />
                        )}
                        <span className="relative">LKR {b}</span>
                      </span>
                    ))}
                  </div>
                </Field>

                <Field label="What's the vibe?">
                  <div className="flex flex-wrap gap-2">
                    {SIM_VIBES.map((v) => (
                      <motion.span
                        key={v}
                        ref={register(`vibe-${v}`)}
                        animate={{ scale: tapping(`vibe-${v}`) ? 0.94 : 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 20 }}
                        className={cx(
                          "flex h-9 items-center rounded-full border px-3.5 text-[13px] transition-colors duration-300",
                          vibe === v ? "border-kh-ember bg-kh-ember text-kh-ink" : "border-white/15 text-kh-cream/80",
                        )}
                      >
                        #{v}
                      </motion.span>
                    ))}
                  </div>
                </Field>

                <motion.div
                  ref={register("cast")}
                  animate={{ scale: tapping("cast") ? 0.97 : 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 22 }}
                  className={cx(
                    "relative mt-1 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-kh-ember text-[16px] font-medium text-kh-ink transition-shadow duration-300",
                    frame.cursor === "cast" && "shadow-[0_0_0_4px_rgba(232,116,77,0.25)]",
                  )}
                >
                  <BeaconIcon />
                  Cast Beacon
                </motion.div>
              </motion.div>
            )}

            {phase === "casting" && (
              <motion.div
                key="casting"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={{ duration: 0.4, ease: EASE_OUT }}
                className="flex flex-col items-center justify-center gap-4 pt-4"
              >
                <div className="relative h-[240px] w-[240px]">
                  <Radar className="h-full w-full" />
                  {SIM_BIDS[shownVibe].map((b, i) => {
                    const angle = (i / 3) * Math.PI * 2 + 0.6;
                    const r = 52 + b.km * 18;
                    return (
                      <motion.span
                        key={b.id}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.35 + i * 0.3, type: "spring", stiffness: 380, damping: 18 }}
                        className="absolute h-3 w-3 bg-kh-cream"
                        style={{ left: 120 + Math.cos(angle) * r - 6, top: 120 + Math.sin(angle) * r - 6 }}
                      />
                    );
                  })}
                </div>
                <p className="m-0 text-center text-[15px] text-kh-cream/80">
                  Reaching <span className="text-kh-ember">#{shownVibe}</span> venues within 3 km…
                </p>
              </motion.div>
            )}

            {(phase === "bidding" || phase === "won") && (
              <motion.div
                key="bids"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                className="flex min-h-[384px] flex-col gap-3"
              >
                <div className="flex items-center gap-3 px-1 text-[13px] text-kh-cream/60">
                  <span className="h-px flex-1 bg-white/[0.12]" />
                  <span className="tabular-nums">
                    {bids.length} venue{bids.length === 1 ? "" : "s"} competing for you
                  </span>
                  <span className="h-px flex-1 bg-white/[0.12]" />
                </div>

                <ul className="m-0 flex list-none flex-col gap-2.5 p-0">
                  <AnimatePresence initial={false} mode="popLayout">
                    {bids.map((b, i) => {
                      const top = i === 0;
                      const winner = top && phase === "won";
                      return (
                        <motion.li
                          key={b.id}
                          layout
                          initial={{ opacity: 0, y: 24, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, transition: { duration: 0.2 } }}
                          transition={{ type: "spring", stiffness: 360, damping: 30 }}
                          className={cx(
                            "overflow-hidden rounded-[20px] border transition-colors duration-500",
                            winner
                              ? "border-kh-ember bg-kh-cream text-kh-ink shadow-[0_20px_60px_-12px_rgba(232,116,77,0.45)]"
                              : top
                                ? "border-kh-ember/60 bg-white/[0.07]"
                                : "border-white/[0.08] bg-white/[0.03] text-kh-cream/60",
                          )}
                        >
                          <motion.div layout="position" className={cx("flex items-center gap-3", winner ? "p-4" : "px-3 py-2.5")}>
                            <Photo
                              name={b.photo}
                              decorative
                              sizes="48px"
                              className={cx(
                                "shrink-0 rounded-xl object-cover transition-all duration-500",
                                winner ? "h-12 w-12" : "h-9 w-9",
                                !top && "opacity-60 grayscale",
                              )}
                            />
                            <div className="min-w-0 flex-1">
                              {winner && (
                                <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.12em] text-kh-ember-deep">
                                  Winning offer
                                </p>
                              )}
                              <p className={cx("m-0 truncate", winner ? "text-[18px] font-medium leading-snug" : "text-[14px]")}>
                                {b.offer(group)}
                              </p>
                              <p className={cx("m-0 text-[12px]", winner ? "text-kh-muted" : "opacity-70")}>
                                {b.venue} · {b.km} km
                              </p>
                            </div>
                            {!winner && (
                              <span
                                className={cx(
                                  "shrink-0 rounded-full px-2.5 py-1 text-[11px]",
                                  top ? "bg-kh-ember text-kh-ink" : "border border-white/15",
                                )}
                              >
                                {top ? "Leading" : "Outbid"}
                              </span>
                            )}
                          </motion.div>
                          <AnimatePresence initial={false}>
                            {winner && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.35, ease: EASE_OUT }}
                              >
                                <div className="flex gap-2 px-4 pb-4">
                                  <motion.span
                                    ref={register("accept")}
                                    animate={{ scale: tapping("accept") ? 0.96 : 1 }}
                                    transition={{ type: "spring", stiffness: 500, damping: 22 }}
                                    className="flex h-11 flex-1 items-center justify-center rounded-xl bg-kh-ink text-[14px] font-medium text-kh-cream"
                                  >
                                    Accept &amp; get my pass
                                  </motion.span>
                                  <span className="flex h-11 items-center rounded-xl border border-kh-line px-4 text-[14px] text-kh-ink">
                                    Pass
                                  </span>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <div className="mt-auto flex items-center gap-2 border-t border-white/[0.08] pt-4 text-[12px] text-kh-cream/50">
                  <LockIcon />
                  Venues see your vibe, never your name.
                </div>
              </motion.div>
            )}

            {phase === "pass" && winnerAll && (
              <motion.div
                key="pass"
                initial={{ opacity: 0, rotateY: -70 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                style={{ transformPerspective: 900 }}
                className="relative flex flex-col items-center gap-4 pt-4 text-center"
              >
                <Confetti />
                <div className="rounded-[22px] bg-kh-cream p-4 text-kh-ink shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)]">
                  <QrGlyph seed={winnerAll.id + group} className="h-[150px] w-[150px]" />
                </div>
                <div>
                  <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-kh-ember">Your pass</p>
                  <p className="m-0 mt-1 text-[20px] font-medium">{winnerAll.offer(group)}</p>
                  <p className="m-0 mt-1 text-[14px] text-kh-cream/65">{winnerAll.venue} · show this at the door</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <TapCursor
          x={cursorPos.x}
          y={cursorPos.y}
          visible={!!frame.cursor}
          tapKey={frame.tap ? `${loop}-${step}` : null}
        />
      </div>
    </div>
  );
}

/** A soft touch-point that glides between controls and ripples when it "taps". */
function TapCursor({ x, y, visible, tapKey }: { x: number; y: number; visible: boolean; tapKey: string | null }) {
  return (
    <motion.div
      className="pointer-events-none absolute left-0 top-0 z-20"
      initial={false}
      animate={{ x, y, opacity: visible ? 1 : 0 }}
      transition={{
        x: { type: "spring", stiffness: 140, damping: 22 },
        y: { type: "spring", stiffness: 140, damping: 22 },
        opacity: { duration: 0.3 },
      }}
    >
      <div className="relative -translate-x-1/2 -translate-y-1/2">
        {tapKey && (
          <motion.span
            key={`ripple-${tapKey}`}
            className="absolute inset-0 rounded-full border-2 border-kh-ember"
            initial={{ scale: 0.6, opacity: 0.9 }}
            animate={{ scale: 2.4, opacity: 0 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
          />
        )}
        <motion.span
          key={`dot-${tapKey ?? "idle"}`}
          className="block h-6 w-6 rounded-full border border-black/10 bg-white/90 shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
          initial={false}
          animate={tapKey ? { scale: [1, 0.72, 1] } : { scale: 1 }}
          transition={{ duration: 0.35 }}
        />
      </div>
    </motion.div>
  );
}

function StatusPill({ phase, left }: { phase: Phase; left: number }) {
  const label =
    phase === "idle"
      ? "Draft"
      : phase === "casting"
        ? "Casting…"
        : phase === "pass"
          ? "Pass ready"
          : `Live · ${hms(left)} left`;
  const hot = phase !== "idle";
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-[12px] tabular-nums transition-colors",
        hot ? "bg-kh-ember/15 text-kh-ember" : "bg-white/[0.08] text-kh-cream/60",
      )}
    >
      <span className={cx("inline-block h-1.5 w-1.5 rounded-full", hot ? "kh-live bg-kh-ember" : "bg-kh-cream/40")} />
      {label}
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <p className="m-0 mb-2 text-[12px] font-medium uppercase tracking-[0.12em] text-kh-cream/55">{label}</p>
      {children}
    </div>
  );
}

function StepGlyph({
  children,
  pressed = false,
  ref,
}: {
  children: ReactNode;
  pressed?: boolean;
  ref?: (el: HTMLElement | null) => void;
}) {
  return (
    <motion.span
      ref={ref}
      animate={{ scale: pressed ? 0.85 : 1, backgroundColor: pressed ? "rgba(250,248,245,0.14)" : "rgba(250,248,245,0)" }}
      transition={{ type: "spring", stiffness: 500, damping: 22 }}
      className="flex h-10 w-10 items-center justify-center rounded-xl text-kh-cream"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        {children}
      </svg>
    </motion.span>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function BeaconIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="10" y="10" width="4" height="4" fill="currentColor" stroke="none" />
      <path d="M7.8 7.8a6 6 0 0 0 0 8.4M16.2 7.8a6 6 0 0 1 0 8.4M4.9 4.9a10 10 0 0 0 0 14.2M19.1 4.9a10 10 0 0 1 0 14.2" />
    </svg>
  );
}

/** Brand-square confetti burst for the accepted pass. */
function Confetti() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  const colors = ["#E8744D", "#FAF8F5", "#B4532F", "#F2C7AD"];
  return (
    <div className="pointer-events-none absolute left-1/2 top-[90px]">
      {Array.from({ length: 18 }).map((_, i) => {
        const a = (i / 18) * Math.PI * 2;
        const d = 110 + (i % 4) * 26;
        return (
          <motion.span
            key={i}
            className="absolute block h-2 w-2"
            style={{ background: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 1 }}
            animate={{ x: Math.cos(a) * d, y: Math.sin(a) * d + 40, opacity: 0, rotate: 180 + i * 20, scale: 0.6 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1], delay: 0.25 }}
          />
        );
      })}
    </div>
  );
}
