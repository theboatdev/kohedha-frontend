"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { SIM_BIDS, SIM_BUDGETS, SIM_VIBES, type SimVibe } from "./data";
import { EASE_OUT, Photo, QrGlyph, Radar, cx, hms } from "@/components/brand/primitives";

type Phase = "idle" | "casting" | "bidding" | "won" | "pass";

const BEACON_SECONDS = 2 * 60 * 60;

export function BeaconSimulator() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const inView = useInView(rootRef, { amount: 0.4 });

  const [phase, setPhase] = useState<Phase>("idle");
  const [group, setGroup] = useState(4);
  const [budget, setBudget] = useState(1);
  const [vibe, setVibe] = useState<SimVibe>("rooftop");
  const [arrived, setArrived] = useState<string[]>([]);
  const [declined, setDeclined] = useState<string[]>([]);
  const [acceptedId, setAcceptedId] = useState<string | null>(null);
  const [elapsed, setElapsed] = useState(0);

  const timers = useRef<number[]>([]);
  const interacted = useRef(false);
  const autoplayed = useRef(false);

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };
  useEffect(() => clearTimers, []);

  const cast = useCallback(() => {
    clearTimers();
    const later = (fn: () => void, ms: number) => timers.current.push(window.setTimeout(fn, ms));
    const castMs = reduce ? 250 : 1800;
    const gap = reduce ? 120 : 950;
    const bids = SIM_BIDS[vibe];

    setArrived([]);
    setDeclined([]);
    setAcceptedId(null);
    setElapsed(0);
    setPhase("casting");
    later(() => setPhase("bidding"), castMs);
    bids.forEach((b, i) => later(() => setArrived((a) => [...a, b.id]), castMs + 250 + i * gap));
    later(() => setPhase("won"), castMs + 250 + bids.length * gap + 400);
  }, [reduce, vibe]);

  const reset = () => {
    clearTimers();
    setPhase("idle");
  };

  // Play the demo once on its own so the hero comes alive, unless the visitor gets there first.
  useEffect(() => {
    if (!inView || autoplayed.current || reduce) return;
    const id = window.setTimeout(() => {
      if (interacted.current) return;
      autoplayed.current = true;
      cast();
    }, 1600);
    return () => window.clearTimeout(id);
  }, [inView, reduce, cast]);

  // Beacon countdown, only while live and visible.
  const live = phase === "bidding" || phase === "won";
  useEffect(() => {
    if (!live || !inView) return;
    const id = window.setInterval(() => setElapsed((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [live, inView]);

  const bids = SIM_BIDS[vibe]
    .filter((b) => arrived.includes(b.id) && !declined.includes(b.id))
    .sort((a, b) => b.strength - a.strength);
  const leader = bids[0];
  const accepted = SIM_BIDS[vibe].find((b) => b.id === acceptedId);

  const accept = () => {
    if (!leader) return;
    setAcceptedId(leader.id);
    setPhase("pass");
  };
  const pass = () => leader && setDeclined((d) => [...d, leader.id]);

  const budgetLabel = `LKR ${SIM_BUDGETS[budget]}`;
  const announce =
    phase === "casting"
      ? `Casting your Beacon to ${vibe} venues nearby.`
      : phase === "bidding" && leader
        ? `${bids.length} venue${bids.length === 1 ? "" : "s"} bidding. ${leader.venue} is leading.`
        : phase === "won" && leader
          ? `Winning offer from ${leader.venue}: ${leader.offer(group)}.`
          : phase === "won"
            ? "You passed on every offer."
            : phase === "pass" && accepted
              ? `Pass ready for ${accepted.venue}.`
              : "";

  return (
    <div
      ref={rootRef}
      className="relative w-full max-w-[468px]"
      onPointerDown={() => (interacted.current = true)}
      onKeyDown={() => (interacted.current = true)}
    >
      <div className="mb-3 flex items-center justify-between px-1 text-[12px] font-medium uppercase tracking-[0.14em] text-kh-cream/60">
        {/* <span className="flex items-center gap-2">
          <span aria-hidden="true" className="kh-live inline-block h-1.5 w-1.5 bg-kh-ember" />
          Interactive demo
        </span> */}
        {/* <span>Try it</span> */}
      </div>

      <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#161412]/80 p-5 text-kh-cream shadow-[0_40px_120px_-24px_rgba(0,0,0,0.7)] backdrop-blur-2xl sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-kh-ember/20 blur-3xl" />

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
                  {group} people · {budgetLabel} each · within 3 km
                </span>
                <span className="rounded-full bg-kh-cream px-3 py-1 text-[12px] font-medium text-kh-ink">#{vibe}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="relative mt-5 min-h-[384px]">
          <AnimatePresence mode="wait" initial={false}>
            {phase === "idle" && (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: EASE_OUT }}
                className="flex flex-col gap-5"
              >
                <Field label="How many of you?">
                  <div className="flex h-12 items-center justify-between rounded-2xl border border-white/[0.12] bg-white/[0.04] p-1">
                    <StepButton label="Fewer people" disabled={group <= 2} onClick={() => setGroup((g) => g - 1)}>
                      <path d="M5 12h14" />
                    </StepButton>
                    <output aria-live="polite" className="text-[15px] tabular-nums">
                      {group} people
                    </output>
                    <StepButton label="More people" disabled={group >= 12} onClick={() => setGroup((g) => g + 1)}>
                      <path d="M12 5v14M5 12h14" />
                    </StepButton>
                  </div>
                </Field>

                <Field label="Budget per head">
                  <div className="grid grid-cols-3 gap-1 rounded-2xl border border-white/[0.12] bg-white/[0.04] p-1">
                    {SIM_BUDGETS.map((b, i) => (
                      <button
                        key={b}
                        type="button"
                        aria-pressed={budget === i}
                        onClick={() => setBudget(i)}
                        className={cx(
                          "kh-focus relative h-10 rounded-xl text-[14px] transition-colors",
                          budget === i ? "text-kh-ink" : "text-kh-cream/70 hover:text-kh-cream",
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
                      </button>
                    ))}
                  </div>
                </Field>

                <Field label="What's the vibe?">
                  <div className="flex flex-wrap gap-2">
                    {SIM_VIBES.map((v) => (
                      <button
                        key={v}
                        type="button"
                        aria-pressed={vibe === v}
                        onClick={() => setVibe(v)}
                        className={cx(
                          "kh-focus h-9 rounded-full border px-3.5 text-[13px] transition-all duration-200",
                          vibe === v
                            ? "border-kh-ember bg-kh-ember text-kh-ink"
                            : "border-white/15 text-kh-cream/80 hover:border-white/40 hover:text-kh-cream",
                        )}
                      >
                        #{v}
                      </button>
                    ))}
                  </div>
                </Field>

                <motion.button
                  type="button"
                  onClick={cast}
                  whileHover={{ scale: 1.015 }}
                  whileTap={{ scale: 0.98 }}
                  className="kh-focus group relative mt-1 flex h-14 w-full items-center justify-center gap-3 overflow-hidden rounded-2xl bg-kh-ember text-[16px] font-medium text-kh-ink"
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 bg-white/30 blur-md transition-transform duration-700 group-hover:translate-x-[420%]"
                  />
                  <BeaconIcon />
                  Cast Beacon
                </motion.button>
                <p className="m-0 text-center text-[12px] text-kh-cream/50">
                  Just a demo. Nothing is sent to real venues.
                </p>
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
                  {SIM_BIDS[vibe].map((b, i) => {
                    const angle = (i / 3) * Math.PI * 2 + 0.6;
                    const r = 52 + b.km * 18;
                    return (
                      <motion.span
                        key={b.id}
                        aria-hidden="true"
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
                  Reaching <span className="text-kh-ember">#{vibe}</span> venues within 3 km…
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
                    {phase === "won" && !leader
                      ? "No offers left"
                      : `${bids.length} venue${bids.length === 1 ? "" : "s"} competing for you`}
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
                          exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
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
                                  <motion.button
                                    type="button"
                                    onClick={accept}
                                    whileTap={{ scale: 0.97 }}
                                    className="kh-focus h-11 flex-1 rounded-xl bg-kh-ink text-[14px] font-medium text-kh-cream transition-colors hover:bg-black"
                                  >
                                    Accept &amp; get my pass
                                  </motion.button>
                                  <motion.button
                                    type="button"
                                    onClick={pass}
                                    whileTap={{ scale: 0.97 }}
                                    className="kh-focus h-11 rounded-xl border border-kh-line px-4 text-[14px] text-kh-ink transition-colors hover:border-kh-ink"
                                  >
                                    Pass
                                  </motion.button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                {phase === "won" && !leader && (
                  <motion.p
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="m-0 pt-10 text-center text-[15px] text-kh-cream/75"
                  >
                    You passed on everything. No hard feelings.
                  </motion.p>
                )}

                <div className="mt-auto flex items-center justify-between gap-4 border-t border-white/[0.08] pt-4 text-[12px] text-kh-cream/50">
                  <span className="flex items-center gap-2">
                    <LockIcon />
                    Venues see your vibe, never your name.
                  </span>
                  <button
                    type="button"
                    onClick={reset}
                    className="kh-focus shrink-0 rounded-full border border-white/15 px-3 py-1.5 text-[12px] text-kh-cream/80 transition-colors hover:border-white/40 hover:text-kh-cream"
                  >
                    {phase === "won" && !leader ? "Try a different vibe" : "Start over"}
                  </button>
                </div>
              </motion.div>
            )}

            {phase === "pass" && accepted && (
              <motion.div
                key="pass"
                initial={{ opacity: 0, rotateY: -70 }}
                animate={{ opacity: 1, rotateY: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: EASE_OUT }}
                style={{ transformPerspective: 900 }}
                className="relative flex flex-col items-center gap-4 text-center"
              >
                <Confetti />
                <div className="rounded-[22px] bg-kh-cream p-4 text-kh-ink shadow-[0_24px_60px_-16px_rgba(0,0,0,0.6)]">
                  <QrGlyph seed={accepted.id + group} className="h-[150px] w-[150px]" />
                </div>
                <div>
                  <p className="m-0 text-[12px] font-semibold uppercase tracking-[0.12em] text-kh-ember">Your pass</p>
                  <p className="m-0 mt-1 text-[20px] font-medium">{accepted.offer(group)}</p>
                  <p className="m-0 mt-1 text-[14px] text-kh-cream/65">
                    {accepted.venue} · show this at the door
                  </p>
                </div>
                <button
                  type="button"
                  onClick={reset}
                  className="kh-focus mt-1 h-11 rounded-xl border border-white/20 px-5 text-[14px] transition-colors hover:bg-white/10"
                >
                  Cast another Beacon
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="sr-only" aria-live="polite">
          {announce}
        </p>
      </div>
    </div>
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
      <span aria-hidden="true" className={cx("inline-block h-1.5 w-1.5 rounded-full", hot ? "kh-live bg-kh-ember" : "bg-kh-cream/40")} />
      {label}
    </span>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <fieldset className="m-0 border-0 p-0">
      <legend className="mb-2 p-0 text-[12px] font-medium uppercase tracking-[0.12em] text-kh-cream/55">{label}</legend>
      {children}
    </fieldset>
  );
}

function StepButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string;
  disabled: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.88 }}
      className="kh-focus flex h-10 w-10 items-center justify-center rounded-xl text-kh-cream transition-colors hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
        {children}
      </svg>
    </motion.button>
  );
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function BeaconIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
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
    <div aria-hidden="true" className="pointer-events-none absolute left-1/2 top-[90px]">
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
