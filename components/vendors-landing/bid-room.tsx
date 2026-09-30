"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useId, useRef, useState } from "react";
import { EASE_OUT, Reveal, cx, pad, useSeconds } from "@/components/brand/primitives";
import { BID_ROOM_POINTS, INBOX } from "./data";
import { PillarCopy } from "./pillar-copy";

type Mode = "quiet" | "steady" | "full";

const MODES: Record<Mode, { headline: string; offer: string; bidOn: string[] }> = {
  quiet: { headline: "Quiet hour. Bid harder.", offer: "Free first round for the group", bidOn: ["g4", "c2", "g8"] },
  steady: { headline: "Steady night. Bid on the best fits.", offer: "15% off food", bidOn: ["g4", "g8"] },
  full: { headline: "Full house. Let them pass.", offer: "", bidOn: [] },
};

const SEATS = 24;

export function BidRoom() {
  const sliderId = useId();
  const ref = useRef<HTMLDivElement>(null);
  const t = useSeconds(ref);
  const [fill, setFill] = useState(30);
  const mode: Mode = fill < 40 ? "quiet" : fill < 75 ? "steady" : "full";
  const m = MODES[mode];
  const taken = Math.round((fill / 100) * SEATS);

  return (
    <section id="bid-room" aria-labelledby="bid-room-title" className="scroll-mt-24 bg-kh-cream pb-16 pt-24 text-kh-ink sm:pt-32 lg:pb-20 lg:pt-40">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:px-12">
        <PillarCopy
          id="bid-room-title"
          kicker="The Bid Room"
          title="Demand comes to you. You decide what it's *worth.*"
          body="Every Beacon is a group that's already out, already nearby and already looking for a vibe like yours. See it, make one offer, and the best offer wins the table."
          points={BID_ROOM_POINTS}
        />

        <Reveal delay={0.1}>
          <div ref={ref} className="relative overflow-hidden rounded-[32px] bg-kh-ink p-5 text-kh-cream shadow-[0_40px_100px_-40px_rgba(26,26,26,0.7)] sm:p-7">
            <div className="flex items-center justify-between">
              <p className="m-0 text-[18px] font-medium">Bid Room</p>
              <p className="m-0 text-[13px] text-kh-mist">{INBOX.length} Beacons match you</p>
            </div>

            {/* Room fill control */}
            <div className="mt-5 rounded-[22px] bg-white/[0.05] p-4 sm:p-5">
              <div className="flex items-baseline justify-between gap-3">
                <label htmlFor={sliderId} className="text-[14px] text-kh-cream/80">
                  How full is your room tonight?
                </label>
                <span className="text-[20px] font-medium tabular-nums">{fill}%</span>
              </div>
              <div aria-hidden="true" className="mt-3 grid grid-cols-12 gap-1">
                {Array.from({ length: SEATS }).map((_, i) => (
                  <motion.span
                    key={i}
                    className="block h-2.5 rounded-[3px]"
                    animate={{ backgroundColor: i < taken ? "#E8744D" : "rgba(250,248,245,0.12)" }}
                    transition={{ duration: 0.25, delay: Math.abs(i - taken) * 0.012 }}
                  />
                ))}
              </div>
              <input
                id={sliderId}
                type="range"
                min={0}
                max={100}
                step={5}
                value={fill}
                onChange={(e) => setFill(Number(e.target.value))}
                aria-valuetext={`${fill}% full, ${mode}`}
                className="kh-focus mt-4 w-full cursor-pointer accent-kh-ember"
              />
              <AnimatePresence mode="wait" initial={false}>
                <motion.p
                  key={mode}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="m-0 mt-3 text-[15px] font-medium text-kh-ember"
                  aria-live="polite"
                >
                  {m.headline}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Inbox */}
            <ul className="m-0 mt-4 flex list-none flex-col gap-2.5 p-0">
              {INBOX.map((b) => {
                const bidding = m.bidOn.includes(b.id);
                const left = b.seconds - (t % b.seconds);
                return (
                  <li
                    key={b.id}
                    className={cx(
                      "rounded-[18px] border p-4 transition-colors duration-300",
                      bidding ? "border-kh-ember bg-kh-coal" : "border-white/[0.06] bg-white/[0.02]",
                    )}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={cx("text-[15px] font-medium transition-colors", !bidding && "text-kh-cream/70")}>
                        {b.title}
                      </span>
                      <span className="text-[13px] tabular-nums text-kh-ember">
                        {Math.floor(left / 60)}:{pad(left % 60)} left
                      </span>
                    </div>
                    <div className="mt-1.5 flex items-center justify-between gap-3">
                      <span className="min-w-0 truncate text-[13px] text-kh-cream/65">{b.meta}</span>
                      <span
                        className={cx(
                          "shrink-0 rounded-full px-2.5 py-0.5 text-[11px] transition-colors",
                          bidding ? "bg-kh-ember text-kh-ink" : "border border-white/20 text-kh-cream/70",
                        )}
                      >
                        {bidding ? "Bid" : "Pass"}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>

            <div className="mt-4 flex gap-2">
              <span className="flex h-12 min-w-0 flex-1 items-center truncate rounded-xl bg-kh-cream px-4 text-[14px] text-kh-ink">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={mode}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: EASE_OUT }}
                    className={cx("truncate", !m.offer && "text-kh-muted")}
                  >
                    {m.offer || "No bid tonight. Keep full price."}
                  </motion.span>
                </AnimatePresence>
              </span>
              <span
                aria-hidden="true"
                className={cx(
                  "flex h-12 items-center rounded-xl px-5 text-[14px] font-medium transition-colors",
                  m.offer ? "bg-kh-ember text-kh-ink" : "bg-white/10 text-kh-cream/50",
                )}
              >
                {m.offer ? `Bid ×${m.bidOn.length}` : "Pass"}
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
