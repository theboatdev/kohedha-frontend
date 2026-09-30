"use client";

import {
  MotionConfig,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type HTMLMotionProps,
} from "framer-motion";
import {
  createElement,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type PointerEvent,
  type ReactNode,
  type RefObject,
} from "react";
import { APP_STORE_URL, PHOTO_ALT, PLAY_STORE_URL, type PhotoKey } from "./assets";

export const EASE_OUT = [0.22, 1, 0.36, 1] as const;

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export function pad(n: number) {
  return n < 10 ? "0" + n : String(n);
}

export function hms(sec: number) {
  const s = Math.max(0, sec);
  return Math.floor(s / 3600) + ":" + pad(Math.floor((s % 3600) / 60)) + ":" + pad(s % 60);
}

/** Honours the OS "reduce motion" setting for every motion component below it. */
export function MotionProvider({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fades and lifts content in the first time it scrolls into view. */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  as = "div",
  className,
  ...rest
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  as?: "div" | "li";
  className?: string;
} & Omit<HTMLMotionProps<"div">, "children">) {
  const Comp = (as === "li" ? motion.li : motion.div) as typeof motion.div;
  return (
    <Comp
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -12% 0px" }}
      transition={{ duration: 0.8, ease: EASE_OUT, delay }}
      className={className}
      {...rest}
    >
      {children}
    </Comp>
  );
}

/**
 * Headline that rises in word by word. Wrap a word in *asterisks* to give it the accent
 * colour; use "\n" for a line break. Screen readers get the plain sentence.
 */
export function SplitHeading({
  as = "h2",
  id,
  text,
  className,
  accentClassName = "",
  delay = 0,
  immediate = false,
}: {
  as?: ElementType;
  id?: string;
  text: string;
  className?: string;
  accentClassName?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const show = immediate || inView;
  const plain = text.replace(/\*/g, "").replace(/\n/g, " ");
  let i = 0;

  const lines = text.split("\n").map((line, li) => (
    <span key={li} className="block">
      {line
        .split(" ")
        .filter(Boolean)
        .map((raw, wi) => {
          const accent = raw.startsWith("*");
          const word = raw.replace(/\*/g, "");
          const idx = i++;
          return (
            <span key={wi} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em] align-bottom">
              <motion.span
                className={cx("inline-block will-change-transform", accent && accentClassName)}
                initial={{ y: "105%" }}
                animate={show ? { y: "0%" } : { y: "105%" }}
                transition={{ duration: 0.9, ease: EASE_OUT, delay: delay + idx * 0.055 }}
              >
                {word}
              </motion.span>
              {" "}
            </span>
          );
        })}
    </span>
  ));

  return createElement(
    as,
    { ref, id, className, "aria-label": plain },
    <span aria-hidden="true">{lines}</span>,
  );
}

/**
 * Small uppercase label above a section heading.
 * `light` = cream backgrounds, `dark` = night backgrounds, `sand` = tinted backgrounds where
 * ember-deep text would fall under 4.5:1, so the text goes ink and only the square keeps the colour.
 */
export function Kicker({
  children,
  tone = "light",
  className,
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "sand";
  className?: string;
}) {
  const text = tone === "dark" ? "text-kh-ember" : tone === "sand" ? "text-kh-ink" : "text-kh-ember-deep";
  const square = tone === "dark" ? "bg-kh-ember" : "bg-kh-ember-deep";
  return (
    <p
      className={cx(
        "m-0 flex items-start gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em]",
        text,
        className,
      )}
    >
      <span aria-hidden="true" className={cx("mt-[0.44em] inline-block h-2 w-2 shrink-0", square)} />
      {children}
    </p>
  );
}

/** Pulls its child toward the pointer on hover. Off for touch and reduced motion. */
export function Magnetic({
  children,
  strength = 0.3,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 16, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 16, mass: 0.4 });

  const move = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      className={cx("inline-flex", className)}
      style={{ x: sx, y: sy }}
      onPointerMove={move}
      onPointerLeave={leave}
    >
      {children}
    </motion.span>
  );
}

/** Tracks the pointer as CSS variables so a card can paint a soft spotlight under it. */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const onPointerMove = (e: PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return { ref, onPointerMove };
}

/** Responsive photo from /public/home (WebP, 560w + 1024w). */
export function Photo({
  name,
  className,
  sizes = "(min-width: 1024px) 50vw, 100vw",
  priority = false,
  decorative = false,
  style,
}: {
  name: PhotoKey;
  className?: string;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  style?: CSSProperties;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/home/${name}.webp`}
      srcSet={`/home/${name}-560.webp 560w, /home/${name}.webp 1024w`}
      sizes={sizes}
      alt={decorative ? "" : PHOTO_ALT[name]}
      width={1024}
      height={1024}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      decoding="async"
      className={className}
      style={style}
    />
  );
}

/** The kohedha wordmark: lowercase name + the ember square. */
export function Wordmark({ className, dotClassName }: { className?: string; dotClassName?: string }) {
  return (
    <span className={cx("inline-flex items-end gap-[0.08em] font-light leading-none tracking-[-0.03em]", className)}>
      kohedha
      <span
        aria-hidden="true"
        className={cx("mb-[0.14em] inline-block h-[0.22em] w-[0.22em] bg-kh-ember", dotClassName)}
      />
    </span>
  );
}

/** A second counter that only ticks while the element is on screen. */
export function useSeconds<T extends Element>(ref: RefObject<T | null>) {
  const [t, setT] = useState(0);
  const inView = useInView(ref);
  useEffect(() => {
    if (!inView) return;
    const id = setInterval(() => setT((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [inView]);
  return t;
}

/** Decorative QR-style glyph, deterministic for a given seed. */
export function QrGlyph({ seed = "kohedha", className }: { seed?: string; className?: string }) {
  const n = 21;
  let h = 2166136261;
  for (const c of seed) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
  const rand = () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 1000) / 1000;
  };
  const finder = (x: number, y: number) =>
    (x < 7 && y < 7) || (x >= n - 7 && y < 7) || (x < 7 && y >= n - 7);
  const cells: string[] = [];
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) if (!finder(x, y) && rand() > 0.52) cells.push(`M${x} ${y}h1v1h-1z`);
  const eye = (x: number, y: number) =>
    `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return (
    <svg viewBox={`-1 -1 ${n + 2} ${n + 2}`} className={className} aria-hidden="true" shapeRendering="crispEdges">
      <rect x={-1} y={-1} width={n + 2} height={n + 2} fill="#fff" />
      <path fillRule="evenodd" d={eye(0, 0) + eye(n - 7, 0) + eye(0, n - 7)} fill="#1A1A1A" />
      <path d={cells.join("")} fill="#1A1A1A" />
    </svg>
  );
}

/** Expanding radar rings with the brand square at the centre. */
export function Radar({
  className,
  active = true,
  tone = "dark",
}: {
  className?: string;
  active?: boolean;
  tone?: "dark" | "light";
}) {
  const stroke = tone === "dark" ? "rgba(250,248,245,0.14)" : "rgba(26,26,26,0.12)";
  // Pulses are hidden by CSS under reduced motion, so server and client render the same markup.
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      {[30, 55, 80].map((r) => (
        <circle key={r} cx="100" cy="100" r={r} fill="none" stroke={stroke} strokeDasharray="2 4" />
      ))}
      {active &&
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            className="kh-motion-only"
            cx="100"
            cy="100"
            fill="none"
            stroke="#E8744D"
            strokeWidth="1.5"
            initial={{ r: 6, opacity: 0.7 }}
            animate={{ r: 92, opacity: 0 }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.8, ease: "easeOut" }}
          />
        ))}
      <rect x="94" y="94" width="12" height="12" fill="#E8744D" />
    </svg>
  );
}

export function StoreBadges({ className }: { className?: string }) {
  return (
    <div className={cx("flex flex-wrap items-center gap-3", className)}>
      <a
        href={APP_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="kh-focus inline-block rounded-[10px] transition-transform duration-200 hover:-translate-y-0.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/app-store.png" alt="Download on the App Store" width={150} height={50} className="h-[50px] w-auto" />
      </a>
      <a
        href={PLAY_STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="kh-focus inline-block rounded-[10px] transition-transform duration-200 hover:-translate-y-0.5"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/play-store2.png" alt="Get it on Google Play" width={170} height={50} className="h-[50px] w-auto" />
      </a>
    </div>
  );
}

export function ArrowRight({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 12h14" />
      <path d="M13 6l6 6-6 6" />
    </svg>
  );
}
