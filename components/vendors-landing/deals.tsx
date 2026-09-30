"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { EASE_OUT, Reveal, Wordmark, cx } from "@/components/brand/primitives";
import { DEAL_OFFERS, DEAL_POINTS, DEAL_TAGS, DEAL_WINDOWS } from "./data";
import { PillarCopy } from "./pillar-copy";

export function Deals() {
  const capId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const [offer, setOffer] = useState(0);
  const [win, setWin] = useState(0);
  const [cap, setCap] = useState(10);
  const [tag, setTag] = useState(0);
  const [live, setLive] = useState(false);
  const [claimed, setClaimed] = useState(0);

  // Once live, claims trickle in while the card is on screen.
  useEffect(() => {
    if (!live || !inView || claimed >= cap) return;
    const id = window.setTimeout(() => setClaimed((c) => Math.min(cap, c + 1)), 700 + Math.random() * 600);
    return () => window.clearTimeout(id);
  }, [live, inView, claimed, cap]);

  const edit = () => {
    setLive(false);
    setClaimed(0);
  };
  const ends = DEAL_WINDOWS[win].split("–")[1].trim();

  return (
    <section aria-labelledby="deals-title" className="bg-kh-cream py-16 text-kh-ink lg:py-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:px-12">
        <div className="lg:order-2">
          <PillarCopy
            id="deals-title"
            kicker="Live deals"
            title="No Beacon nearby? Fill the 6 PM *dead* *zone* anyway."
            body="Push a time-boxed offer when the room is quiet and keep full price when it's busy. Deals reach the right people nearby, with a countdown that gets them moving."
            points={DEAL_POINTS}
          />
        </div>

        <Reveal delay={0.1} className="lg:order-1">
          <div ref={ref} className="rounded-[32px] border border-kh-sand bg-white p-5 shadow-[0_30px_80px_-40px_rgba(26,26,26,0.35)] sm:p-7">
            <div className="flex items-center justify-between">
              <p className="m-0 text-[18px] font-medium">New flash deal</p>
              <span
                className={cx(
                  "flex items-center gap-2 rounded-full px-3 py-1 text-[12px] transition-colors",
                  live ? "bg-kh-ember/15 text-kh-ember-deep" : "bg-kh-sand text-kh-muted",
                )}
              >
                <span aria-hidden="true" className={cx("h-1.5 w-1.5 rounded-full", live ? "kh-live bg-kh-ember" : "bg-kh-mist")} />
                {live ? "Live" : "Draft"}
              </span>
            </div>

            <fieldset disabled={live} className="m-0 mt-5 flex flex-col gap-4 border-0 p-0 disabled:opacity-60">
              <Choice label="Offer" options={DEAL_OFFERS} value={offer} onChange={setOffer} />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Choice label="Runs" options={DEAL_WINDOWS} value={win} onChange={setWin} compact />
                <div>
                  <div className="mb-2 flex items-baseline justify-between">
                    <label htmlFor={capId} className="text-[13px] text-kh-muted">
                      Claim cap
                    </label>
                    <span className="text-[15px] font-medium tabular-nums">{cap} guests</span>
                  </div>
                  <input
                    id={capId}
                    type="range"
                    min={5}
                    max={30}
                    step={5}
                    value={cap}
                    onChange={(e) => setCap(Number(e.target.value))}
                    className="kh-focus mt-2 w-full cursor-pointer accent-kh-ember disabled:cursor-not-allowed"
                  />
                </div>
              </div>
              <Choice label="Reach diners within 2 km who like" options={DEAL_TAGS} value={tag} onChange={setTag} />
            </fieldset>

            {/* What diners see */}
            <div className="mt-6 rounded-[24px] bg-kh-sand p-3 sm:p-4">
              <p className="m-0 mb-2.5 px-1 text-[12px] font-medium uppercase tracking-[0.12em] text-kh-muted">What diners see</p>
              <motion.div
                layout
                className="rounded-[18px] bg-kh-ink p-4 text-kh-cream shadow-[0_16px_40px_-16px_rgba(26,26,26,0.6)]"
              >
                <div className="flex items-center justify-between">
                  <Wordmark className="text-[15px]" />
                  <span className="text-[11px] text-kh-mist">{live ? "now" : "preview"}</span>
                </div>
                <AnimatePresence mode="wait" initial={false}>
                  <motion.p
                    key={`${offer}-${win}`}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className="m-0 mt-2 text-[15px] leading-snug"
                  >
                    Flash deal 400 m away: <span className="font-medium">{DEAL_OFFERS[offer].toLowerCase()}</span>. Ends{" "}
                    {ends}.
                  </motion.p>
                </AnimatePresence>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    className="h-full rounded-full bg-kh-ember"
                    animate={{ width: `${(claimed / cap) * 100}%` }}
                    transition={{ duration: 0.5, ease: EASE_OUT }}
                  />
                </div>
                <p className="m-0 mt-2 text-[12px] tabular-nums text-kh-mist" aria-live="polite">
                  {live ? (claimed >= cap ? "All claimed" : `${cap - claimed} of ${cap} left`) : `${cap} to claim`}
                </p>
              </motion.div>
            </div>

            <motion.button
              type="button"
              onClick={live ? edit : () => setLive(true)}
              whileTap={{ scale: 0.98 }}
              className={cx(
                "kh-focus mt-5 flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl text-[16px] font-medium transition-colors",
                live ? "border-[1.5px] border-kh-ink text-kh-ink hover:bg-kh-sand" : "bg-kh-ink text-kh-cream hover:bg-black",
              )}
            >
              {live ? "End deal and edit" : "Go live"}
            </motion.button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Choice({
  label,
  options,
  value,
  onChange,
  compact = false,
}: {
  label: string;
  options: string[];
  value: number;
  onChange: (i: number) => void;
  compact?: boolean;
}): ReactNode {
  return (
    <div role="group" aria-label={label}>
      <p className="m-0 mb-2 text-[13px] text-kh-muted">{label}</p>
      <div className={cx("flex gap-1.5", compact ? "flex-col" : "flex-wrap")}>
        {options.map((o, i) => (
          <button
            key={o}
            type="button"
            aria-pressed={value === i}
            onClick={() => onChange(i)}
            className={cx(
              "kh-focus rounded-xl px-3.5 text-left text-[14px] transition-colors disabled:cursor-not-allowed",
              compact ? "h-10" : "h-11",
              value === i ? "bg-kh-ink text-kh-cream" : "bg-kh-cream text-kh-ink hover:bg-kh-sand",
            )}
          >
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
