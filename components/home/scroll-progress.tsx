"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin ember bar across the top that fills as you read down the page. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-kh-ember"
      style={{ scaleX }}
    />
  );
}
