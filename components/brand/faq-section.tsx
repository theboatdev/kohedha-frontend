"use client";

import * as Accordion from "@radix-ui/react-accordion";
import { Kicker, Reveal, SplitHeading } from "./primitives";

/** Two-column FAQ: sticky heading on the left, accessible accordion on the right. */
export function FaqSection({
  id,
  kicker,
  title,
  intro,
  items,
  className = "bg-kh-cream py-24 sm:py-32 lg:py-40",
}: {
  id: string;
  kicker: string;
  title: string;
  intro: string;
  items: { q: string; a: string }[];
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 text-kh-ink ${className}`}>
      <div className="mx-auto grid max-w-[1280px] grid-cols-1 gap-12 px-4 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-24 lg:px-12">
        <div className="lg:sticky lg:top-32 lg:self-start">
          <Kicker>{kicker}</Kicker>
          <SplitHeading
            id={`${id}-title`}
            text={title}
            accentClassName="text-kh-ember-deep"
            className="m-0 mt-6 text-[clamp(2.5rem,5vw,4.5rem)] font-light leading-[1.02] tracking-[-0.04em]"
          />
          <Reveal delay={0.1}>
            <p className="m-0 mt-6 max-w-[22rem] text-[17px] leading-relaxed text-kh-body">{intro}</p>
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Accordion.Root type="single" collapsible defaultValue="q0" className="border-b border-kh-line">
            {items.map((f, i) => (
              <Accordion.Item key={f.q} value={`q${i}`} className="border-t border-kh-line">
                <Accordion.Header className="m-0">
                  <Accordion.Trigger className="kh-focus group flex w-full items-center justify-between gap-6 rounded-lg py-6 text-left text-[19px] font-medium tracking-[-0.01em] transition-colors hover:text-kh-ember-deep sm:text-[21px]">
                    {f.q}
                    <span
                      aria-hidden="true"
                      className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-kh-line transition-colors duration-300 group-hover:border-kh-ink group-data-[state=open]:border-kh-ember group-data-[state=open]:bg-kh-ember"
                    >
                      <span className="absolute h-[1.5px] w-3.5 bg-current" />
                      <span className="absolute h-3.5 w-[1.5px] bg-current transition-transform duration-300 group-data-[state=open]:rotate-90 group-data-[state=open]:scale-0" />
                    </span>
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Content className="overflow-hidden data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down">
                  <p className="m-0 max-w-[40rem] pb-7 pr-14 text-[17px] leading-relaxed text-kh-body">{f.a}</p>
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </Reveal>
      </div>
    </section>
  );
}
