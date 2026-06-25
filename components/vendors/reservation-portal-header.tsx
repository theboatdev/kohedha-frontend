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
  onMobileMenuToggle?: () => void;
  actions?: React.ReactNode;
}

export function ReservationPortalHeader({
  pageTitle = "Reserve",
  className,
  sidebarOpen = true,
  onToggleSidebar,
  onMobileMenuToggle,
  actions,
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
        position: "sticky",
        top: 0,
        zIndex: 20,
        height: "64px",
        background: "#ffffff",
        borderBottom: "1px solid rgba(13,13,13,0.1)",
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
            color: "#0D0D0D",
          }}
          aria-label="Open navigation menu"
        >
          <Menu style={{ width: 22, height: 22 }} />
        </button>

        <h1
          className="font-poppins"
          style={{
            fontSize: "18px",
            color: "#0D0D0D",
            letterSpacing: "-0.01em",
            fontWeight: 700,
          }}
        >
          {pageTitle}
        </h1>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        {actions}
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
            (e.currentTarget as HTMLElement).style.borderColor = "rgba(13,13,13,0.15)";
          }}
        >
          <LogOut style={{ width: 13, height: 13 }} />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
