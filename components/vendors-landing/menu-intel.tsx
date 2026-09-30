"use client";

import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import { useState } from "react";
import { EASE_OUT, Reveal, cx } from "@/components/brand/primitives";
import { MENU, type Verdict } from "./data";
import { PillarCopy } from "./pillar-copy";

const FILTERS = [
  { id: "all", label: "All dishes", keep: (_: Verdict) => true },
  { id: "win", label: "Winners", keep: (v: Verdict) => v === "Promote" || v === "Keep" },
  { id: "fix", label: "Needs attention", keep: (v: Verdict) => v === "Retune" || v === "Drop?" },
];

const CHIP: Record<Verdict, string> = {
  Promote: "bg-kh-ink text-kh-cream",
  Keep: "bg-kh-sand text-kh-ink",
  Retune: "bg-kh-sand text-kh-ink",
  "Drop?": "bg-kh-ember text-kh-ink",
};

export function MenuIntel() {
  const [filter, setFilter] = useState("all");
  const [open, setOpen] = useState<string | null>(MENU[0].name);
  const [added, setAdded] = useState(false);
  const keep = FILTERS.find((f) => f.id === filter)!.keep;
  const rows = MENU.filter((d) => keep(d.verdict));

  return (
    <section aria-labelledby="menu-title" className="bg-kh-cream pb-24 pt-16 text-kh-ink sm:pb-32 lg:pb-40 lg:pt-20">
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-14 px-4 sm:px-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-20 lg:px-12">
        <PillarCopy
          id="menu-title"
          kicker="Menu intelligence"
          title="Know which dish *wins* them back."
          body="After each visit, guests vote on the dishes they ordered. Not a star rating for the whole place, but a clear signal on every plate. Put your winners in your next bid, and fix what's losing regulars."
        />

        <Reveal delay={0.1}>
          <div className="rounded-[32px] border border-kh-sand bg-white p-5 shadow-[0_30px_80px_-40px_rgba(26,26,26,0.35)] sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="m-0 text-[18px] font-medium">This week</p>
              <LayoutGroup id="menu-filter">
                <div role="group" aria-label="Filter dishes" className="flex gap-1 rounded-full bg-kh-cream p-1">
                  {FILTERS.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      aria-pressed={filter === f.id}
                      onClick={() => setFilter(f.id)}
                      className={cx(
                        "kh-focus relative h-9 rounded-full px-3.5 text-[13px] transition-colors",
                        filter === f.id ? "text-kh-cream" : "text-kh-body hover:text-kh-ink",
                      )}
                    >
                      {filter === f.id && (
                        <motion.span
                          layoutId="menu-pill"
                          className="absolute inset-0 rounded-full bg-kh-ink"
                          transition={{ type: "spring", stiffness: 420, damping: 34 }}
                        />
                      )}
                      <span className="relative">{f.label}</span>
                    </button>
                  ))}
                </div>
              </LayoutGroup>
            </div>

            <ul className="m-0 mt-5 flex min-h-[340px] list-none flex-col gap-2 p-0">
              <AnimatePresence mode="popLayout" initial={false}>
                {rows.map((d) => {
                  const total = d.up + d.down;
                  const approval = Math.round((d.up / total) * 100);
                  const expanded = open === d.name;
                  return (
                    <motion.li
                      key={d.name}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97, transition: { duration: 0.18 } }}
                      transition={{ type: "spring", stiffness: 380, damping: 32 }}
                      className="overflow-hidden rounded-[18px] bg-kh-cream"
                    >
                      <button
                        type="button"
                        aria-expanded={expanded}
                        onClick={() => setOpen(expanded ? null : d.name)}
                        className="kh-focus flex w-full flex-col gap-2.5 rounded-[18px] px-4 py-3.5 text-left"
                      >
                        <span className="flex w-full items-center gap-3">
                          <span className="min-w-0 flex-1 text-[15px] font-medium leading-snug">{d.name}</span>
                          <span className={cx("shrink-0 rounded-full px-2.5 py-0.5 text-[12px]", CHIP[d.verdict])}>{d.verdict}</span>
                        </span>
                        <span className="flex w-full items-center gap-3">
                          <span aria-hidden="true" className="flex h-2 flex-1 overflow-hidden rounded-full bg-kh-sand">
                            <motion.span
                              className="block h-full bg-kh-ink"
                              initial={{ width: 0 }}
                              whileInView={{ width: `${approval}%` }}
                              viewport={{ once: true }}
                              transition={{ duration: 1, ease: EASE_OUT }}
                            />
                            <span className="block h-full flex-1 bg-kh-ember-deep/70" />
                          </span>
                          <span className="shrink-0 text-[13px] tabular-nums text-kh-body">
                            <span className="sr-only">
                              {d.up} upvotes, {d.down} downvotes, {approval}% approval
                            </span>
                            <span aria-hidden="true">
                              ▲ {d.up} · ▼ {d.down}
                            </span>
                          </span>
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {expanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: EASE_OUT }}
                          >
                            <div className="flex flex-col gap-3 px-4 pb-4 sm:flex-row sm:items-center sm:justify-between">
                              <p className="m-0 text-[14px] leading-relaxed text-kh-body">{d.tip}</p>
                              {d.verdict === "Promote" && (
                                <button
                                  type="button"
                                  onClick={() => setAdded(true)}
                                  className={cx(
                                    "kh-focus flex h-10 shrink-0 items-center gap-2 rounded-xl px-4 text-[13px] font-medium transition-colors",
                                    added ? "bg-kh-ember text-kh-ink" : "bg-kh-ink text-kh-cream hover:bg-black",
                                  )}
                                  aria-live="polite"
                                >
                                  {added ? "Added to your next bid" : "Use in a bid"}
                                </button>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
