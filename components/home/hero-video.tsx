"use client";

import { motion, useInView, type MotionStyle } from "framer-motion";
import { useEffect, useRef, useState } from "react";

type Orientation = "landscape" | "portrait";

/**
 * Looping background video for the hero. Two encodes (a 16:9 crop for wide screens, the full
 * portrait frame for phones) sit behind posters; only the one matching the screen is played,
 * so the other is never downloaded. Playback waits for the page to finish loading, pauses when
 * the hero is off screen or `paused`, and stays on the poster for data-saver visitors.
 */
export function HeroVideo({ style, paused = false }: { style?: MotionStyle; paused?: boolean }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const landRef = useRef<HTMLVideoElement>(null);
  const portRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(wrapRef, { amount: 0.1 });
  const [orientation, setOrientation] = useState<Orientation | null>(null);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [saveData, setSaveData] = useState(false);

  useEffect(() => {
    const portrait = window.matchMedia("(orientation: portrait)");
    const sync = () => setOrientation(portrait.matches ? "portrait" : "landscape");
    sync();
    portrait.addEventListener("change", sync);

    setSaveData(!!(navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData);

    const loaded = () => setPageLoaded(true);
    if (document.readyState === "complete") loaded();
    else window.addEventListener("load", loaded, { once: true });

    return () => {
      portrait.removeEventListener("change", sync);
      window.removeEventListener("load", loaded);
    };
  }, []);

  useEffect(() => {
    if (!orientation) return;
    const active = orientation === "portrait" ? portRef.current : landRef.current;
    const idle = orientation === "portrait" ? landRef.current : portRef.current;
    idle?.pause();
    if (!active) return;
    if (paused || saveData || !inView || !pageLoaded) {
      active.pause();
      return;
    }
    active.preload = "auto";
    // Autoplay can still be refused (e.g. low-power mode); the poster simply stays up.
    active.play().catch(() => {});
  }, [orientation, paused, saveData, inView, pageLoaded]);

  const videoProps = {
    muted: true,
    loop: true,
    playsInline: true,
    preload: "none" as const,
    disablePictureInPicture: true,
    disableRemotePlayback: true,
    "aria-hidden": true,
    tabIndex: -1,
  };

  return (
    <>
      {/* Posters are CSS backgrounds scoped by orientation, so each device fetches only its own.
          The slight blur keeps the video's own on-screen text from competing with the headline. */}
      <motion.div
        ref={wrapRef}
        aria-hidden="true"
        className="absolute inset-0 -z-20 bg-cover bg-center blur-[2px] landscape:bg-[url('/home/hero-desktop-poster.webp')] portrait:bg-[url('/home/hero-mobile-poster.webp')]"
        style={style}
      >
        <video ref={landRef} {...videoProps} className="hidden h-full w-full object-cover landscape:block">
          <source src="/home/hero-desktop.mp4" type="video/mp4" />
        </video>
        <video ref={portRef} {...videoProps} className="hidden h-full w-full object-cover portrait:block">
          <source src="/home/hero-mobile.mp4" type="video/mp4" />
        </video>
      </motion.div>

    </>
  );
}
