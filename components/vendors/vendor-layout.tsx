"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { VendorSidebar } from "./vendor-sidebar";
import { VendorHeader } from "./vendor-header";
import { signOutVendor } from "@/lib/auth";

interface VendorLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  onSignOut?: () => void;
}

export function VendorLayout({
  children,
  pageTitle = "Dashboard",
  onSignOut,
}: VendorLayoutProps) {
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const defaultSignOut = async () => {
    try {
      await signOutVendor();
    } catch {
      // ignore errors, proceed to redirect
    }
    router.push("/vendors/login");
  };

  const handleSignOut = onSignOut ?? defaultSignOut;

  return (
    <div
      className="font-dm-sans"
      style={{
        display: "flex",
        height: "100vh",
        width: "100%",
        overflow: "hidden",
      }}
    >
      {/* Desktop sidebar — fixed, hidden on mobile */}
      <div
        style={{
          position: "fixed",
          inset: "0 auto 0 0",
          zIndex: 10,
          width: "256px",
        }}
        className="hidden md:block"
      >
        <VendorSidebar />
      </div>

      {/* Mobile sidebar overlay drawer */}
      {mobileNavOpen && (
        <div
          className="md:hidden"
          style={{ position: "fixed", inset: 0, zIndex: 40, display: "flex" }}
        >
          <div
            style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.5)" }}
            onClick={() => setMobileNavOpen(false)}
          />
          <div style={{ position: "relative", width: "256px", height: "100%", flexShrink: 0, zIndex: 1 }}>
            <VendorSidebar onLinkClick={() => setMobileNavOpen(false)} />
          </div>
        </div>
      )}

      {/* Content column — offset by sidebar on desktop */}
      <div
        className="md:ml-64"
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <VendorHeader
          pageTitle={pageTitle}
          onSignOut={handleSignOut}
          onMobileMenuToggle={() => setMobileNavOpen((prev) => !prev)}
        />
        <main style={{ flex: 1, overflowY: "auto", background: "#F0F0EE" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
