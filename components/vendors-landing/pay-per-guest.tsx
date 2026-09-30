"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { EASE_OUT, Kicker, Reveal, SplitHeading, cx } from "@/components/brand/primitives";
import { PAY_POINTS } from "./data";

type Outcome = "show" | "noshow";

const STEPS = [
  { key: "beacon", label: "Beacon lands", show: "Group of 4 · 7:12 PM", noshow: "Group of 4 · 7:12 PM" },
  { key: "win", label: "You win the bid", show: "Free first round", noshow: "Free first round" },
  { key: "door", label: "At your door", show: "Arrived 7:41 PM", noshow: "Nobody arrived" },
  { key: "scan", label: "QR scan", show: "4 guests scanned", noshow: "No scan" },
  { key: "charge", label: "You're charged", show: "A flat fee, shown before you bid", noshow: "Nothing. LKR 0." },
];

export function PayPerGuest() {
  const [outcome, setOutcome] = useState<Outcome>("show");
  const show = outcome === "show";
  const reached = show ? STEPS.length : 2; // no-show stops after the win
  const progress = (reached - 1) / (STEPS.length - 1);

  return (
    <section aria-labelledby="pay-title" className="relative overflow-hidden bg-kh-night py-24 text-kh-cream sm:py-32 lg:py-36">
      <div aria-hidden="true" className="pointer-events-none absolute -left-40 top-1/3 h-[520px] w-[520px] rounded-full bg-kh-ember/10 blur-[140px]" />
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            <Kicker tone="dark">Pay per guest</Kicker>
            <SplitHeading
              id="pay-title"
              text="You pay when a guest stands at your *bar.*"
              accentClassName="text-kh-ember"
              className="m-0 mt-6 text-balance text-[clamp(2.5rem,5.2vw,4.5rem)] font-light leading-[1.04] tracking-[-0.04em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className="m-0 text-[18px] leading-relaxed text-kh-cream/70">
              Every winning bid, deal and booking ends in a QR scan at your door. That scan is the proof, so you never pay
              for a click or a no-show.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16 rounded-[32px] border border-white/10 bg-white/[0.03] p-5 sm:p-8 lg:p-10">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="m-0 text-[15px] text-kh-cream/70">Follow one Beacon from bid to bill.</p>
            <LayoutGroup id="pay-toggle">
              <div role="group" aria-label="What happens next" className="grid grid-cols-2 gap-1 rounded-full bg-white/[0.06] p-1">
                {(
                  [
                    ["show", "They walk in"],
                    ["noshow", "They don't show"],
                  ] as [Outcome, string][]
                ).map(([k, label]) => (
                  <button
                    key={k}
                    type="button"
                    aria-pressed={outcome === k}
                    onClick={() => setOutcome(k)}
                    className={cx(
                      "kh-focus relative h-11 rounded-full px-5 text-[14px] transition-colors",
                      outcome === k ? "text-kh-ink" : "text-kh-cream/75 hover:text-kh-cream",
                    )}
                  >
                    {outcome === k && (
                      <motion.span
                        layoutId="pay-pill"
                        className="absolute inset-0 rounded-full bg-kh-cream"
                        transition={{ type: "spring", stiffness: 420, damping: 34 }}
                      />
                    )}
                    <span className="relative">{label}</span>
                  </button>
                ))}
              </div>
            </LayoutGroup>
          </div>

          {/* The path */}
          <ol className="relative m-0 mt-10 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-5 md:gap-4">
            {/* Progress rail: vertical on mobile, horizontal from md up */}
            <span aria-hidden="true" className="absolute bottom-2 left-[21px] top-2 w-px bg-white/10 md:hidden">
              <motion.span
                className="absolute inset-0 origin-top bg-kh-ember"
                initial={false}
                animate={{ scaleY: progress }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              />
            </span>
            {/* 5 columns, 16px gaps, nodes at each column start: last node sits at 4/5 of (width + gap) */}
            <span
              aria-hidden="true"
              className="absolute left-[22px] top-[21px] hidden h-px w-[calc(80%+12.8px)] bg-white/10 md:block"
            >
              <motion.span
                className="absolute inset-0 origin-left bg-kh-ember"
                initial={false}
                animate={{ scaleX: progress }}
                transition={{ duration: 0.8, ease: EASE_OUT }}
              />
            </span>
            {STEPS.map((s, i) => {
              const on = i < reached;
              const fail = !show && i >= 2;
              return (
                <li key={s.key} className="relative flex gap-4 md:flex-col md:gap-5">
                  <motion.span
                    className={cx(
                      "relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-[14px] transition-colors duration-500",
                      on ? "border-kh-ember bg-kh-ember text-kh-ink" : fail ? "border-white/15 bg-kh-night text-kh-cream/60" : "border-white/15 bg-kh-night",
                    )}
                    animate={{ scale: on ? 1 : 0.92 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20, delay: on ? i * 0.12 : 0 }}
                  >
                    {on ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                        <path d="M5 12.5l4.5 4.5L19 7.5" />
                      </svg>
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                        <path d="M6 6l12 12M18 6L6 18" />
                      </svg>
                    )}
                  </motion.span>
                  <div className="min-w-0 pt-1 md:pt-0">
                    <p className="m-0 text-[13px] uppercase tracking-[0.1em] text-kh-mist">{s.label}</p>
                    <AnimatePresence mode="wait" initial={false}>
                      <motion.p
                        key={outcome + s.key}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.3, delay: i * 0.06 }}
                        className={cx(
                          "m-0 mt-1.5 text-[16px] leading-snug",
                          s.key === "charge" ? "font-medium text-kh-ember" : on ? "text-kh-cream" : "text-kh-cream/60",
                        )}
                      >
                        {show ? s.show : s.noshow}
                      </motion.p>
                    </AnimatePresence>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>

        <ul className="m-0 mt-14 grid list-none grid-cols-1 gap-8 p-0 md:grid-cols-3 md:gap-6">
          {PAY_POINTS.map((p, i) => (
            <Reveal as="li" key={p.title} delay={i * 0.08} className="relative flex flex-col gap-2.5 pt-6">
              <motion.span
                aria-hidden="true"
                className="absolute left-0 right-0 top-0 h-px origin-left bg-white/15"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, ease: EASE_OUT, delay: 0.2 + i * 0.1 }}
              />
              <span className="text-[20px] font-medium">{p.title}</span>
              <span className="text-[15px] leading-relaxed text-kh-mist">{p.body}</span>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
