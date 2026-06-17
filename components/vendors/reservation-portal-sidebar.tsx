"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  LayoutGrid,
  Settings,
  ArrowLeft,
  Clock,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ReservationPortalSidebarProps {
  className?: string;
  onCollapse: () => void;
  isCollapsed?: boolean;
}

const menuItems = [
  {
    title: "Booking Slots",
    icon: Clock,
    href: "/vendors/reservation-portal/booking-slots",
  },
  {
    title: "Guest List",
    icon: Users,
    href: "/vendors/reservation-portal/guest-list",
  },
  {
    title: "Arrangements",
    icon: LayoutGrid,
    href: "/vendors/reservation-portal/arrangements",
  },
  {
    title: "Settings",
    icon: Settings,
    href: "/vendors/reservation-portal/settings",
  },
];

export function ReservationPortalSidebar({
  className,
  onCollapse,
  isCollapsed = false,
}: ReservationPortalSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleBackToDashboard = () => {
    router.push("/vendors/dashboard");
  };

  return (
    <div
      className={cn("flex h-full w-full flex-col font-dm-sans", className)}
      style={{
        background: "#1E1B17",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: isCollapsed ? "center" : "space-between",
          minHeight: "64px",
        }}
      >
        {/* Logo text — hidden when collapsed */}
        <div
          style={{
            opacity: isCollapsed ? 0 : 1,
            maxWidth: isCollapsed ? "0" : "120px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            transition: "opacity 0.2s ease, max-width 0.25s ease",
          }}
        >
          <div
            className="font-dm-serif"
            style={{
              fontSize: "16px",
              color: "white",
              letterSpacing: "-0.01em",
            }}
          >
            kohedha<span style={{ color: "#C4724A" }}>.</span>
          </div>
          <div
            style={{
              fontSize: "10px",
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              marginTop: "2px",
            }}
          >
            Reservations
          </div>
        </div>

        {/* Burger toggle button */}
        <button
          onClick={onCollapse}
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            padding: "6px",
            borderRadius: "6px",
            color: "rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background =
              "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLElement).style.color = "white";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color =
              "rgba(255,255,255,0.4)";
          }}
        >
          <Menu style={{ width: 16, height: 16 }} />
        </button>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          }}
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href || pathname?.startsWith(item.href + "/");

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  title={isCollapsed ? item.title : undefined}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: isCollapsed ? "center" : "flex-start",
                    gap: isCollapsed ? "0" : "8px",
                    padding: isCollapsed ? "9px 0" : "9px 12px",
                    borderRadius: "8px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    background: isActive ? "#C4724A" : "transparent",
                    color: isActive ? "white" : "rgba(255,255,255,0.5)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background =
                        "rgba(255,255,255,0.06)";
                      (e.currentTarget as HTMLElement).style.color = "white";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      (e.currentTarget as HTMLElement).style.background =
                        "transparent";
                      (e.currentTarget as HTMLElement).style.color =
                        "rgba(255,255,255,0.5)";
                    }
                  }}
                >
                  <Icon style={{ width: 14, height: 14, flexShrink: 0 }} />
                  <span
                    style={{
                      opacity: isCollapsed ? 0 : 1,
                      maxWidth: isCollapsed ? "0" : "140px",
                      overflow: "hidden",
                      whiteSpace: "nowrap",
                      transition: "opacity 0.2s ease, max-width 0.25s ease",
                    }}
                  >
                    {item.title}
                  </span>
                </Link>
              </li>
            );
          })}

          <li
            style={{
              borderTop: "1px solid rgba(255,255,255,0.06)",
              marginTop: "8px",
              paddingTop: "8px",
            }}
          >
            <button
              onClick={handleBackToDashboard}
              title={isCollapsed ? "Back to Dashboard" : undefined}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                gap: isCollapsed ? "0" : "8px",
                padding: isCollapsed ? "9px 0" : "9px 12px",
                borderRadius: "8px",
                width: "100%",
                fontSize: "13px",
                fontWeight: 400,
                cursor: "pointer",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                transition: "all 0.15s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "rgba(255,255,255,0.06)";
                (e.currentTarget as HTMLElement).style.color = "white";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background =
                  "transparent";
                (e.currentTarget as HTMLElement).style.color =
                  "rgba(255,255,255,0.4)";
              }}
            >
              <ArrowLeft style={{ width: 14, height: 14, flexShrink: 0 }} />
              <span
                style={{
                  opacity: isCollapsed ? 0 : 1,
                  maxWidth: isCollapsed ? "0" : "140px",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  transition: "opacity 0.2s ease, max-width 0.25s ease",
                }}
              >
                Back to Dashboard
              </span>
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}
