"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "framer-motion";
import Link from "next/link";
import { useRef, useState } from "react";
import { BEACON_FACTS, BEACON_PROMISES, BEACON_STEPS } from "./data";
import { PhoneFrame, StoryScreen } from "./phone";
import { ArrowRight, EASE_OUT, Kicker, Magnetic, Reveal, SplitHeading, cx, pad } from "@/components/brand/primitives";

export function BeaconStory() {
  const trackRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 55%", "end 55%"] });
  const rail = useSpring(scrollYProgress, { stiffness: 140, damping: 30, restDelta: 0.001 });
  const [active, setActive] = useState(0);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    setActive(Math.min(BEACON_STEPS.length - 1, Math.max(0, Math.floor(v * BEACON_STEPS.length))));
  });

  return (
    <section
      id="beacon"
      aria-labelledby="beacon-title"
      className="relative overflow-clip bg-kh-night py-24 text-kh-cream sm:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[20%] h-[640px] w-[640px] rounded-full bg-kh-ember/10 blur-[140px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:linear-gradient(rgba(250,248,245,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(250,248,245,0.5)_1px,transparent_1px)] [background-size:80px_80px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-16">
          <div>
            {/* <Kicker tone="dark">The Beacon</Kicker> */}
            <SplitHeading
              id="beacon-title"
              text={"You set the terms.\nVenues make the offers."}
              accentClassName="text-kh-ember"
              className="m-0 mt-6 text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.02] tracking-[-0.04em]"
            />
          </div>
          <Reveal delay={0.2}>
            <p className="m-0 text-[18px] leading-relaxed text-kh-cream/65">
              A Beacon is a 2-hour signal that you&apos;re out. It turns a night of searching into one decision: yes or
              pass.
            </p>
          </Reveal>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-16 lg:mt-12 lg:grid-cols-2 lg:gap-20">
          <ol ref={trackRef} className="relative m-0 list-none p-0">
            <span aria-hidden="true" className="absolute bottom-[32vh] left-[27px] top-[32vh] hidden w-px bg-white/10 lg:block">
              <motion.span className="absolute inset-0 origin-top bg-kh-ember" style={{ scaleY: rail }} />
            </span>

            {BEACON_STEPS.map((s, i) => {
              const on = active === i;
              return (
                <li
                  key={s.title}
                  className="relative flex gap-6 pb-16 last:pb-0 lg:min-h-[64vh] lg:items-center lg:pb-0"
                >
                  <span
                    aria-hidden="true"
                    className={cx(
                      "relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-[17px] tabular-nums transition-all duration-500",
                      on
                        ? "border-kh-ember bg-kh-ember text-kh-ink shadow-[0_0_40px_-4px_rgba(232,116,77,0.7)]"
                        : "border-white/15 bg-kh-night text-kh-cream/80",
                    )}
                  >
                    {pad(i + 1)}
                  </span>
                  <div className="min-w-0 flex-1 pt-2 lg:pt-0">
                    <h3
                      className={cx(
                        "m-0 text-[clamp(1.75rem,3vw,2.5rem)] font-light leading-tight tracking-[-0.03em] transition-colors duration-500",
                        !on && "lg:text-kh-cream/55",
                      )}
                    >
                      {s.title}
                    </h3>
                    <p
                      className={cx(
                        "m-0 mt-4 max-w-[28rem] text-[17px] leading-relaxed text-kh-cream/70 transition-colors duration-500",
                        !on && "lg:text-kh-cream/50",
                      )}
                    >
                      {s.body}
                    </p>

                    {/* Mobile and tablet get each screen inline instead of the pinned phone */}
                    <Reveal className="mt-8 lg:hidden">
                      <div
                        aria-hidden="true"
                        className="h-[440px] w-full max-w-[340px] overflow-hidden rounded-[32px] border border-white/10 bg-kh-cream text-kh-ink shadow-[0_30px_80px_-30px_rgba(0,0,0,0.8)]"
                      >
                        <StoryScreen step={i} />
                      </div>
                    </Reveal>
                  </div>
                </li>
              );
            })}
          </ol>

          <div className="hidden lg:block">
            <div className="sticky top-[calc(50vh-330px)] flex flex-col items-center gap-6">
              <div aria-hidden="true" className="relative">
                <div className="absolute inset-10 rounded-full bg-kh-ember/25 blur-[80px]" />
                <PhoneFrame className="relative">
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={active}
                      className="absolute inset-0 pt-[34px]"
                      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -24, filter: "blur(6px)" }}
                      transition={{ duration: 0.45, ease: EASE_OUT }}
                    >
                      <StoryScreen step={active} />
                    </motion.div>
                  </AnimatePresence>
                </PhoneFrame>
              </div>
              <div aria-hidden="true" className="flex gap-2">
                {BEACON_STEPS.map((s, i) => (
                  <span
                    key={s.title}
                    className={cx(
                      "h-1.5 rounded-full transition-all duration-500",
                      i === active ? "w-8 bg-kh-ember" : "w-1.5 bg-white/25",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <dl className="m-0 mt-24 grid grid-cols-2 border-t border-white/10 lg:mt-32 lg:grid-cols-4">
          {BEACON_FACTS.map((f, i) => (
            <Reveal
              key={f.label}
              delay={i * 0.08}
              className={cx(
                "flex flex-col-reverse gap-2 border-white/10 py-8 pr-4 lg:py-10",
                i % 2 === 1 && "border-l pl-5 lg:pl-8",
                i >= 2 && "border-t lg:border-t-0",
                i === 2 && "lg:border-l lg:pl-8",
              )}
            >
              <dt className="text-[14px] text-kh-cream/60">{f.label}</dt>
              <dd className="m-0 text-[clamp(2.75rem,5vw,4.5rem)] font-light leading-none tracking-[-0.04em]">
                {f.prefix && <span className="text-[0.5em] text-kh-cream/60">{f.prefix}</span>}
                {f.value}
                <span className="text-kh-ember">{f.suffix}</span>
              </dd>
            </Reveal>
          ))}
        </dl>

        <div className="mt-4 flex flex-col gap-10 border-t border-white/10 pt-10 lg:flex-row lg:items-center lg:justify-between">
          <ul className="m-0 grid grid-cols-1 list-none gap-8 p-0 sm:grid-cols-3 lg:max-w-[52rem] lg:gap-12">
            {BEACON_PROMISES.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 0.08} className="flex flex-col gap-1.5">
                <span className="text-[16px] font-medium">{p.title}</span>
                <span className="text-[14px] leading-relaxed text-kh-mist">{p.body}</span>
              </Reveal>
            ))}
          </ul>
          <Magnetic className="shrink-0 self-start lg:self-auto">
            <Link
              href="#app"
              className="kh-focus group inline-flex h-14 items-center gap-3 rounded-2xl bg-kh-ember pl-7 pr-6 text-[17px] font-medium text-kh-ink transition-colors hover:bg-[#EF8660]"
            >
              Cast a Beacon tonight
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </Magnetic>
        </div>
      </div>
    </section>
  );
}
