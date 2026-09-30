"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PhoneFrame } from "./phone";
import { Kicker, Photo, Reveal, SplitHeading, StoreBadges } from "@/components/brand/primitives";

const NOTES = [
  { title: "Beacon won", body: "Lantern Yard: free first round for 4, before 8 PM.", time: "now" },
  { title: "Deal nearby", body: "Salt Terrace, 400 m: 20% off mains. Ends in 1:34.", time: "2m ago" },
  { title: "Table held", body: "Harbour Lights, 8:00 PM, table for 2. Your pass is ready.", time: "1h ago" },
];

export function AppSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 0.5, 1], [10, 0, -6]);
  const y = useTransform(scrollYProgress, [0, 1], [80, -80]);

  return (
    <section
      ref={ref}
      id="app"
      aria-labelledby="app-title"
      className="relative overflow-hidden bg-kh-night py-24 text-kh-cream sm:py-32 lg:py-40"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 left-1/2 h-[720px] w-[1100px] -translate-x-1/2 rounded-full bg-kh-ember/25 blur-[160px]"
      />

      <div className="relative mx-auto grid grid-cols-1 max-w-[1280px] items-center gap-16 px-4 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:px-12">
        <div>
          {/* <Kicker tone="dark">Get the app</Kicker> */}
          <SplitHeading
            id="app-title"
            text={"Your next offer is\n*one* *tap* away."}
            accentClassName="text-kh-ember"
            className="m-0 mt-6 text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.02] tracking-[-0.04em]"
          />
          <Reveal delay={0.15}>
            <p className="m-0 mt-7 max-w-[32rem] text-[18px] leading-relaxed text-kh-cream/70">
              Cast Beacons and get winning offers the second they land. The app also alerts you when a deal goes live
              near you, with offers you&apos;ll only find in the app.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <StoreBadges className="mt-10" />
            <p className="m-0 mt-5 text-[13px] text-kh-cream/50">Free on iPhone and Android.</p>
          </Reveal>
        </div>

        <div className="flex justify-center lg:justify-end">
          <motion.div style={{ rotate, y }} aria-hidden="true" className="relative">
            <PhoneFrame screenClassName="bg-kh-night text-kh-cream" statusTone="light">
              <div className="absolute inset-0">
                <Photo name="cocktail" decorative sizes="300px" className="h-full w-full object-cover opacity-70" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70" />
              </div>
              <div className="relative flex flex-col items-center pt-10">
                <p className="m-0 text-[13px] font-medium text-white/80">Friday</p>
                <p className="m-0 text-[76px] font-light leading-none tracking-[-0.04em] text-white">9:41</p>
              </div>
              <div className="relative mt-10 flex flex-col gap-2 px-3">
                {NOTES.map((n, i) => (
                  <motion.div
                    key={n.title}
                    initial={{ opacity: 0, y: -24, scale: 0.94 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.6 }}
                    transition={{ type: "spring", stiffness: 260, damping: 22, delay: 0.3 + i * 0.45 }}
                    className="flex gap-3 rounded-[20px] bg-white/80 p-3 text-kh-ink shadow-lg backdrop-blur-xl"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-kh-ink">
                      <span className="block h-2.5 w-2.5 bg-kh-ember" />
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="m-0 truncate text-[13px] font-semibold">{n.title}</p>
                        <span className="shrink-0 text-[11px] text-kh-muted">{n.time}</span>
                      </div>
                      <p className="m-0 text-[12px] leading-snug text-kh-body">{n.body}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </PhoneFrame>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
