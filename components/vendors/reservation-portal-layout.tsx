"use client";

import { useState } from "react";
import { ReservationPortalSidebar } from "./reservation-portal-sidebar";
import { ReservationPortalHeader } from "./reservation-portal-header";

interface ReservationPortalLayoutProps {
  children: React.ReactNode;
  pageTitle?: string;
}

export function ReservationPortalLayout({
  children,
  pageTitle = "Reserve",
}: ReservationPortalLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

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
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          overflow: "hidden",
          marginLeft: sidebarOpen ? "192px" : "56px",
          transition: "margin-left 0.25s ease",
        }}
      >
        <ReservationPortalHeader
          pageTitle={pageTitle}
          sidebarOpen={sidebarOpen}
          onToggleSidebar={toggleSidebar}
        />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            paddingTop: "64px",
            background: "#F5F5F5",
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
