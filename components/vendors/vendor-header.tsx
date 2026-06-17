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
        borderBottom: "1px solid rgba(42,38,32,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      <h1
        className="font-dm-serif"
        style={{ fontSize: "22px", color: "#2A2620", letterSpacing: "-0.01em" }}
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
            border: "1px solid rgba(42,38,32,0.15)",
            borderRadius: "40px",
            padding: "8px 18px",
            cursor: "pointer",
            color: "#7A7368",
            fontSize: "13px",
            fontWeight: 500,
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = "#C4724A";
            (e.currentTarget as HTMLElement).style.color = "#F2EEE6";
            (e.currentTarget as HTMLElement).style.borderColor = "#C4724A";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = "#7A7368";
            (e.currentTarget as HTMLElement).style.borderColor =
              "rgba(42,38,32,0.15)";
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
          border: "1px solid rgba(42,38,32,0.15)",
          borderRadius: "40px",
          padding: "6px 14px",
          fontSize: "13px",
          color: "#7A7368",
          cursor: "pointer",
          transition: "all 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.background = "#C4724A";
          (e.currentTarget as HTMLElement).style.color = "#F2EEE6";
          (e.currentTarget as HTMLElement).style.borderColor = "#C4724A";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.background = "transparent";
          (e.currentTarget as HTMLElement).style.color = "#7A7368";
          (e.currentTarget as HTMLElement).style.borderColor =
            "rgba(42,38,32,0.15)";
        }}
      >
        <LogOut style={{ width: 13, height: 13 }} />
        <span className="hidden sm:inline">Sign Out</span>
      </button>
      </div>
    </header>
  );
}
