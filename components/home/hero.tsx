"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { BeaconSimulator } from "./beacon-simulator";
import { ArrowRight, EASE_OUT, Magnetic, Photo, SplitHeading } from "@/components/brand/primitives";

const TRUST = ["Free for diners", "Your name stays private", "One offer, not a flood"];

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "16%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.16]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0.25]);

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  return (
    <section
      ref={ref}
      id="top"
      aria-labelledby="hero-title"
      className="kh-grain relative isolate -mt-[var(--nav-h)] overflow-hidden bg-kh-night text-kh-cream"
    >
      <motion.div aria-hidden="true" className="absolute inset-0 -z-20" style={{ y: imgY, scale: imgScale }}>
        <Photo name="rooftop" priority decorative sizes="100vw" className="h-full w-full object-cover object-[65%_center]" />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(16,15,13,0.72)_0%,rgba(16,15,13,0.82)_100%)] lg:bg-[linear-gradient(90deg,rgba(16,15,13,0.95)_0%,rgba(16,15,13,0.82)_45%,rgba(16,15,13,0.5)_100%)]"
      />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-kh-night to-transparent" />

      <motion.div
        style={{ opacity: fade }}
        className="mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-14 px-4 pb-20 pt-[calc(var(--nav-h)+40px)] sm:px-8 lg:min-h-[100svh] lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16 lg:px-12 lg:pb-24"
      >
        <div className="flex flex-col items-start">
          <motion.p
            {...rise(0)}
            className="m-0 inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-[14px] text-kh-cream/85 backdrop-blur-md"
          >
            {/* <span aria-hidden="true" className="kh-live inline-block h-2 w-2 bg-kh-ember" /> */}
            kohedha yanne? let the city answer.
          </motion.p>

          <SplitHeading
            as="h1"
            id="hero-title"
            immediate
            delay={0.1}
            text={"Stop Searching.\nLet venues compete\nfor you."}
            accentClassName="text-kh-ember"
            className="m-0 mt-7 text-[clamp(2.75rem,6vw,5.75rem)] font-light leading-[1] tracking-[-0.045em]"
          />

          <motion.p
            {...rise(0.55)}
            className="m-0 mt-7 max-w-[34rem] text-[18px] leading-relaxed text-kh-cream/75 sm:text-[20px]"
          >
            Cast a Beacon with your group size, budget and vibe. Nearby venues that match send their best offer,
            and the winning one lands on your phone. No scrolling, no calling around.
          </motion.p>

          <motion.div {...rise(0.7)} className="mt-9 flex w-full flex-wrap gap-3 sm:w-auto">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="#app"
                className="kh-focus group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-kh-ember pl-7 pr-6 text-[17px] font-medium text-kh-ink shadow-[0_12px_40px_-8px_rgba(232,116,77,0.6)] transition-colors hover:bg-[#EF8660] sm:w-auto"
              >
                Cast a Beacon
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <Link
              href="#explore"
              className="kh-focus inline-flex h-14 w-full items-center justify-center rounded-2xl border border-white/25 px-7 text-[17px] font-medium text-kh-cream backdrop-blur-sm transition-colors hover:border-white/60 hover:bg-white/[0.06] sm:w-auto"
            >
              Browse by vibe
            </Link>
          </motion.div>

          <motion.ul {...rise(0.85)} className="m-0 mt-9 flex list-none flex-wrap gap-x-7 gap-y-3 p-0 text-[14px] text-kh-cream/70">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-white" />
                {t}
              </li>
            ))}
          </motion.ul>
          <motion.p {...rise(0.95)} className="m-0 mt-4 text-[13px] leading-relaxed text-kh-cream/60">
            Live across Greater Colombo: Colombo 1–7, Galle Face and Battaramulla. Kandy, Galle and Negombo next.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40, rotate: 2 }}
          animate={{ opacity: 1, y: 0, rotate: 0 }}
          transition={{ duration: 1.1, ease: EASE_OUT, delay: 0.35 }}
          className="flex justify-center lg:justify-end"
        >
          <BeaconSimulator />
        </motion.div>
      </motion.div>

      <div aria-hidden="true" className="absolute bottom-7 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 lg:flex">
        <span className="text-[11px] uppercase tracking-[0.2em] text-kh-cream/45">Scroll</span>
        <span className="relative block h-10 w-px overflow-hidden bg-white/15">
          <span className="kh-scroll-cue absolute inset-0 bg-kh-ember" />
        </span>
      </div>
    </section>
  );
}
