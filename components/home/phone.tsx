"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { Photo, QrGlyph, Radar, cx } from "@/components/brand/primitives";

export function PhoneFrame({
  children,
  className,
  screenClassName = "bg-kh-cream text-kh-ink",
  statusTone = "dark",
}: {
  children: ReactNode;
  className?: string;
  screenClassName?: string;
  statusTone?: "dark" | "light";
}) {
  return (
    <div
      className={cx(
        "relative aspect-[9/19] w-[300px] rounded-[50px] bg-[#0B0A09] p-[10px] shadow-[0_60px_120px_-30px_rgba(0,0,0,0.75),inset_0_0_0_1.5px_rgba(255,255,255,0.1)]",
        className,
      )}
    >
      <div className={cx("relative h-full w-full overflow-hidden rounded-[40px]", screenClassName)}>
        <div className="absolute left-1/2 top-2.5 z-30 h-[26px] w-[90px] -translate-x-1/2 rounded-full bg-[#0B0A09]" />
        <div
          className={cx(
            "relative z-20 flex items-center justify-between px-7 pt-[14px] text-[12px] font-semibold",
            statusTone === "light" && "text-kh-cream",
          )}
        >
          <span>9:41</span>
          <span className="flex items-center gap-1">
            <svg width="16" height="10" viewBox="0 0 16 10" fill="currentColor">
              <rect x="0" y="6" width="3" height="4" rx="1" />
              <rect x="4.5" y="4" width="3" height="6" rx="1" />
              <rect x="9" y="2" width="3" height="8" rx="1" />
              <rect x="13" y="0" width="3" height="10" rx="1" />
            </svg>
            <span className="inline-block h-[10px] w-[20px] rounded-[3px] border border-current p-[1.5px]">
              <span className="block h-full w-3/4 rounded-[1px] bg-current" />
            </span>
          </span>
        </div>
        {children}
      </div>
    </div>
  );
}

const pop = (delay: number) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring" as const, stiffness: 320, damping: 26, delay },
});

/** The four in-app moments of a Beacon, used by the scroll story. */
export function StoryScreen({ step }: { step: number }) {
  if (step === 0) return <CastScreen />;
  if (step === 1) return <MatchScreen />;
  if (step === 2) return <CompeteScreen />;
  return <PassScreen />;
}

function ScreenTitle({ over, title }: { over: string; title: string }) {
  return (
    <div>
      <p className="m-0 text-[11px] font-semibold uppercase tracking-[0.14em] text-kh-ember-deep">{over}</p>
      <p className="m-0 mt-1 text-[22px] font-medium leading-tight tracking-[-0.02em]">{title}</p>
    </div>
  );
}

function CastScreen() {
  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-6 pt-8">
      <ScreenTitle over="New Beacon" title="What's the plan?" />
      {[
        ["Group", "4 people"],
        ["Budget", "LKR 3–5k each"],
      ].map(([k, v], i) => (
        <motion.div key={k} {...pop(0.1 + i * 0.08)} className="flex items-center justify-between rounded-2xl bg-white px-4 py-3">
          <span className="text-[13px] text-kh-muted">{k}</span>
          <span className="text-[14px] font-medium">{v}</span>
        </motion.div>
      ))}
      <motion.div {...pop(0.26)} className="rounded-2xl bg-white px-4 py-3">
        <div className="flex items-center justify-between">
          <span className="text-[13px] text-kh-muted">Distance</span>
          <span className="text-[14px] font-medium">3 km</span>
        </div>
        <div className="relative mt-3 h-1.5 rounded-full bg-kh-sand">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-kh-ink"
            initial={{ width: "15%" }}
            animate={{ width: "60%" }}
            transition={{ duration: 0.9, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>
      </motion.div>
      <motion.div {...pop(0.34)} className="flex flex-wrap gap-1.5">
        {["#rooftop", "#livemusic", "#chill", "#datenight"].map((t, i) => (
          <span
            key={t}
            className={cx(
              "rounded-full px-3 py-1.5 text-[12px]",
              i < 2 ? "bg-kh-ink text-kh-cream" : "border border-kh-line text-kh-muted",
            )}
          >
            {t}
          </span>
        ))}
      </motion.div>
      <div className="mt-auto">
        <motion.div
          {...pop(0.45)}
          className="relative flex h-14 items-center justify-center rounded-2xl bg-kh-ember text-[15px] font-medium text-kh-ink"
        >
          <motion.span
            className="absolute inset-0 rounded-2xl ring-2 ring-kh-ember"
            animate={{ scale: [1, 1.08], opacity: [0.8, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
          />
          Cast Beacon
        </motion.div>
      </div>
    </div>
  );
}

function MatchScreen() {
  const pins = [
    { label: "Lantern Yard", x: 64, y: 28, match: true },
    { label: "Salt Terrace", x: 22, y: 60, match: true },
    { label: "The Upper Deck", x: 70, y: 70, match: true },
    { label: "Karaoke bar", x: 20, y: 22, match: false },
    { label: "Sports pub", x: 46, y: 86, match: false },
  ];
  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-6 pt-8">
      <ScreenTitle over="Beacon live" title="Who can see it" />
      <div className="relative mx-auto aspect-square w-full">
        <Radar tone="light" className="h-full w-full" />
        {pins.map((p, i) => (
          <div
            key={p.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            <motion.div {...pop(0.2 + i * 0.12)} className="flex flex-col items-center gap-1">
              <span className={cx("block h-3 w-3", p.match ? "bg-kh-ember" : "bg-kh-line")} />
              <span
                className={cx(
                  "whitespace-nowrap rounded-full px-2 py-0.5 text-[10px]",
                  p.match ? "bg-white font-medium shadow-sm" : "text-kh-muted line-through",
                )}
              >
                {p.label}
              </span>
            </motion.div>
          </div>
        ))}
      </div>
      <motion.div {...pop(0.8)} className="mt-auto rounded-2xl bg-white p-4">
        <p className="m-0 text-[14px] font-medium">3 venues match #rooftop</p>
        <p className="m-0 mt-1 text-[12px] text-kh-muted">2 filtered out. Wrong vibe, no ping.</p>
      </motion.div>
    </div>
  );
}

function CompeteScreen() {
  const bids = [
    { venue: "Salt Terrace", offer: "20% off the bill", lead: false },
    { venue: "The Upper Deck", offer: "Free starter platter", lead: false },
    { venue: "Lantern Yard", offer: "Free first round for 4", lead: true },
  ];
  return (
    <div className="flex h-full flex-col gap-3 px-5 pb-6 pt-8">
      <ScreenTitle over="Live · 1:52 left" title="3 offers in" />
      <div className="mt-1 flex flex-col gap-2.5">
        {bids.map((b, i) => (
          <motion.div
            key={b.venue}
            {...pop(0.15 + i * 0.35)}
            className={cx(
              "rounded-2xl p-3.5",
              b.lead ? "border-2 border-kh-ember bg-white shadow-[0_16px_40px_-12px_rgba(232,116,77,0.5)]" : "bg-white/60 text-kh-muted",
            )}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[12px]">{b.venue}</span>
              <span
                className={cx(
                  "rounded-full px-2 py-0.5 text-[10px]",
                  b.lead ? "bg-kh-ember font-medium text-kh-ink" : "border border-kh-line",
                )}
              >
                {b.lead ? "Winning" : "Outbid"}
              </span>
            </div>
            <p className={cx("m-0 mt-1", b.lead ? "text-[17px] font-medium text-kh-ink" : "text-[14px]")}>{b.offer}</p>
          </motion.div>
        ))}
      </div>
      <motion.div {...pop(1.3)} className="mt-auto flex gap-2">
        <span className="flex h-12 flex-1 items-center justify-center rounded-xl bg-kh-ink text-[13px] font-medium text-kh-cream">
          Accept &amp; get my pass
        </span>
        <span className="flex h-12 items-center justify-center rounded-xl border border-kh-line px-4 text-[13px]">Pass</span>
      </motion.div>
    </div>
  );
}

function PassScreen() {
  return (
    <div className="flex h-full flex-col gap-4 px-5 pb-6 pt-8">
      <ScreenTitle over="You're in" title="Your pass" />
      <motion.div {...pop(0.1)} className="overflow-hidden rounded-3xl bg-white shadow-[0_20px_50px_-20px_rgba(26,26,26,0.35)]">
        <div className="relative h-24">
          <Photo name="rooftop" decorative sizes="280px" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <p className="absolute bottom-2 left-4 m-0 text-[15px] font-medium text-white">Lantern Yard</p>
        </div>
        <div className="flex flex-col items-center gap-3 p-4">
          <p className="m-0 text-center text-[15px] font-medium">Free first round for 4</p>
          <QrGlyph seed="lantern-yard" className="h-[120px] w-[120px]" />
          <p className="m-0 text-[11px] text-kh-muted">Valid till 8:00 PM tonight</p>
        </div>
      </motion.div>
      <motion.div {...pop(0.5)} className="mt-auto flex items-center justify-center gap-2 text-[13px] text-kh-body">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B4532F" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <motion.path
            d="M5 12.5l4.5 4.5L19 7.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          />
        </svg>
        Show it at the door
      </motion.div>
    </div>
  );
}
