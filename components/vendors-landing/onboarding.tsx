"use client";

import { motion, useInView } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { EASE_OUT, Kicker, QrGlyph, Reveal, SplitHeading, cx, pad } from "@/components/brand/primitives";
import { ONBOARDING } from "./data";

const MINUTES = [15, 2, 10, 1];

export function Onboarding() {
  const barRef = useRef<HTMLDivElement>(null);
  const inView = useInView(barRef, { once: true, margin: "0px 0px -10% 0px" });
  const total = MINUTES.reduce((a, b) => a + b, 0);

  return (
    <section aria-labelledby="onboard-title" className="bg-kh-sand py-24 text-kh-ink sm:py-32 lg:py-36">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            <Kicker tone="sand">Getting started</Kicker>
            <SplitHeading
              id="onboard-title"
              text={"Bidding by tonight.\nSet up in an *afternoon.*"}
              accentClassName="text-kh-ember-deep"
              className="m-0 mt-6 text-[clamp(2.5rem,5.2vw,4.5rem)] font-light leading-[1.04] tracking-[-0.04em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="m-0 text-[18px] leading-relaxed text-kh-body">
              One browser dashboard and one phone. No new hardware, no POS integration, and we upload your menu for you.
            </p>
          </Reveal>
        </div>

        {/* Time it takes */}
        <div ref={barRef} className="mt-14">
          <div aria-hidden="true" className="flex h-3 gap-1 overflow-hidden rounded-full">
            {MINUTES.map((m, i) => (
              <motion.span
                key={i}
                className={cx("block h-full rounded-full", i % 2 ? "bg-kh-ink" : "bg-kh-ember")}
                initial={{ flexGrow: 0.0001 }}
                animate={{ flexGrow: inView ? m : 0.0001 }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 + i * 0.25 }}
                style={{ flexBasis: 0 }}
              />
            ))}
          </div>
          <p className="m-0 mt-3 text-[14px] text-kh-body">
            About {total} minutes from sign-up to your first bid.
          </p>
        </div>

        <ol className="m-0 mt-10 grid list-none grid-cols-1 gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {ONBOARDING.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08} className="flex flex-col overflow-hidden rounded-[28px] bg-kh-cream">
              <div aria-hidden="true" className="relative h-[170px] overflow-hidden border-b border-kh-sand bg-white">
                {VISUALS[i]}
              </div>
              <div className="flex flex-1 flex-col gap-3 p-6 sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="text-[34px] font-light leading-none text-kh-ember-deep">{pad(i + 1)}</span>
                  <span className="rounded-full bg-kh-sand px-2.5 py-1 text-[12px] text-kh-body">{s.time}</span>
                </div>
                <h3 className="m-0 text-[20px] font-medium">{s.title}</h3>
                <p className="m-0 text-[15px] leading-relaxed text-kh-body">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ── Step illustrations ── */

function ProfileVisual() {
  const tags = ["#rooftop", "#cocktails", "#afterwork", "#livemusic"];
  return (
    <div className="flex h-full flex-col justify-center gap-3 px-6">
      <div className="flex items-center gap-3">
        <span className="h-11 w-11 rounded-xl bg-[linear-gradient(135deg,#E8744D,#B4532F)]" />
        <div className="flex flex-col gap-1.5">
          <span className="block h-2.5 w-28 rounded-full bg-kh-ink/80" />
          <span className="block h-2 w-20 rounded-full bg-kh-line" />
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {tags.map((t, i) => (
          <motion.span
            key={t}
            initial={{ opacity: 0, scale: 0.6 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 420, damping: 18, delay: 0.4 + i * 0.12 }}
            className={cx("rounded-full px-2.5 py-1 text-[11px]", i < 2 ? "bg-kh-ink text-kh-cream" : "border border-kh-line text-kh-body")}
          >
            {t}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

function MenuVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-5 px-6">
      <motion.div
        initial={{ x: -20, rotate: -8, opacity: 0 }}
        whileInView={{ x: 0, rotate: -6, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: EASE_OUT, delay: 0.2 }}
        className="flex h-[108px] w-[80px] flex-col gap-1.5 rounded-lg border border-kh-line bg-kh-cream p-2.5 shadow-sm"
      >
        <span className="text-[9px] font-semibold text-kh-ember-deep">PDF</span>
        {[70, 90, 60, 80, 50].map((w, i) => (
          <span key={i} className="block h-1.5 rounded-full bg-kh-line" style={{ width: `${w}%` }} />
        ))}
      </motion.div>
      <svg width="28" height="14" viewBox="0 0 28 14" fill="none" stroke="#B4532F" strokeWidth="1.8" strokeLinecap="round">
        <motion.path
          d="M1 7h24M19 1l6 6-6 6"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.7 }}
        />
      </svg>
      <div className="flex w-[110px] flex-col gap-2">
        {["Kingfish", "Flatbread", "Kottu"].map((d, i) => (
          <motion.div
            key={d}
            initial={{ opacity: 0, x: 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 1 + i * 0.15 }}
            className="flex items-center justify-between rounded-md bg-kh-cream px-2 py-1.5 text-[10px]"
          >
            {d}
            <span className="h-1.5 w-1.5 bg-kh-ember" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function FloorVisual() {
  const bounds = useRef<HTMLDivElement>(null);
  const tables = [
    { x: 24, y: 28, round: true, label: "T1" },
    { x: 100, y: 22, round: false, label: "T2" },
    { x: 60, y: 92, round: false, label: "T3" },
    { x: 150, y: 88, round: true, label: "T4" },
  ];
  return (
    <div ref={bounds} className="absolute inset-3 rounded-2xl border border-dashed border-kh-line bg-[radial-gradient(#E6E0D6_1px,transparent_1px)] [background-size:12px_12px]">
      <span className="absolute right-2 top-2 rounded-full bg-kh-ink px-2 py-0.5 text-[10px] text-kh-cream">Drag the tables</span>
      {tables.map((t) => (
        <motion.span
          key={t.label}
          drag
          dragConstraints={bounds}
          dragElastic={0.15}
          dragMomentum={false}
          whileDrag={{ scale: 1.12, boxShadow: "0 12px 24px rgba(26,26,26,0.25)" }}
          whileHover={{ scale: 1.05 }}
          aria-hidden="true"
          className={cx(
            "absolute flex h-11 cursor-grab touch-none items-center justify-center bg-kh-ink text-[11px] font-medium text-kh-cream active:cursor-grabbing",
            t.round ? "w-11 rounded-full" : "w-16 rounded-lg",
          )}
          style={{ left: t.x, top: t.y }}
        >
          {t.label}
        </motion.span>
      ))}
    </div>
  );
}

function ScanVisual() {
  return (
    <div className="flex h-full items-center justify-center gap-6">
      <div className="relative overflow-hidden rounded-xl border border-kh-line bg-white p-2">
        <QrGlyph seed="onboard" className="h-[92px] w-[92px]" />
        <motion.span
          aria-hidden="true"
          className="kh-motion-only absolute inset-x-0 h-0.5 bg-kh-ember shadow-[0_0_10px_2px_rgba(232,116,77,0.7)]"
          animate={{ top: ["10%", "90%", "10%"] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-kh-ember text-kh-ink">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12.5l4.5 4.5L19 7.5" />
          </svg>
        </span>
        <span className="text-[11px] text-kh-body">4 guests in</span>
      </div>
    </div>
  );
}

const VISUALS: ReactNode[] = [<ProfileVisual key="p" />, <MenuVisual key="m" />, <FloorVisual key="f" />, <ScanVisual key="s" />];
