"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Magnetic, Reveal, SplitHeading } from "@/components/brand/primitives";

const CHIPS = [
  { label: "Group of 4 · #afterwork", x: "8%", y: "18%", d: 0 },
  { label: "Couple · #datenight", x: "46%", y: "6%", d: 0.8 },
  { label: "Group of 8 · #party", x: "30%", y: "74%", d: 1.6 },
];

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="bg-kh-cream pb-24 text-kh-ink sm:pb-32">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[40px] bg-kh-ember px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
              <div>
                <SplitHeading
                  id="final-title"
                  text={"Your city, tonight.\nGo *win* it."}
                  className="m-0 text-[clamp(2.5rem,5.6vw,4.75rem)] font-light leading-[1.02] tracking-[-0.04em]"
                />
                <p className="m-0 mt-6 max-w-[32rem] text-[18px] leading-relaxed">
                  List your venue free, be on the map within 24 hours, and start answering Beacons.
                </p>
                <div className="mt-9 flex flex-col items-start gap-5 sm:flex-row sm:items-center sm:gap-7">
                  <Magnetic>
                    <Link
                      href="/vendors/register"
                      className="group inline-flex h-14 items-center gap-3 rounded-2xl bg-kh-ink pl-7 pr-6 text-[17px] font-medium text-kh-cream shadow-[0_16px_40px_-12px_rgba(26,26,26,0.6)] transition-colors hover:bg-black focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-kh-ink"
                    >
                      List your venue, free
                      <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                    </Link>
                  </Magnetic>
                  <Link
                    href="/vendors/login"
                    className="group inline-flex items-center gap-2 rounded text-[16px] font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-kh-ink"
                  >
                    <span className="kh-link">Already listed? Log in</span>
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              <div aria-hidden="true" className="relative mx-auto aspect-square w-full max-w-[380px]">
                <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-kh-ink">
                  {[30, 55, 80, 98].map((r) => (
                    <circle key={r} cx="100" cy="100" r={r} fill="none" stroke="currentColor" strokeOpacity="0.14" strokeWidth="1" />
                  ))}
                  {[0, 1, 2].map((i) => (
                    <motion.circle
                      key={i}
                      className="kh-motion-only"
                      cx="100"
                      cy="100"
                      fill="none"
                      stroke="#1A1A1A"
                      strokeWidth="1.2"
                      initial={{ r: 8, opacity: 0.5 }}
                      animate={{ r: 98, opacity: 0 }}
                      transition={{ duration: 3, repeat: Infinity, delay: i, ease: "easeOut" }}
                    />
                  ))}
                  <rect x="92" y="92" width="16" height="16" fill="#1A1A1A" />
                </svg>
                {CHIPS.map((c) => (
                  <motion.span
                    key={c.label}
                    className="absolute whitespace-nowrap rounded-full bg-kh-cream px-3 py-1.5 text-[12px] shadow-[0_10px_24px_-10px_rgba(26,26,26,0.5)]"
                    style={{ left: c.x, top: c.y }}
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: c.d }}
                  >
                    {c.label}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
