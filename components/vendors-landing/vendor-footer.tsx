import Link from "next/link";
import { Wordmark } from "@/components/brand/primitives";

const LINKS = [
  { label: "For diners", href: "/" },
  { label: "List your venue", href: "/vendors/register" },
  { label: "Venue login", href: "/vendors/login" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function VendorFooter() {
  return (
    <footer className="relative overflow-hidden bg-kh-night font-kh text-kh-cream">
      <div className="mx-auto max-w-[1280px] px-4 pt-16 sm:px-8 sm:pt-20 lg:px-12">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex items-end gap-2.5">
              <Wordmark className="text-[34px]" />
              <span className="pb-1 text-[15px] text-kh-mist">for venues</span>
            </div>
            <p className="m-0 mt-3 text-[15px] text-kh-mist">Made for Sri Lanka&apos;s nights out.</p>
          </div>
          <nav aria-label="Footer">
            <ul className="m-0 grid list-none grid-cols-2 gap-x-10 gap-y-3 p-0 sm:flex sm:flex-wrap sm:gap-x-9">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="kh-focus kh-link rounded text-[15px] text-kh-cream/85 hover:text-kh-cream">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="mt-14 border-t border-white/10 py-7 text-[13px] text-kh-mist">
          © {new Date().getFullYear()} kohedha (Pvt) Ltd · Built by theBOAT Solutions Studio
        </div>
      </div>
      <div aria-hidden="true" className="pointer-events-none -mb-[4vw] select-none px-2 sm:px-4">
        <Wordmark
          className="w-full justify-center bg-gradient-to-b from-kh-cream/[0.14] to-transparent bg-clip-text text-[19vw] text-transparent"
          dotClassName="bg-kh-ember/20"
        />
      </div>
    </footer>
  );
}
