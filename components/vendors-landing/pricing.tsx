"use client";

import Link from "next/link";
import { ArrowRight, Kicker, Reveal, SplitHeading, cx, useSpotlight } from "@/components/brand/primitives";
import { ADD_ONS, PLANS, PRICING } from "./data";

export function Pricing() {
  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-24 bg-kh-cream py-24 text-kh-ink sm:py-32 lg:py-40">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          <Kicker>Pricing</Kicker>
          <SplitHeading
            id="pricing-title"
            text="Free to list. Pay to win *more.*"
            accentClassName="text-kh-ember-deep"
            className="m-0 mt-6 text-[clamp(2.5rem,5.2vw,4.5rem)] font-light leading-[1.04] tracking-[-0.04em]"
          />
          {PRICING.launchOffer && (
            <Reveal delay={0.2}>
              <p className="m-0 mt-7 inline-flex items-center gap-2.5 rounded-full bg-kh-ember px-5 py-2.5 text-[15px] font-medium">
                <span aria-hidden="true" className="kh-live inline-block h-2 w-2 bg-kh-ink" />
                Founding venues: the first 10 get {PRICING.launchOffer}
              </p>
            </Reveal>
          )}
        </div>

        <ul className="m-0 mt-16 grid list-none grid-cols-1 gap-4 p-0 lg:grid-cols-3 lg:gap-5">
          {PLANS.map((p, i) => (
            <Reveal as="li" key={p.id} delay={i * 0.08}>
              <PlanCard plan={p} />
            </Reveal>
          ))}
        </ul>

        <Reveal delay={0.1}>
          <p className="m-0 mt-6 text-center text-[14px] text-kh-body">
            Winning bids carry a flat per-guest fee, charged only when the group is scanned in. You see it before you bid.
          </p>
        </Reveal>

        <div className="mt-20">
          <p className="m-0 text-[13px] font-medium uppercase tracking-[0.12em] text-kh-muted">Boosts, when you want them</p>
          <ul className="m-0 mt-5 grid list-none grid-cols-1 gap-6 p-0 md:grid-cols-3 md:gap-5">
            {ADD_ONS.map((a, i) => (
              <Reveal
                as="li"
                key={a.name}
                delay={i * 0.08}
                className="group flex flex-col gap-2 border-t border-kh-line pt-5 transition-colors hover:border-kh-ink"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <span className="text-[16px] font-medium">{a.name}</span>
                  <span className="shrink-0 text-[16px] tabular-nums">{a.price}</span>
                </div>
                <span className="text-[14px] leading-relaxed text-kh-muted">{a.body}</span>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan }: { plan: (typeof PLANS)[number] }) {
  const { ref, onPointerMove } = useSpotlight<HTMLDivElement>();
  const dark = plan.featured;
  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      className={cx(
        "kh-spot relative isolate flex h-full flex-col gap-6 overflow-hidden rounded-[32px] p-7 transition-transform duration-500 hover:-translate-y-1 sm:p-9",
        dark
          ? "bg-kh-ink text-kh-cream shadow-[0_40px_90px_-30px_rgba(232,116,77,0.55)]"
          : "border border-kh-sand bg-white",
      )}
    >
      {dark && <div aria-hidden="true" className="absolute -right-24 -top-24 -z-10 h-64 w-64 rounded-full bg-kh-ember/30 blur-3xl" />}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="m-0 text-[22px] font-medium">{plan.name}</h3>
          <p className={cx("m-0 mt-1 text-[15px]", dark ? "text-kh-mist" : "text-kh-muted")}>{plan.tagline}</p>
        </div>
        {plan.badge && <span className="rounded-full bg-kh-ember px-3 py-1 text-[12px] font-medium text-kh-ink">{plan.badge}</span>}
      </div>
      <p className="m-0 flex items-baseline gap-2">
        <span className="text-[clamp(2.25rem,3.4vw,2.75rem)] font-light tracking-[-0.03em]">{plan.price}</span>
        <span className={cx("text-[14px]", dark ? "text-kh-mist" : "text-kh-muted")}>{plan.cadence}</span>
      </p>
      <ul className="m-0 flex list-none flex-col gap-3 p-0">
        {plan.features.map((f) => (
          <li key={f} className={cx("flex items-start gap-3 text-[15px] leading-snug", dark ? "text-kh-cream/85" : "text-kh-body")}>
            <span aria-hidden="true" className={cx("mt-[7px] inline-block h-1.5 w-1.5 shrink-0", dark ? "bg-kh-ember" : "bg-kh-ember-deep")} />
            {f}
          </li>
        ))}
      </ul>
      <Link
        href="/vendors/register"
        className={cx(
          "kh-focus group mt-auto flex h-[52px] items-center justify-center gap-2 rounded-2xl text-[16px] font-medium transition-colors",
          dark ? "bg-kh-ember text-kh-ink hover:bg-[#EF8660]" : "border-[1.5px] border-kh-ink hover:bg-kh-ink hover:text-kh-cream",
        )}
      >
        {plan.cta}
        <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>
    </div>
  );
}
