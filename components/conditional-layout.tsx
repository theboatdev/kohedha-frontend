"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVendorRoute = pathname?.startsWith("/vendors");
  const isWaitListRoute = pathname?.startsWith("/wait-list");
  const showPublicChrome = !isVendorRoute && !isWaitListRoute;

  return (
    <>
      {showPublicChrome && <Navigation />}
      {children}
      {showPublicChrome && <Footer />}
    </>
  );
}
