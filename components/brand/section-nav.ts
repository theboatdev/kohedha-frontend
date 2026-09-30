"use client";

import { animate } from "framer-motion";
import { useEffect, useState } from "react";

/**
 * Returns the id of the tracked section crossing the middle of the viewport, or null when the
 * middle sits in a section the nav doesn't link to (so no link is wrongly shown as current).
 */
export function useScrollSpy(ids: string[], enabled = true) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join("|");

  useEffect(() => {
    if (!enabled) {
      setActive(null);
      return;
    }
    const order = key.split("|");
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target.id);
          else visible.delete(e.target.id);
        }
        setActive(order.find((id) => visible.has(id)) ?? null);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    order.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [key, enabled]);

  return active;
}

/**
 * Glides to an in-page section (or jumps, for reduced motion).
 *
 * The glide is driven frame by frame rather than with native smooth scrolling: Framer Motion
 * briefly resets and restores window scroll while measuring height:auto animations (the hero
 * demo runs several), and that restore cancels a native smooth scroll mid-flight. Any wheel,
 * touch or key input from the visitor stops the glide. The URL is left alone on purpose, since
 * Next's router reacts to history.replaceState.
 */
let stopGlide: (() => void) | null = null;

export function scrollToSection(id: string, { reduce = false, delay = 0 } = {}) {
  const go = () => {
    stopGlide?.();
    const el = id === "top" ? null : document.getElementById(id);
    if (id !== "top" && !el) return;
    const margin = el ? parseFloat(getComputedStyle(el).scrollMarginTop) || 0 : 0;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const target = Math.min(max, Math.max(0, el ? el.getBoundingClientRect().top + window.scrollY - margin : 0));
    const from = window.scrollY;
    if (reduce || Math.abs(target - from) < 2) {
      window.scrollTo(0, target);
      return;
    }
    const distance = Math.abs(target - from);
    const controls = animate(from, target, {
      duration: Math.min(1.4, 0.55 + distance / 9000),
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => window.scrollTo(0, v),
      onComplete: () => cleanup(),
    });
    const cancel = () => {
      controls.stop();
      cleanup();
    };
    const events = ["wheel", "touchstart", "keydown"] as const;
    const cleanup = () => {
      events.forEach((ev) => window.removeEventListener(ev, cancel));
      if (stopGlide === cancel) stopGlide = null;
    };
    events.forEach((ev) => window.addEventListener(ev, cancel, { passive: true }));
    stopGlide = cancel;
  };
  if (delay) window.setTimeout(go, delay);
  else go();
}
