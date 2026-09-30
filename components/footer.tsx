import Link from "next/link";
import { StoreBadges, Wordmark } from "@/components/brand/primitives";

const COLUMNS = [
  {
    title: "Discover",
    links: [
      { label: "The Beacon", href: "/#beacon" },
      { label: "Browse by vibe", href: "/#explore" },
      { label: "Places", href: "/places" },
      { label: "Events", href: "/events" },
      { label: "Deals", href: "/deals" },
    ],
  },
  {
    title: "Venues",
    links: [
      { label: "For venues", href: "/vendors" },
      { label: "List your venue", href: "/vendors/register" },
      { label: "Venue login", href: "/vendors/login" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "/blog" },
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden bg-kh-night font-kh text-kh-cream">
      <div className="mx-auto max-w-[1280px] px-4 pt-20 sm:px-8 sm:pt-28 lg:px-12">
        <div className="grid grid-cols-1 gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-24">
          <div>
            <p className="m-0 max-w-[14ch] text-[clamp(2.25rem,4.4vw,3.75rem)] font-light leading-[1.05] tracking-[-0.04em]">
              Your city&apos;s already out.{" "}
              <span className="text-kh-ember">Join it.</span>
            </p>
            <StoreBadges className="mt-9" />
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 sm:gap-16">
            {COLUMNS.map((c) => (
              <div key={c.title}>
                <p className="m-0 text-[13px] font-medium uppercase tracking-[0.12em] text-kh-mist">{c.title}</p>
                <ul className="m-0 mt-5 flex list-none flex-col gap-3 p-0">
                  {c.links.map((l) => (
                    <li key={l.label}>
                      <Link href={l.href} className="kh-focus kh-link rounded text-[15px] text-kh-cream/85 hover:text-kh-cream">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-3 border-t border-white/10 py-7 text-[13px] text-kh-mist sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} kohedha (Pvt) Ltd · Greater Colombo, Sri Lanka</span>
          <span>Built by theBOAT Solutions Studio</span>
        </div>
      </div>

      <div aria-hidden="true" className="pointer-events-none -mb-[4vw] select-none px-2 sm:px-4">
        <Wordmark className="w-full justify-center bg-gradient-to-b from-kh-cream/[0.14] to-transparent bg-clip-text text-[19vw] text-transparent" dotClassName="bg-kh-ember/20" />
      </div>
    </footer>
  );
}
