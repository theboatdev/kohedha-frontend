"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, EASE_OUT, Kicker, Magnetic, SplitHeading } from "@/components/brand/primitives";
import { BidRoomSim } from "./bid-room-sim";

const PINGS = [
  { x: 50, y: 20, d: 0, label: "4 · #afterwork" },
  { x: 47, y: 58, d: 1.2, label: "2 · #datenight" },
  { x: 66, y: 12, d: 2.1, label: "6 · #livemusic" },
  { x: 84, y: 10, d: 0.6 },
  { x: 95, y: 34, d: 1.7 },
  { x: 96, y: 66, d: 2.8 },
  { x: 52, y: 88, d: 0.9 },
  { x: 94, y: 92, d: 2.4 },
]

const TRUST = ["No new hardware", "No POS integration", "Live within 24 hours"];

/** Faint city grid with Beacons going off: demand appearing around your venue. */
function DemandField() {
  return (
    <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 [background-image:radial-gradient(#D5CFC6_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:linear-gradient(90deg,transparent_25%,black_70%)]" />
      <div className="absolute right-[8%] top-[20%] h-[520px] w-[520px] rounded-full bg-kh-ember/15 blur-[120px]" />
      <div className="hidden lg:block">
        {PINGS.map((p, i) => (
          <span key={i} className="kh-ping" style={{ left: `${p.x}%`, top: `${p.y}%`, ["--d" as string]: `${p.d}s` }}>
            <span className="absolute inset-[3px] bg-kh-ember" />
            {p.label && (
              <span
                className="kh-blink absolute left-4 top-[-6px] whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[11px] text-kh-body shadow-sm"
                style={{ ["--d" as string]: `${p.d + 0.4}s` }}
              >
                {p.label}
              </span>
            )}
          </span>
        ))}
      </div>
    </div>
  );
}

export function VendorHero() {
  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, ease: EASE_OUT, delay },
  });

  return (
    <section
      aria-labelledby="v-hero-title"
      className="relative isolate -mt-[var(--nav-h)] overflow-hidden bg-kh-cream text-kh-ink"
    >
      <DemandField />
      <div className="mx-auto grid grid-cols-1 items-center gap-14 px-4 pb-20 pt-[calc(var(--nav-h)+48px)] sm:px-8 lg:max-w-[1280px] lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16 lg:px-12 lg:pb-28 lg:pt-[calc(var(--nav-h)+72px)]">
        <div className="flex flex-col items-start">
          <motion.div {...rise(0)}>
            <Kicker>For restaurants, cafés, bars and venues</Kicker>
          </motion.div>
          <SplitHeading
            as="h1"
            id="v-hero-title"
            immediate
            delay={0.1}
            text={"Guests are out.\n*Compete* for them."}
            accentClassName="text-kh-ember-deep"
            className="m-0 mt-7 text-[clamp(2.75rem,5.4vw,5rem)] font-light leading-[1.02] tracking-[-0.045em]"
          />
          <motion.p {...rise(0.5)} className="m-0 mt-7 max-w-[34rem] text-[18px] leading-relaxed text-kh-body sm:text-[20px]">
            Diners on Kohedha don&apos;t scroll listings. They cast a Beacon: how many of them, their budget, their vibe.
            When it matches your venue, it lands in your Bid Room. Send your best offer, win the table, and pay only when
            they walk in.
          </motion.p>
          <motion.div {...rise(0.65)} className="mt-9 flex w-full flex-wrap gap-3 sm:w-auto">
            <Magnetic className="w-full sm:w-auto">
              <Link
                href="/vendors/register"
                className="kh-focus group inline-flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-kh-ember pl-7 pr-6 text-[17px] font-medium text-kh-ink shadow-[0_12px_40px_-10px_rgba(232,116,77,0.7)] transition-colors hover:bg-[#EF8660] sm:w-auto"
              >
                List your venue, free
                <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Magnetic>
            <a
              href="#bid-room"
              className="kh-focus inline-flex h-14 w-full items-center justify-center rounded-2xl border-[1.5px] border-kh-ink px-7 text-[17px] font-medium transition-colors hover:bg-kh-ink hover:text-kh-cream sm:w-auto"
            >
              See the Bid Room
            </a>
          </motion.div>
          <motion.ul {...rise(0.8)} className="m-0 mt-9 flex list-none flex-wrap gap-x-7 gap-y-3 p-0 text-[14px] text-kh-body">
            {TRUST.map((t) => (
              <li key={t} className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-1.5 w-1.5 bg-kh-ember" />
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <BidRoomSim />
        </div>
      </div>
    </section>
  );
}
