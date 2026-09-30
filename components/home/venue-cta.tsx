"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRef } from "react";
import { ArrowRight, EASE_OUT, Magnetic, Reveal, SplitHeading, pad, useSeconds } from "@/components/brand/primitives";

export function VenueCta() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useSeconds(ref);
  const left = Math.max(0, 252 - (t % 253));

  return (
    <section id="venues" aria-labelledby="venues-title" className="bg-kh-cream pt-12 text-kh-ink sm:pt-12">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <Reveal>
          <div className="relative isolate overflow-hidden rounded-[40px] bg-kh-ember px-6 py-14 sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <svg
              aria-hidden="true"
              viewBox="0 0 400 400"
              className="absolute -right-32 -top-24 -z-10 h-[640px] w-[640px] text-kh-ink/10"
            >
              {[60, 110, 160, 200].map((r) => (
                <circle key={r} cx="200" cy="200" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
              ))}
            </svg>

            <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
              <div>
                <p className="m-0 flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em]">
                  <span aria-hidden="true" className="inline-block h-2 w-2 bg-kh-ink" />
                  For venues
                </p>
                <SplitHeading
                  id="venues-title"
                  text={"Run a venue? Guests are\nout right now. Win them."}
                  className="m-0 mt-6 text-[clamp(2.25rem,4.6vw,4.25rem)] font-light leading-[1.04] tracking-[-0.04em]"
                />
                <p className="m-0 mt-6 max-w-[34rem] text-[18px] leading-relaxed text-kh-ink">
                  See Beacons from groups nearby who want your vibe, send your best offer, and pay only when they walk in.
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
                    href="/vendors"
                    className="group inline-flex items-center gap-2 rounded text-[16px] font-medium focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-kh-ink"
                  >
                    <span className="kh-link">How it works for venues</span>
                    <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>

              <div ref={ref} role="img" aria-label="Example of an incoming Beacon a venue would see: 4 people, LKR 3–5k each, #rooftop, 1.2 km away." className="flex justify-center lg:justify-end">
                <motion.div
                  aria-hidden="true"
                  initial={{ opacity: 0, y: 30, rotate: 3 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, ease: EASE_OUT, delay: 0.2 }}
                  className="w-full max-w-[380px] rounded-[28px] bg-kh-cream p-6 shadow-[0_40px_80px_-30px_rgba(26,26,26,0.55)]"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.12em] text-kh-ember-deep">
                      <span className="kh-live inline-block h-2 w-2 bg-kh-ember" />
                      Incoming Beacon
                    </span>
                    <span className="text-[13px] tabular-nums text-kh-muted">
                      {Math.floor(left / 60)}:{pad(left % 60)} to respond
                    </span>
                  </div>
                  <p className="m-0 mt-4 text-[22px] font-light leading-tight tracking-[-0.02em] sm:text-[26px]">
                    4 people · <span className="whitespace-nowrap">LKR 3–5k</span> each
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {["#rooftop", "#livemusic", "1.2 km away"].map((t) => (
                      <span key={t} className="rounded-full bg-kh-sand px-3 py-1 text-[12px]">
                        {t}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 rounded-2xl border border-kh-line bg-white px-4 py-3">
                    <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-kh-muted">Your offer</p>
                    <p className="m-0 mt-1 text-[15px]">
                      Free first round, before 8 PM
                      <span className="ml-0.5 inline-block h-4 w-[1.5px] translate-y-0.5 animate-pulse bg-kh-ink" />
                    </p>
                  </div>
                  <div className="mt-3 flex h-12 items-center justify-center rounded-2xl bg-kh-ink text-[14px] font-medium text-kh-cream">
                    Send offer
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
