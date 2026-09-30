"use client";

import { motion } from "framer-motion";
import { EASE_OUT, Kicker, Reveal, SplitHeading } from "@/components/brand/primitives";

/** Kicker, headline, body and an animated checklist: the text half of each product pillar. */
export function PillarCopy({
  id,
  kicker,
  title,
  body,
  points = [],
}: {
  id: string;
  kicker: string;
  title: string;
  body: string;
  points?: string[];
}) {
  return (
    <div>
      <Kicker>{kicker}</Kicker>
      <SplitHeading
        id={id}
        text={title}
        accentClassName="text-kh-ember-deep"
        className="m-0 mt-6 text-balance text-[clamp(2.25rem,4.4vw,3.75rem)] font-light leading-[1.05] tracking-[-0.035em]"
      />
      <Reveal delay={0.1}>
        <p className="m-0 mt-6 max-w-[34rem] text-[18px] leading-relaxed text-kh-body">{body}</p>
      </Reveal>
      {points.length > 0 && (
        <ul className="m-0 mt-8 flex list-none flex-col gap-3.5 p-0">
          {points.map((pt, i) => (
            <motion.li
              key={pt}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "0px 0px -10% 0px" }}
              transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.15 + i * 0.08 }}
              className="flex items-start gap-3.5 text-[16px] leading-normal"
            >
              <span aria-hidden="true" className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-kh-ink text-kh-cream">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7.5" />
                </svg>
              </span>
              {pt}
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
