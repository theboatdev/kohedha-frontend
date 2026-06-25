"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  UtensilsCrossed,
  CalendarDays,
  Tag,
  LayoutDashboard,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface VendorSidebarProps {
  className?: string;
}

const menuItems = [
  { title: "Dashboard", icon: LayoutDashboard, href: "/vendors/dashboard" },
  { title: "Venue Details", icon: Building2, href: "/vendors/venue-details" },
  { title: "Menu Details", icon: UtensilsCrossed, href: "/vendors/menu" },
  { title: "Manage Events", icon: CalendarDays, href: "/vendors/events" },
  { title: "Manage Deals", icon: Tag, href: "/vendors/deals" },
];

export function VendorSidebar({ className }: VendorSidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn("flex h-full w-full flex-col font-dm-sans", className)}
      style={{
        background: "#0D0D0D",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="font-poppins"
          style={{ fontSize: "22px", fontWeight: 700, color: "white", letterSpacing: "-0.02em" }}
        >
          kohedha<span style={{ color: "#C8281A" }}>.</span>
        </div>
        <div
          style={{
            fontSize: "10px",
            color: "rgba(255,255,255,0.35)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginTop: "2px",
          }}
        >
          Vendor Portal
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "16px 10px" }}>
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
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    padding: "10px 14px",
                    borderRadius: "10px",
                    fontSize: "13px",
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    background: isActive ? "#F5E642" : "transparent",
                    color: isActive ? "#0D0D0D" : "rgba(255,255,255,0.55)",
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
                        "rgba(255,255,255,0.55)";
                    }
                  }}
                >
                  <Icon style={{ width: 16, height: 16, flexShrink: 0 }} />
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom branding */}
      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.2)" }}>
          kohedha.lk
        </div>
      </div>
    </div>
  );
}
