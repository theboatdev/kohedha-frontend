"use client";

import { useState } from "react";
import { ReservationPortalSidebar } from "./reservation-portal-sidebar";
import { ReservationPortalHeader } from "./reservation-portal-header";

interface ReservationPortalLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
  headerActions?: React.ReactNode;
}

export function ReservationPortalLayout({
  children,
  pageTitle = "Reserve",
  headerActions,
}: ReservationPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  // Full Tailwind class strings for purger
  const contentMargin = sidebarOpen ? "md:ml-48" : "md:ml-14";

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
          width: sidebarOpen ? "192px" : "56px",
          transition: "width 0.25s ease",
          overflow: "hidden",
        }}
        className="hidden md:block"
      >
        <ReservationPortalSidebar
          onCollapse={toggleSidebar}
          isCollapsed={!sidebarOpen}
        />
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
          <div style={{ position: "relative", width: "220px", height: "100%", flexShrink: 0, zIndex: 1 }}>
            <ReservationPortalSidebar
              onCollapse={() => setMobileNavOpen(false)}
              isCollapsed={false}
              onLinkClick={() => setMobileNavOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Content column — offset by sidebar on desktop */}
      <div
        className={`${contentMargin} transition-[margin-left] duration-[250ms]`}
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <ReservationPortalHeader
          pageTitle={pageTitle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
          onMobileMenuToggle={() => setMobileNavOpen((prev) => !prev)}
          actions={headerActions}
        />
        <main style={{ flex: 1, overflowY: "auto", background: "#F0F0EE" }}>
          {children}
        </main>
      </div>
    </div>
  );
}
