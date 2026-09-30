"use client";

import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE_OUT, Kicker, Reveal, SplitHeading, Wordmark, cx } from "@/components/brand/primitives";

const CHAT = [
  { who: "N", color: "#E7C9A9", text: "anywhere chill tonight?", time: "8:58 PM" },
  { who: "me", text: "idk. rooftop?" },
  { who: "R", color: "#C9D3C0", text: "that one's always full" },
  { who: "A", color: "#D9C3D6", text: "what about the place near the office" },
  { who: "me", text: "ok someone just pick", time: "9:57 PM" },
];

const EVERYWHERE = ["Search", "Scroll", "Compare", "Call", "Hope"];
const KOHEDHA = ["Cast", "Pick", "Go"];

export function Problem() {
  return (
    <section id="problem" aria-labelledby="problem-title" className="bg-kh-cream py-24 text-kh-ink sm:py-32 lg:py-40">
      <div className="mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-24 lg:px-12">
        <div className="order-2 lg:order-1">
          <GroupChat />
        </div>

        <div className="order-1 lg:order-2">
          {/* <Kicker>The real problem</Kicker> */}
          <SplitHeading
            id="problem-title"
            text="The group chat has been deciding for an hour."
            accentClassName="text-kh-ember-deep"
            className="m-0 mt-6 text-balance text-[clamp(2.25rem,4.6vw,4rem)] font-light leading-[1.04] tracking-[-0.035em]"
          />
          <Reveal delay={0.15}>
            <p className="m-0 mt-7 max-w-[36rem] text-[18px] leading-relaxed text-kh-body sm:text-[19px]">
              Every other app makes you do the work: search, scroll, compare, call, and hope there&apos;s a table.
              Kohedha flips it. Tell us what your group wants, and the venues do the work of winning you over.
            </p>
          </Reveal>

          <CompareRows />
        </div>
      </div>
    </section>
  );
}

function CompareRows() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  return (
    <div ref={ref} className="mt-12 overflow-hidden rounded-[28px] border border-kh-line bg-white">
      <div className="flex flex-col gap-3 border-b border-kh-line px-6 py-5 sm:flex-row sm:items-center sm:gap-6 sm:px-7">
        <span className="w-32 shrink-0 text-[12px] font-medium uppercase tracking-[0.12em] text-kh-muted">Everywhere else</span>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-4 gap-y-2 p-0 text-[18px] text-kh-muted">
          {EVERYWHERE.map((w, i) => (
            <li key={w} className="relative">
              <s className="[text-decoration:none]">{w}</s>
              <motion.span
                aria-hidden="true"
                className="absolute left-[-3px] right-[-3px] top-1/2 h-[1.5px] origin-left bg-kh-ember-deep"
                initial={{ scaleX: 0 }}
                animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
                transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.3 + i * 0.18 }}
              />
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-col gap-3 bg-kh-ink px-6 py-5 text-kh-cream sm:flex-row sm:items-center sm:gap-6 sm:px-7">
        <span className="w-32 shrink-0 text-[12px] font-medium uppercase tracking-[0.12em] text-kh-ember">On Kohedha</span>
        <ul className="m-0 flex list-none flex-wrap items-center gap-x-3 gap-y-2 p-0 text-[22px] font-medium">
          {KOHEDHA.map((w, i) => (
            <motion.li
              key={w}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -10 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, ease: EASE_OUT, delay: 1.3 + i * 0.15 }}
            >
              {w}
              {i < KOHEDHA.length - 1 && <span aria-hidden="true" className="inline-block h-2 w-2 bg-kh-ember" />}
            </motion.li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function GroupChat() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.35 });
  const [step, setStep] = useState(0);
  const total = CHAT.length + 1; // messages, then the kohedha card

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      setStep(total);
      return;
    }
    if (step >= total) return;
    const id = window.setTimeout(() => setStep((s) => s + 1), step === 0 ? 300 : step === CHAT.length ? 1500 : 850);
    return () => window.clearTimeout(id);
  }, [inView, reduce, step, total]);

  const typing = step >= CHAT.length && step < total;

  return (
    <div
      ref={ref}
      role="img"
      aria-label="A group chat going in circles for an hour about where to go, until a Kohedha Beacon arrives: three venues are bidding, and the winning offer is a free first round at Lantern Yard."
      className="relative mx-auto w-full max-w-[440px]"
    >
      <div aria-hidden="true" className="absolute -inset-6 -z-0 rounded-[48px] bg-kh-sand" />
      <div aria-hidden="true" className="relative overflow-hidden rounded-[32px] border border-kh-line bg-[#F3F0EB] shadow-[0_30px_80px_-30px_rgba(26,26,26,0.35)]">
        <div className="flex items-center gap-3 border-b border-kh-line bg-white/70 px-5 py-4 backdrop-blur">
          <div className="flex -space-x-2">
            {["#E7C9A9", "#C9D3C0", "#D9C3D6"].map((c) => (
              <span key={c} className="h-8 w-8 rounded-full border-2 border-white" style={{ background: c }} />
            ))}
          </div>
          <div className="min-w-0">
            <p className="m-0 text-[15px] font-medium">friday plans??</p>
            <p className="m-0 text-[12px] text-kh-muted">Nadee, Ravi, Amaya, you</p>
          </div>
        </div>

        <div className="flex min-h-[480px] flex-col gap-2 px-4 pb-5 pt-4">
          <AnimatePresence initial={false}>
            {CHAT.slice(0, step).map((m, i) => (
              <motion.div
                key={i}
                layout
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 420, damping: 30 }}
                className="flex flex-col"
              >
                {m.time && <p className="m-0 mb-1 mt-2 text-center text-[11px] text-kh-muted">{m.time}</p>}
                <div className={cx("flex items-end gap-2", m.who === "me" && "justify-end")}>
                  {m.who !== "me" && (
                    <span
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-medium"
                      style={{ background: m.color }}
                    >
                      {m.who}
                    </span>
                  )}
                  <span
                    className={cx(
                      "max-w-[78%] px-4 py-2.5 text-[15px] leading-snug",
                      m.who === "me"
                        ? "rounded-[18px_18px_4px_18px] bg-kh-ink text-kh-cream"
                        : "rounded-[18px_18px_18px_4px] bg-white",
                    )}
                  >
                    {m.text}
                  </span>
                </div>
              </motion.div>
            ))}
            {typing && (
              <motion.div
                key="typing"
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex items-end gap-2"
              >
                <span className="h-6 w-6 rounded-full" style={{ background: "#E7C9A9" }} />
                <span className="kh-typing flex gap-1 rounded-[18px_18px_18px_4px] bg-white px-4 py-3.5 text-kh-muted">
                  <span />
                  <span />
                  <span />
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {step >= total && (
            <motion.div
              key="kohedha"
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              className="absolute inset-x-3 bottom-3"
            >
              <div className="rounded-[22px] bg-kh-ink p-4 text-kh-cream shadow-[0_24px_60px_-10px_rgba(26,26,26,0.55)] ring-1 ring-kh-ember/50">
                <div className="flex items-center justify-between">
                  <Wordmark className="text-[16px]" />
                  <span className="text-[11px] text-kh-mist">now</span>
                </div>
                <p className="m-0 mt-2 text-[15px] leading-snug">
                  Beacon cast for 4 · #rooftop. 3 venues are bidding for your group.
                </p>
                <p className="m-0 mt-2 flex items-center gap-2 text-[14px] text-kh-ember">
                  Winning offer: free first round at Lantern Yard
                  <span aria-hidden="true">→</span>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
