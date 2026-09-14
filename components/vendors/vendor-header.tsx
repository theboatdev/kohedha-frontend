"use client";

import { LogOut, CalendarClock, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface VendorHeaderProps {
  pageTitle?: string;
  onSignOut?: () => void | Promise<void>;
  onMobileMenuToggle?: () => void;
  className?: string;
}

export function VendorHeader({
  pageTitle = "Dashboard",
  onSignOut,
  onMobileMenuToggle,
  className,
}: VendorHeaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    if (onSignOut) {
      setIsLoading(true);
      try {
        await onSignOut();
      } catch (error) {
        console.error("Sign out error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReservationPortal = () => {
    router.push("/vendors/reservation-portal/booking-slots");
  };

  return (
    <header
      className={cn("font-dm-sans", className)}
      style={{
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid #E8E8E4",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 16px",
        flexShrink: 0,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Mobile hamburger — hidden on md+ */}
        <button
          className="md:hidden"
          onClick={onMobileMenuToggle}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "8px",
            color: "#3A3A38",
          }}
          aria-label="Open navigation menu"
        >
          <Menu style={{ width: 22, height: 22 }} />
        </button>

        <h1
          className="font-poppins"
          style={{ fontSize: "18px", fontWeight: 700, color: "#3A3A38", letterSpacing: "-0.02em" }}
        >
          {pageTitle}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <button
          onClick={handleReservationPortal}
          title="Reservation Portal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
            border: "1px solid #E8E8E4",
            borderRadius: "40px",
            padding: "7px 14px",
            cursor: "pointer",
            color: "#8A8A86",
            fontSize: "13px",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#F0F0EE";
            (e.currentTarget as HTMLElement).style.color = "#3A3A38";
            (e.currentTarget as HTMLElement).style.borderColor = "#E8E8E4";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#8A8A86";
            (e.currentTarget as HTMLElement).style.borderColor = "#E8E8E4";
          }}
        >
          <CalendarClock style={{ width: 15, height: 15 }} />
          <span className="hidden sm:inline">Reservations</span>
        </button>

        <button
          onClick={handleSignOut}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "1px solid #E8E8E4",
            borderRadius: "40px",
            padding: "6px 14px",
            fontSize: "13px",
            color: "#8A8A86",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#F0F0EE";
            (e.currentTarget as HTMLElement).style.color = "#3A3A38";
            (e.currentTarget as HTMLElement).style.borderColor = "#E8E8E4";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#8A8A86";
            (e.currentTarget as HTMLElement).style.borderColor = "#E8E8E4";
          }}
        >
          <LogOut style={{ width: 13, height: 13 }} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
