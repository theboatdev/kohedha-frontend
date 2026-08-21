"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  TrendingUp,
  Calendar,
  CalendarCheck,
  Star,
  Heart,
  Clock,
  ArrowRight,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";
import { VendorLayout } from "@/components/vendors/vendor-layout";
import { signOutVendor } from "@/lib/auth";
import {
  getDashboardAnalytics,
  type DashboardAnalytics,
} from "@/lib/dashboard";
import { getMenuVoteSummary, type MenuVoteItem } from "@/lib/menu";

const C = {
  bg: "#F6F6F4",
  bg2: "#F0F0EE",
  text: "#3A3A38",
  muted: "#8A8A86",
  cream: "#ffffff",
  border: "#E8E8E4",
};

export default function VendorDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardAnalytics | null>(
    null,
  );
  const [topUpvotedItems, setTopUpvotedItems] = useState<MenuVoteItem[]>([]);

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      localStorage.setItem("auth_token", token);
      router.replace("/vendors/dashboard");
    }
  }, [searchParams, router]);

  // Fetch dashboard analytics
  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      setError(null);

      const result = await getDashboardAnalytics();

      if (result.success && result.data) {
        setDashboardData(result.data);
      } else {
        setError(result.error || "Failed to load dashboard data");
      }

      setIsLoading(false);
    };

    const fetchTopUpvotedItems = async () => {
      const result = await getMenuVoteSummary({ sortBy: "upvotes" });
      if (result.success && result.data) {
        setTopUpvotedItems(result.data.items.slice(0, 5));
      }
    };

    fetchDashboard();
    fetchTopUpvotedItems();
  }, []);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOutVendor();
      router.push("/vendors/login");
    } catch (error) {
      console.error("Sign out error:", error);
      router.push("/vendors/login");
    } finally {
      setIsSigningOut(false);
    }
  };

  const stats = [
    {
      icon: TrendingUp,
      value: dashboardData?.stats.activeDeals ?? 0,
      label: "Active Deals",
      sub: "Currently visible on Kohedha",
      iconBg: "#F0F0EE",
      iconColor: "#3A3A38",
    },
    {
      icon: Calendar,
      value: dashboardData?.stats.upcomingEvents ?? 0,
      label: "Upcoming Events",
      sub: "In the next 30 days",
      iconBg: "#F6F6F4",
      iconColor: C.text,
    },
    {
      icon: CalendarCheck,
      value: dashboardData?.stats.monthlyReservations ?? 0,
      label: "Reservation Analytics",
      sub: `${dashboardData?.stats.monthlyReservations ?? 0} monthly • ${dashboardData?.stats.ongoingReservations ?? 0} ongoing`,
      iconBg: "rgba(99,102,241,0.08)",
      iconColor: "#6366F1",
    },
    {
      icon: ThumbsUp,
      value: (dashboardData?.stats.totalMenuUpvotes ?? 0).toLocaleString(),
      label: "Total Menu Upvotes",
      sub: "Customer favorites across all items",
      iconBg: "rgba(34,197,94,0.08)",
      iconColor: "#22C55E",
    },
  ];

  const quickActions = [
    { label: "Update Venue Details", href: "/vendors/venue-details" },
    { label: "Manage Reservations", href: "/vendors/reservations" },
    { label: "Manage Deals", href: "/vendors/deals" },
    { label: "Manage Events", href: "/vendors/events" },
  ];

  return (
    <VendorLayout onSignOut={handleSignOut} pageTitle="Dashboard">
      <div
        className="font-dm-sans px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-8"
        style={{ maxWidth: "1200px", margin: "0 auto" }}
      >
        {/* Loading State */}
        {isLoading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "400px",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "40px",
                  height: "40px",
                  border: "3px solid #E8E8E4",
                  borderTopColor: "#C8C8C4",
                  borderRadius: "50%",
                  animation: "spin 1s linear infinite",
                  margin: "0 auto 16px",
                }}
              />
              <p style={{ color: C.muted, fontSize: "14px" }}>
                Loading dashboard...
              </p>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && !isLoading && (
          <div
            style={{
              background: "rgba(229,57,53,0.08)",
              border: "1px solid rgba(229,57,53,0.2)",
              borderRadius: "12px",
              padding: "20px",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <AlertCircle style={{ width: 20, height: 20, color: "#E53935" }} />
            <div>
              <p style={{ fontSize: "14px", fontWeight: 600, color: C.text }}>
                Failed to load dashboard
              </p>
              <p style={{ fontSize: "13px", color: C.muted, marginTop: "4px" }}>
                {error}
              </p>
            </div>
          </div>
        )}

        {/* Dashboard Content */}
        {!isLoading && dashboardData && (
          <>
            {/* Stats */}
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
            >
              {stats.map(
                ({ icon: Icon, value, label, sub, iconBg, iconColor }) => (
                  <div
                    key={label}
                    style={{
                      background: C.cream,
                      borderRadius: "16px",
                      padding: "24px",
                      border: `1px solid ${C.border}`,
                    }}
                  >
                    <div
                      style={{
                        width: "40px",
                        height: "40px",
                        borderRadius: "10px",
                        background: iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: "16px",
                      }}
                    >
                      <Icon
                        style={{ width: 18, height: 18, color: iconColor }}
                      />
                    </div>
                    <p
                  className="font-poppins text-[32px] sm:text-[40px]"
                    style={{
                      fontWeight: 800,
                      color: C.text,
                      lineHeight: 1,
                      marginBottom: "6px",
                    }}
                  >
                      {value}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        fontWeight: 500,
                        color: C.text,
                        marginBottom: "2px",
                      }}
                    >
                      {label}
                    </p>
                    <p style={{ fontSize: "12px", color: C.muted }}>{sub}</p>
                  </div>
                ),
              )}
            </div>

            {/* Main grid */}
            <div
              className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4"
            >
              {/* Venue Performance */}
              <div
                style={{
                  background: C.cream,
                  borderRadius: "16px",
                  border: `1px solid ${C.border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "24px 28px",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="font-poppins"
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    Venue Performance
                  </h2>
                  <p style={{ fontSize: "13px", color: C.muted }}>
                    Overview of how your venue is performing on Kohedha
                  </p>
                </div>
                <div
                  style={{
                    padding: "24px 28px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "0",
                  }}
                >
                  {[
                    {
                      icon: Star,
                      iconBg: "#F0F0EE",
                      iconColor: "#8A8A86",
                      label: "Average Rating",
                      sub: "Based on customer reviews",
                      value: dashboardData?.performance.averageRating
                        ? `${dashboardData.performance.averageRating} / 5`
                        : "N/A",
                    },
                    {
                      icon: Heart,
                      iconBg: "rgba(229,57,53,0.08)",
                      iconColor: "#E53935",
                      label: "Saved by Users",
                      sub: "Total favorites count",
                      value:
                        dashboardData?.performance.savedByUsers?.toString() ??
                        "0",
                    },
                    {
                      icon: Clock,
                      iconBg: "rgba(99,102,241,0.08)",
                      iconColor: "#6366F1",
                      label: "Peak Hours",
                      sub: "Most popular visiting times",
                      value: dashboardData?.performance.peakHours ?? "N/A",
                    },
                  ].map(
                    (
                      { icon: Icon, iconBg, iconColor, label, sub, value },
                      i,
                    ) => (
                      <div key={label}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "14px",
                            }}
                          >
                            <div
                              style={{
                                width: "36px",
                                height: "36px",
                                borderRadius: "10px",
                                background: iconBg,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Icon
                                style={{
                                  width: 16,
                                  height: 16,
                                  color: iconColor,
                                }}
                              />
                            </div>
                            <div>
                              <p
                                style={{
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: C.text,
                                }}
                              >
                                {label}
                              </p>
                              <p style={{ fontSize: "12px", color: C.muted }}>
                                {sub}
                              </p>
                            </div>
                          </div>
                          <span
                            style={{
                              fontWeight: 700,
                              fontSize: "16px",
                              color: C.text,
                            }}
                          >
                            {value}
                          </span>
                        </div>
                        {i < 2 && (
                          <div
                            style={{
                              height: "1px",
                              background: C.border,
                            }}
                          />
                        )}
                      </div>
                    ),
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div
                style={{
                  background: C.cream,
                  borderRadius: "16px",
                  border: `1px solid ${C.border}`,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    padding: "24px 28px",
                    borderBottom: `1px solid ${C.border}`,
                  }}
                >
                  <h2
                    className="font-poppins"
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    Quick Actions
                  </h2>
                  <p style={{ fontSize: "13px", color: C.muted }}>
                    Common tasks and shortcuts
                  </p>
                </div>
                <div
                  style={{
                    padding: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                  }}
                >
                  {quickActions.map(({ label, href }) => (
                    <Link
                      key={label}
                      href={href}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "14px 16px",
                        borderRadius: "12px",
                        border: `1px solid ${C.border}`,
                        textDecoration: "none",
                        fontSize: "13px",
                        fontWeight: 500,
                        color: C.text,
                        background: "transparent",
                        transition: "all 0.15s",
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          C.bg2;
                        (e.currentTarget as HTMLElement).style.borderColor =
                          C.border;
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background =
                          "transparent";
                        (e.currentTarget as HTMLElement).style.borderColor =
                          C.border;
                      }}
                    >
                      {label}
                      <ArrowRight
                        style={{ width: 14, height: 14, color: C.muted }}
                      />
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Upvoted Menu Items */}
            <div
              style={{
                marginTop: "20px",
                background: C.cream,
                borderRadius: "16px",
                border: `1px solid ${C.border}`,
                overflow: "hidden",
              }}
            >
              <div
                className="flex flex-wrap items-center justify-between gap-2"
                style={{
                  padding: "20px 24px",
                  borderBottom: `1px solid ${C.border}`,
                }}
              >
                <div>
                  <h2
                    className="font-poppins"
                    style={{
                      fontSize: "18px",
                      fontWeight: 700,
                      color: C.text,
                      marginBottom: "4px",
                    }}
                  >
                    Top Upvoted Menu Items
                  </h2>
                  <p style={{ fontSize: "13px", color: C.muted }}>
                    Customer favorites based on upvotes
                  </p>
                </div>
                <Link
                  href="/vendors/menu"
                  style={{
                    fontSize: "13px",
                    fontWeight: 500,
                    color: C.text,
                    textDecoration: "underline",
                    textUnderlineOffset: "2px",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "0.7";
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.opacity = "1";
                  }}
                >
                  View All Menu
                  <ArrowRight style={{ width: 14, height: 14 }} />
                </Link>
              </div>
              <div style={{ padding: "8px 28px 24px" }}>
                {topUpvotedItems.length === 0 ? (
                  <p
                    style={{
                      fontSize: "13px",
                      color: C.muted,
                      padding: "16px 0",
                      textAlign: "center",
                    }}
                  >
                    No upvotes yet. Once customers vote on your dishes,
                    they&apos;ll show up here.
                  </p>
                ) : (
                  <div
                    style={{ display: "flex", flexDirection: "column", gap: "0" }}
                  >
                    {topUpvotedItems.map((item, index) => (
                      <div key={item._id}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "16px 0",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                              flex: 1,
                            }}
                          >
                            <div
                              style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "8px",
                                background: index === 0 ? "#F0F0EE" : "#F6F6F4",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "14px",
                                fontWeight: 700,
                                color: index === 0 ? C.text : C.muted,
                              }}
                            >
                              {index + 1}
                            </div>
                            <div style={{ flex: 1 }}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 600,
                                  color: C.text,
                                  marginBottom: "2px",
                                }}
                              >
                                {item.name}
                              </p>
                              <p style={{ fontSize: "12px", color: C.muted }}>
                                {item.category}
                              </p>
                            </div>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "16px",
                            }}
                          >
                            <div
                              style={{
                                padding: "4px 10px",
                                borderRadius: "20px",
                                background:
                                  item.netVotes >= 0
                                    ? "rgba(34,197,94,0.08)"
                                    : "rgba(220,38,38,0.08)",
                                fontSize: "11px",
                                fontWeight: 600,
                                color: item.netVotes >= 0 ? "#22C55E" : "#DC2626",
                              }}
                            >
                              {item.netVotes >= 0 ? "+" : ""}
                              {item.netVotes} net
                            </div>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              <ThumbsUp
                                style={{ width: 16, height: 16, color: C.muted }}
                              />
                              <span
                                style={{
                                  fontSize: "16px",
                                  fontWeight: 700,
                                  color: C.text,
                                }}
                              >
                                {item.upvotes}
                              </span>
                            </div>
                          </div>
                        </div>
                        {index < topUpvotedItems.length - 1 && (
                          <div
                            style={{
                              height: "1px",
                              background: C.border,
                            }}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </VendorLayout>
  );
}
