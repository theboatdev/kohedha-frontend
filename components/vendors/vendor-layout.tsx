"use client";

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
      <div
        className="md:ml-64"
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <VendorHeader pageTitle={pageTitle} onSignOut={handleSignOut} />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            paddingTop: "64px",
            background: "#F0F0EE",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
