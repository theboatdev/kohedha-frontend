"use client";

import { cn } from "@/lib/utils";
import { LogOut, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface ReservationPortalHeaderProps {
  pageTitle?: string;
  className?: string;
  sidebarOpen?: boolean;
  onToggleSidebar?: () => void;
}

export function ReservationPortalHeader({
  pageTitle = "Reserve",
  className,
  sidebarOpen = true,
  onToggleSidebar,
}: ReservationPortalHeaderProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("auth_token");
      toast({
        title: "Success",
        description: "You have been signed out",
        variant: "default",
      });
      router.push("/vendors/login");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <header
      className={cn("font-dm-sans", className)}
      style={{
        position: "fixed",
        top: 0,
        left: sidebarOpen ? "192px" : "56px",
        right: 0,
        zIndex: 20,
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid rgba(42,38,32,0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        transition: "left 0.25s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <h1
          className="font-dm-serif"
          style={{
            fontSize: "20px",
            color: "#2A2620",
            letterSpacing: "-0.01em",
          }}
        >
          {pageTitle}
        </h1>
      </div>

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
    </header>
  );
}
