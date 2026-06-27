"use client";

import { usePathname } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isVendorRoute = pathname?.startsWith("/vendors");
  const isWaitListRoute = pathname?.startsWith("/wait-list");
  const isStudioRoute = pathname?.startsWith("/studio");
  const showPublicChrome = !isVendorRoute && !isWaitListRoute;
  const isPublicBrand = !isVendorRoute && !isStudioRoute;

  return (
    <div className={isPublicBrand ? "public-brand" : undefined}>
      {showPublicChrome && <Navigation />}
      {children}
      {showPublicChrome && <Footer />}
    </div>
  );
}
