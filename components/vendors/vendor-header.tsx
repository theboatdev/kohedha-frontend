"use client";

import { LogOut, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface VendorHeaderProps {
  pageTitle?: string;
  onSignOut?: () => void | Promise<void>;
  className?: string;
}

export function VendorHeader({
  pageTitle = "Dashboard",
  onSignOut,
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
      className={cn("font-dm-sans left-0 md:left-64", className)}
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        zIndex: 20,
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid rgba(13,13,13,0.09)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <h1
        className="font-poppins"
        style={{ fontSize: "20px", fontWeight: 700, color: "#0D0D0D", letterSpacing: "-0.02em" }}
      >
        {pageTitle}
      </h1>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <button
          onClick={handleReservationPortal}
          title="Reservation Portal"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            background: "transparent",
          border: "1px solid rgba(13,13,13,0.15)",
          borderRadius: "40px",
          padding: "8px 18px",
          cursor: "pointer",
          color: "rgba(13,13,13,0.48)",
          fontSize: "13px",
          fontWeight: 500,
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F5E642";
          (e.currentTarget as HTMLElement).style.color = "#0D0D0D";
          (e.currentTarget as HTMLElement).style.borderColor = "#F5E642";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "rgba(13,13,13,0.48)";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(13,13,13,0.15)";
        }}
        >
          <CalendarClock style={{ width: 15, height: 15 }} />
          <span>Reservations</span>
        </button>

        <button
        onClick={handleSignOut}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "transparent",
          border: "1px solid rgba(13,13,13,0.15)",
          borderRadius: "40px",
          padding: "6px 14px",
          fontSize: "13px",
          color: "rgba(13,13,13,0.48)",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#F5E642";
          (e.currentTarget as HTMLElement).style.color = "#0D0D0D";
          (e.currentTarget as HTMLElement).style.borderColor = "#F5E642";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "rgba(13,13,13,0.48)";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(13,13,13,0.15)";
        }}
      >
        <LogOut style={{ width: 13, height: 13 }} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
      </div>
    </header>
  );
}
