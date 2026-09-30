"use client";

import * as Dialog from "@radix-ui/react-dialog";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type MouseEvent } from "react";
import { ArrowRight, EASE_OUT, StoreBadges, Wordmark, cx } from "@/components/brand/primitives";
import { scrollToSection, useScrollSpy } from "@/components/brand/section-nav";

// Sections of the homepage. Elsewhere on the site these link back to the homepage section.
const SECTIONS = [
  { id: "beacon", label: "How it works" },
  { id: "explore", label: "Browse by vibe" },
  { id: "features", label: "Features" },
  { id: "faq", label: "FAQ" },
];
const SECTION_IDS = SECTIONS.map((s) => s.id);

export function Navigation() {
  const pathname = usePathname() ?? "/";
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hovered, setHovered] = useState<string | null>(null);
  const { scrollY } = useScroll();

  // Tuck the bar away while reading down the page; bring it back on any scroll up.
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 12);
    setHidden(y > 240 && y > prev + 2);
  });

  useEffect(() => setOpen(false), [pathname]);

  const onHome = pathname === "/";
  const active = useScrollSpy(SECTION_IDS, onHome);

  // Arriving from another page via "/#features" etc.: the route shows app/loading.tsx first, so the
  // section isn't in the DOM yet and nothing scrolls to it. Wait for it to mount, then scroll.
  useEffect(() => {
    if (!onHome) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    let tries = 0;
    let timer = 0;
    const attempt = () => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView();
      else if (++tries < 50) timer = window.setTimeout(attempt, 100);
    };
    attempt();
    return () => window.clearTimeout(timer);
  }, [onHome]);

  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);

  // On the homepage, section links scroll in place; the menu locks scrolling, so close it first.
  const jump = (e: MouseEvent<HTMLAnchorElement>, id: string) => {
    const wasOpen = open;
    setOpen(false);
    if (!onHome) return;
    e.preventDefault();
    scrollToSection(id, { reduce: !!reduce, delay: wasOpen ? 450 : 0 });
  };

  return (
    <MotionConfig reducedMotion="user">
      <motion.header
        className="sticky top-0 z-50 flex h-[84px] items-center px-3 font-kh text-kh-ink sm:px-5"
        animate={{ y: hidden && !open ? -110 : 0 }}
        transition={{ duration: 0.4, ease: EASE_OUT }}
      >
        <a
          href="#main-content"
          className="kh-focus sr-only rounded-full bg-kh-ink px-4 py-2 text-[14px] text-kh-cream focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60]"
        >
          Skip to content
        </a>

        <div
          className={cx(
            "mx-auto flex h-[60px] w-full max-w-[1280px] items-center justify-between rounded-full border pl-5 pr-2 transition-[background-color,box-shadow,border-color] duration-500 sm:pl-6",
            scrolled
              ? "border-black/[0.06] bg-kh-cream/85 shadow-[0_12px_40px_-14px_rgba(26,26,26,0.3)] backdrop-blur-xl"
              : "border-white/30 bg-kh-cream/75 backdrop-blur-md",
          )}
        >
          <Link href="/" onClick={(e) => jump(e, "top")} aria-label="kohedha home" className="kh-focus rounded-lg">
            <Wordmark className="text-[26px]" dotClassName="kh-live" />
          </Link>

          <nav aria-label="Main" className="hidden lg:block">
            <ul className="m-0 flex list-none items-center gap-1 p-0" onPointerLeave={() => setHovered(null)}>
              {SECTIONS.map((l) => {
                const current = active === l.id;
                return (
                  <li key={l.id}>
                    <Link
                      href={hrefFor(l.id)}
                      onClick={(e) => jump(e, l.id)}
                      aria-current={current ? "location" : undefined}
                      onPointerEnter={() => setHovered(l.id)}
                      className={cx(
                        "kh-focus relative flex h-10 items-center rounded-full px-4 text-[15px] transition-colors",
                        current ? "font-medium text-kh-ink" : "text-kh-body hover:text-kh-ink",
                      )}
                    >
                      {hovered === l.id && (
                        <motion.span
                          layoutId="nav-hover"
                          className="absolute inset-0 rounded-full bg-kh-ink/[0.06]"
                          transition={{ type: "spring", stiffness: 500, damping: 38 }}
                        />
                      )}
                      <span className="relative">{l.label}</span>
                      {current && (
                        <motion.span
                          layoutId="nav-current"
                          aria-hidden="true"
                          className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 bg-kh-ember"
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/vendors"
              className="kh-focus hidden h-11 items-center rounded-full px-4 text-[15px] text-kh-body transition-colors hover:text-kh-ink xl:flex"
            >
              For venues
            </Link>
            <Link
              href={hrefFor("app")}
              onClick={(e) => jump(e, "app")}
              className="kh-focus group hidden h-11 items-center gap-2 rounded-full bg-kh-ink pl-5 pr-4 text-[15px] font-medium text-kh-cream transition-colors hover:bg-black sm:flex"
            >
              Get the app
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" />
            </Link>

            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="kh-focus flex h-11 w-11 flex-col items-center justify-center gap-[5px] rounded-full bg-kh-ink lg:hidden"
                >
                  <span className="block h-[1.5px] w-[18px] bg-kh-cream" />
                  <span className="block h-[1.5px] w-[18px] bg-kh-cream" />
                </button>
              </Dialog.Trigger>

              <AnimatePresence>
                {open && (
                  <Dialog.Portal forceMount>
                    <Dialog.Content asChild forceMount aria-describedby={undefined}>
                      <motion.div
                        className="fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-kh-night font-kh text-kh-cream outline-none"
                        initial={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 42px) 42px)" }}
                        animate={reduce ? { opacity: 1 } : { clipPath: "circle(150% at calc(100% - 42px) 42px)" }}
                        exit={reduce ? { opacity: 0 } : { clipPath: "circle(0% at calc(100% - 42px) 42px)" }}
                        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
                      >
                        <Dialog.Title className="sr-only">Menu</Dialog.Title>
                        <div className="flex h-[84px] shrink-0 items-center justify-between px-8 sm:px-11">
                          <Wordmark className="text-[26px]" />
                          <Dialog.Close asChild>
                            <button
                              type="button"
                              aria-label="Close menu"
                              className="kh-focus relative flex h-11 w-11 items-center justify-center rounded-full bg-kh-cream text-kh-ink"
                            >
                              <span className="absolute block h-[1.5px] w-[18px] rotate-45 bg-current" />
                              <span className="absolute block h-[1.5px] w-[18px] -rotate-45 bg-current" />
                            </button>
                          </Dialog.Close>
                        </div>

                        <nav aria-label="Main" className="flex-1 px-8 pt-6 sm:px-11">
                          <ul className="m-0 flex list-none flex-col p-0">
                            {[
                              ...SECTIONS.map((s) => ({ ...s, href: hrefFor(s.id) })),
                              { id: "app", label: "Get the app", href: hrefFor("app") },
                              { id: "vendors", label: "For venues", href: "/vendors" },
                            ].map((l, i) => (
                              <motion.li
                                key={l.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.18 + i * 0.05 }}
                                className="border-b border-white/10"
                              >
                                <Link
                                  href={l.href}
                                  onClick={(e) => (l.id === "vendors" ? setOpen(false) : jump(e, l.id))}
                                  aria-current={active === l.id ? "location" : undefined}
                                  className="kh-focus group flex items-center justify-between py-4 text-[clamp(2rem,9vw,3rem)] font-light tracking-[-0.03em]"
                                >
                                  <span className="flex items-baseline gap-4">
                                    <span className="text-[13px] tabular-nums tracking-normal text-kh-mist">0{i + 1}</span>
                                    {l.label}
                                  </span>
                                  {active === l.id ? (
                                    <span aria-hidden="true" className="h-2.5 w-2.5 bg-kh-ember" />
                                  ) : (
                                    <ArrowRight className="h-6 w-6 text-kh-mist transition-transform group-hover:translate-x-1" />
                                  )}
                                </Link>
                              </motion.li>
                            ))}
                          </ul>
                        </nav>

                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                          className="px-8 pb-10 pt-10 sm:px-11"
                        >
                          <p className="m-0 mb-4 text-[14px] text-kh-mist">Cast Beacons from the app. It&apos;s free.</p>
                          <StoreBadges />
                        </motion.div>
                      </motion.div>
                    </Dialog.Content>
                  </Dialog.Portal>
                )}
              </AnimatePresence>
            </Dialog.Root>
          </div>
        </div>
      </motion.header>
    </MotionConfig>
  );
}
