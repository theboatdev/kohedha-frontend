"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import Link from "next/link";
import { useRef, useState, type ReactNode } from "react";
import { DISHES, SLOTS } from "./data";
import {
  ArrowRight,
  EASE_OUT,
  Kicker,
  Photo,
  QrGlyph,
  Radar,
  Reveal,
  SplitHeading,
  cx,
  hms,
  useSeconds,
  useSpotlight,
} from "@/components/brand/primitives";

export function Features() {
  return (
    <section id="features" aria-labelledby="features-title" className="bg-kh-cream pb-24 text-kh-ink sm:pb-32 lg:pb-40">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="border-t border-kh-line pt-20 sm:pt-24 lg:pt-28">
          {/* <Kicker>Everything else</Kicker> */}
          <SplitHeading
            id="features-title"
            text="One app for the whole night out."
            accentClassName="text-kh-ember-deep"
            className="m-0 mt-6 max-w-[16ch] text-[clamp(2.5rem,5.6vw,5rem)] font-light leading-[1.02] tracking-[-0.04em]"
          />
        </div>

        <div className="mt-14 grid grid-cols-1 gap-4 lg:grid-cols-6 lg:gap-5">
          <BeaconCard />
          <PlacesCard />
          <DealCard />
          <DishCard />
          <BookingCard />
        </div>
      </div>
    </section>
  );
}

function Card({
  className,
  children,
  delay = 0,
  labelledBy,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
  labelledBy: string;
}) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  return (
    <Reveal delay={delay} className={className}>
      <article
        ref={ref}
        onPointerMove={onPointerMove}
        aria-labelledby={labelledBy}
        className="kh-spot group relative isolate flex h-full flex-col overflow-hidden rounded-[32px] p-7 sm:p-9"
      >
        {children}
      </article>
    </Reveal>
  );
}

function CardTitle({ id, over, children, dark }: { id: string; over: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className="relative">
      <p className={cx("m-0 text-[13px] font-medium uppercase tracking-[0.12em]", dark ? "text-kh-ember" : "text-kh-ember-deep")}>
        {over}
      </p>
      <h3 id={id} className="m-0 mt-3 max-w-[18ch] text-[clamp(1.6rem,2.6vw,2.25rem)] font-light leading-[1.1] tracking-[-0.03em]">
        {children}
      </h3>
    </div>
  );
}

function BeaconCard() {
  return (
    <Card labelledBy="f-beacon" className="lg:col-span-3 lg:row-span-2">
      <div className="absolute inset-0 -z-10 bg-kh-ink" />
      <div className="relative text-kh-cream">
        <CardTitle id="f-beacon" over="The Beacon" dark>
          Tell the city you&apos;re out.
        </CardTitle>
        <p className="m-0 mt-4 max-w-[26rem] text-[16px] leading-relaxed text-kh-cream/65">
          Venues that match your vibe compete, and the best offer comes to you. You only ever see the winner.
        </p>
      </div>
      <div className="relative mx-auto my-6 aspect-square w-full max-w-[380px] flex-1 lg:my-0">
        <Radar className="h-full w-full" />
        {[
          { l: "18%", t: "30%", o: "Free first round", win: true },
          { l: "70%", t: "22%", o: "20% off the bill" },
          { l: "64%", t: "76%", o: "Free starter" },
        ].map((b, i) => (
          <div key={b.o} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: b.l, top: b.t }}>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 + i * 0.25, duration: 0.6, ease: EASE_OUT }}
              className={cx(
                "block whitespace-nowrap rounded-full px-3 py-1.5 text-[12px]",
                b.win ? "bg-kh-ember font-medium text-kh-ink shadow-[0_0_30px_rgba(232,116,77,0.5)]" : "bg-white/10 text-kh-cream/70",
              )}
            >
              {b.o}
            </motion.span>
          </div>
        ))}
      </div>
      <Link href="#beacon" className="kh-focus relative inline-flex items-center gap-2 self-start text-[15px] font-medium text-kh-cream">
        <span className="kh-link">See how it works</span>
        <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </Card>
  );
}

function PlacesCard() {
  return (
    <Card labelledBy="f-places" delay={0.08} className="min-h-[340px] lg:col-span-3">
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <Photo
          name="culture"
          decorative
          className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-kh-night from-25% via-kh-night/85 to-kh-night/35" />
      </div>
      <div className="relative mt-auto text-kh-cream">
        <CardTitle id="f-places" over="Places and events" dark>
          Every spot and every show, on one map.
        </CardTitle>
        <p className="m-0 mt-3 max-w-[30rem] text-[15px] leading-relaxed text-kh-cream/75">
          Cafés, rooftops, pubs and street food, plus live music, themed nights and pop-ups.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["Tonight · Kandyan drummers, 7 PM", "Sat · night market"].map((t) => (
            <span key={t} className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[12px] backdrop-blur">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Card>
  );
}

function DealCard() {
  const ref = useRef<HTMLDivElement>(null);
  const t = useSeconds(ref);
  const inView = useInView(ref, { once: true });
  return (
    <Card labelledBy="f-deals" delay={0.16} className="lg:col-span-3">
      <div className="absolute inset-0 -z-10 bg-kh-ember" />
      <div ref={ref} className="relative flex h-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="m-0 text-[13px] font-medium uppercase tracking-[0.12em]">Live deals</p>
          <h3 id="f-deals" className="m-0 mt-3 max-w-[14ch] text-[clamp(1.6rem,2.6vw,2.25rem)] font-light leading-[1.1] tracking-[-0.03em]">
            Deals that start when you&apos;re close.
          </h3>
          <p className="m-0 mt-3 max-w-[20rem] text-[15px] leading-relaxed text-kh-ink">
            When one goes live within about 2 km, you&apos;ll know. Claim it free in the app.
          </p>
        </div>
        <div className="w-full shrink-0 rounded-[24px] bg-kh-ink p-5 text-kh-cream shadow-[0_24px_50px_-20px_rgba(26,26,26,0.6)] sm:w-[240px]">
          <p className="m-0 text-[17px] font-medium">20% off mains</p>
          <p className="m-0 text-[13px] text-kh-mist">Salt Terrace · 400 m</p>
          <p className="m-0 mt-4 text-[11px] uppercase tracking-[0.12em] text-kh-mist">Ends in</p>
          <p className="m-0 text-[28px] font-medium tabular-nums text-kh-ember" aria-label="Ends in about an hour and a half">
            {hms(5652 - t)}
          </p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="h-full rounded-full bg-kh-ember"
              initial={{ width: "0%" }}
              animate={{ width: inView ? "80%" : "0%" }}
              transition={{ duration: 1.4, ease: EASE_OUT, delay: 0.3 }}
            />
          </div>
          <p className="m-0 mt-2 text-[12px] text-kh-mist">8 of 10 claimed</p>
        </div>
      </div>
    </Card>
  );
}

function DishCard() {
  const [votes, setVotes] = useState<Record<string, 1 | -1 | undefined>>({});

  const vote = (id: string, dir: 1 | -1) => setVotes((v) => ({ ...v, [id]: v[id] === dir ? undefined : dir }));

  // Highest score first; on a tie, your upvote lifts a dish and your downvote sinks it.
  const rows = DISHES.map((d, i) => ({ ...d, base: i, score: d.up + (votes[d.id] ?? 0) })).sort(
    (a, b) => b.score - a.score || (votes[b.id] ?? 0) - (votes[a.id] ?? 0) || a.base - b.base,
  );

  return (
    <Card labelledBy="f-dishes" delay={0.08} className="lg:col-span-3">
      <div className="absolute inset-0 -z-10 border border-kh-line bg-white [border-radius:inherit]" />
      <div className="relative flex items-start justify-between gap-4">
        <CardTitle id="f-dishes" over="Dish ratings">
          Rate the dish, not the place.
        </CardTitle>
        <span className="shrink-0 rounded-full bg-kh-sand px-3 py-1 text-[12px] text-kh-body">Try it</span>
      </div>
      <p className="relative m-0 mt-3 max-w-[30rem] text-[15px] leading-relaxed text-kh-body">
        One star can&apos;t tell you the kottu is brilliant and the curry isn&apos;t. Vote a dish and watch the menu
        re-rank.
      </p>
      <ol className="relative m-0 mt-6 flex list-none flex-col gap-2 p-0">
        {rows.map((d, i) => {
          const mine = votes[d.id];
          return (
            <motion.li
              key={d.id}
              layout
              transition={{ type: "spring", stiffness: 420, damping: 36 }}
              className="flex items-center gap-2 rounded-2xl bg-kh-cream py-1.5 pl-4 pr-1.5 sm:gap-3"
            >
              <span className="w-4 text-[13px] tabular-nums text-kh-muted">{i + 1}</span>
              <span className="min-w-0 flex-1 py-1 text-[15px] leading-snug">{d.name}</span>
              <span className="relative w-9 shrink-0 overflow-hidden text-right text-[15px] font-medium tabular-nums text-kh-ember-deep">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={d.score}
                    className="inline-block"
                    initial={{ y: mine === -1 ? -14 : 14, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: mine === -1 ? 14 : -14, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                  >
                    {d.score}
                  </motion.span>
                </AnimatePresence>
              </span>
              <VoteButton dir={1} active={mine === 1} label={`Upvote ${d.name}`} onClick={() => vote(d.id, 1)} />
              <VoteButton dir={-1} active={mine === -1} label={`Downvote ${d.name}`} onClick={() => vote(d.id, -1)} />
            </motion.li>
          );
        })}
      </ol>
    </Card>
  );
}

function VoteButton({ dir, active, label, onClick }: { dir: 1 | -1; active: boolean; label: string; onClick: () => void }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      whileTap={{ scale: 0.82 }}
      className={cx(
        "kh-focus flex h-10 w-9 shrink-0 items-center justify-center rounded-xl transition-colors sm:w-10",
        active ? (dir === 1 ? "bg-kh-ember text-kh-ink" : "bg-kh-ink text-kh-cream") : "text-kh-muted hover:bg-kh-sand hover:text-kh-ink",
      )}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
        style={{ transform: dir === -1 ? "rotate(180deg)" : undefined }}
      >
        <path d="M12 19V5" />
        <path d="M6 11l6-6 6 6" />
      </svg>
    </motion.button>
  );
}

function BookingCard() {
  const [slot, setSlot] = useState("8:00");
  return (
    <Card labelledBy="f-book" delay={0.16} className="lg:col-span-3">
      <div className="absolute inset-0 -z-10 bg-kh-sand" />
      <div className="relative flex items-start justify-between gap-4">
        <CardTitle id="f-book" over="Bookings">
          Pick a table and a time. No calls.
        </CardTitle>
        <span className="shrink-0 rounded-full bg-white px-3 py-1 text-[12px] text-kh-body">Try it</span>
      </div>
      <p className="relative m-0 mt-3 max-w-[30rem] text-[15px] leading-relaxed text-kh-body">
        Your QR pass is ready instantly. Change or cancel free up to 2 hours before.
      </p>

      <div className="relative mt-6 flex flex-1 flex-col gap-4 sm:flex-row sm:items-end">
        <div className="flex-1">
          <p className="m-0 mb-2.5 text-[12px] font-medium uppercase tracking-[0.12em] text-kh-muted" id="slot-label">
            Tonight · table for 4
          </p>
          <div role="group" aria-labelledby="slot-label" className="grid grid-cols-5 gap-1.5">
            {SLOTS.map((s) => (
              <button
                key={s}
                type="button"
                aria-pressed={slot === s}
                onClick={() => setSlot(s)}
                className={cx(
                  "kh-focus h-11 rounded-xl text-[14px] tabular-nums transition-all duration-200",
                  slot === s ? "bg-kh-ink text-kh-cream" : "bg-white text-kh-ink hover:-translate-y-0.5 hover:shadow-md",
                )}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div className="flex h-[132px] w-full items-center gap-4 rounded-[22px] bg-white p-3 sm:w-[220px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={slot}
              initial={{ opacity: 0, scale: 0.9, rotate: -4 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, ease: EASE_OUT }}
              className="flex items-center gap-3"
            >
              <QrGlyph seed={"hl" + slot} className="h-[92px] w-[92px] shrink-0" />
              <div aria-live="polite">
                <p className="m-0 text-[11px] uppercase tracking-[0.12em] text-kh-muted">Pass ready</p>
                <p className="m-0 text-[20px] font-medium tabular-nums">{slot} PM</p>
                <p className="m-0 text-[12px] text-kh-muted">Table for 4</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </Card>
  );
}
