"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState, type KeyboardEvent } from "react";
import { DAY_PARTS } from "./data";
import { EASE_OUT, Photo, Reveal, SplitHeading, cx } from "@/components/brand/primitives";

export function DayParts() {
  const [active, setActive] = useState(2);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const part = DAY_PARTS[active];
  const dark = part.dark;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const last = DAY_PARTS.length - 1;
    let next = active;
    if (e.key === "ArrowRight") next = active === last ? 0 : active + 1;
    else if (e.key === "ArrowLeft") next = active === 0 ? last : active - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <motion.section
      id="day"
      aria-labelledby="day-title"
      initial={false}
      animate={{ backgroundColor: part.bg, color: dark ? "#FAF8F5" : "#1A1A1A" }}
      transition={{ duration: 0.9, ease: EASE_OUT }}
      className="py-24 sm:py-32 lg:py-40"
    >
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-16">
          <div>
            {/* <p className="m-0 flex items-center gap-2.5 text-[13px] font-medium uppercase tracking-[0.14em]">
              <span aria-hidden="true" className="inline-block h-2 w-2 bg-kh-ember" />
              Any time of day
            </p> */}
            <SplitHeading
              id="day-title"
              text={"Not just the\nclub crowd."}
              accentClassName={cx(
                "transition-colors duration-700",
                dark ? "text-kh-ember" : "text-kh-ember-deep",
              )}
              className="m-0 mt-6 text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.02] tracking-[-0.04em]"
            />
          </div>
          <Reveal delay={0.15}>
            <p className={cx("m-0 text-[18px] leading-relaxed transition-colors duration-700", dark ? "text-kh-cream/70" : "text-kh-body")}>
              Cast a Beacon any time of day, from a slow Sunday brunch to one more round at midnight, street food to
              rooftops.
            </p>
          </Reveal>
        </div>

        {/* Timeline */}
        <div className="relative mt-16">
          <div
            aria-hidden="true"
            className="absolute left-0 right-0 top-[22px] h-px bg-[linear-gradient(90deg,#E8744D_0%,#E8744D_40%,#1A1A1A_100%)] opacity-40"
          />
          <div role="tablist" aria-label="Time of day" onKeyDown={onKey} className="relative grid grid-cols-5">
            {DAY_PARTS.map((d, i) => {
              const on = i === active;
              return (
                <button
                  key={d.time}
                  ref={(el) => {
                    tabs.current[i] = el;
                  }}
                  type="button"
                  role="tab"
                  id={`day-tab-${i}`}
                  aria-selected={on}
                  aria-controls="day-panel"
                  tabIndex={on ? 0 : -1}
                  onClick={() => setActive(i)}
                  className="kh-focus group flex flex-col items-center gap-3 rounded-2xl pb-2 text-center"
                >
                  <span className="relative flex h-11 w-11 items-center justify-center">
                    {on && (
                      <motion.span
                        layoutId="day-marker"
                        className="absolute inset-0 rounded-full bg-kh-ember shadow-[0_0_40px_rgba(232,116,77,0.6)]"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <span
                      className={cx(
                        "relative block h-2.5 w-2.5 transition-all duration-300",
                        on ? "scale-0" : "bg-current opacity-40 group-hover:scale-150 group-hover:opacity-80",
                      )}
                    />
                    {on && <DayIcon dark={d.dark} />}
                  </span>
                  <span className={cx("text-[13px] tabular-nums transition-opacity sm:text-[15px]", on ? "font-medium" : "opacity-80")}>
                    {d.time}
                  </span>
                  <span className={cx("hidden text-[14px] sm:block", on ? "opacity-100" : "opacity-75")}>{d.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel */}
        <div
          id="day-panel"
          role="tabpanel"
          aria-labelledby={`day-tab-${active}`}
          className="mt-12 grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16"
        >
          <div className="relative aspect-[4/3] overflow-hidden rounded-[36px] shadow-[0_40px_100px_-40px_rgba(0,0,0,0.5)]">
            <AnimatePresence initial={false}>
              <motion.div
                key={part.photo}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: EASE_OUT }}
              >
                <Photo name={part.photo} sizes="(min-width: 1024px) 55vw, 100vw" className="h-full w-full object-cover" />
              </motion.div>
            </AnimatePresence>
            <span className="absolute left-5 top-5 rounded-full bg-black/45 px-3 py-1.5 text-[13px] text-white backdrop-blur-md">
              {part.time}
            </span>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.45, ease: EASE_OUT }}
            >
              <p className="m-0 text-[clamp(4rem,9vw,7.5rem)] font-light leading-none tracking-[-0.05em] tabular-nums">
                {part.time.split(" ")[0]}
                <span className="ml-2 text-[0.3em] tracking-normal opacity-60">{part.time.split(" ")[1]}</span>
              </p>
              <h3 className="m-0 mt-5 text-[clamp(1.75rem,3vw,2.5rem)] font-light tracking-[-0.03em]">{part.title}</h3>
              <p className={cx("m-0 mt-3 max-w-[26rem] text-[17px] leading-relaxed", dark ? "text-kh-cream/70" : "text-kh-body")}>
                {part.body}
              </p>
              <div
                className={cx(
                  "mt-8 inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-[14px]",
                  dark ? "bg-white/10" : "bg-white/70",
                )}
              >
                <span aria-hidden="true" className="kh-live inline-block h-2 w-2 bg-kh-ember" />
                <span>
                  <span className="opacity-75">Beacon idea · </span>
                  {part.beacon}
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}

function DayIcon({ dark }: { dark: boolean }) {
  return (
    <svg className="relative text-kh-ink" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
      {dark ? (
        <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
      ) : (
        <>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </>
      )}
    </svg>
  );
}
