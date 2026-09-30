"use client";

import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useRef } from "react";
import { VIBES } from "./data";

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

/** A tilted ember band of vibes that drifts on its own and speeds up with scroll velocity. */
export function VibeMarquee() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref);
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [0, 1000], [0, 4], { clamp: false });
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(-1);

  useAnimationFrame((_, delta) => {
    if (reduce || !inView) return;
    let move = dir.current * 2.2 * (delta / 1000);
    const b = boost.get();
    if (b < 0) dir.current = 1;
    else if (b > 0) dir.current = -1;
    move += dir.current * Math.abs(move) * Math.abs(b);
    baseX.set(baseX.get() + move);
  });

  const row = (copy: number) => (
    <div key={copy} className="flex shrink-0 items-center" aria-hidden={copy > 0 ? true : undefined}>
      {VIBES.map((v, i) => (
        <span key={v} className="flex items-center">
          <span className={i % 2 ? "font-kh-serif italic" : "font-light"}>#{v}</span>
          <span className="mx-8 inline-block h-3 w-3 bg-kh-ink sm:mx-12 sm:h-4 sm:w-4" />
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative overflow-hidden bg-[linear-gradient(to_bottom,#100F0D_50%,#FAF8F5_50%)] py-10"
    >
      <div className="-mx-[5%] -rotate-2 bg-kh-ember py-5 text-kh-ink shadow-[0_20px_60px_-20px_rgba(232,116,77,0.6)] sm:py-7">
        <motion.div
          className="flex w-max whitespace-nowrap text-[clamp(2rem,5vw,4.25rem)] leading-none tracking-[-0.03em]"
          style={{ x }}
        >
          {row(0)}
          {row(1)}
        </motion.div>
      </div>
    </div>
  );
}
