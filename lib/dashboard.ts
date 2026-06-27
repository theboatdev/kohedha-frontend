const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5002/api";

export interface DashboardStats {
  activeDeals: number;
  upcomingEvents: number;
  monthlyReservations: number;
  ongoingReservations: number;
  totalMenuUpvotes: number;
}

export interface PerformanceMetrics {
  averageRating: number;
  totalRatings: number;
  savedByUsers: number;
  peakHours: string;
}

export interface DashboardAnalytics {
  stats: DashboardStats;
  performance: PerformanceMetrics;
}

export interface ReservationAnalytics {
  byStatus: Array<{
    _id: string;
    count: number;
  }>;
  peakHours: Array<{
    _id: string;
    count: number;
  }>;
}

/**
 * Get vendor dashboard analytics
 */
export async function getDashboardAnalytics(): Promise<{
  success: boolean;
  data?: DashboardAnalytics;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(`${API_URL}/vendor/dashboard/analytics`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      credentials: "include",
    });

    const responseData = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: responseData.data,
      };
    }

    return {
      success: false,
      error: responseData.message || "Failed to fetch dashboard analytics",
    };
  } catch (error) {
    console.error("Dashboard analytics error:", error);
    return {
      success: false,
      error: "Unable to fetch dashboard analytics. Please try again.",
    };
  }
}

/**
 * Get detailed reservation analytics
 */
export async function getReservationAnalytics(): Promise<{
  success: boolean;
  data?: ReservationAnalytics;
  error?: string;
}> {
  try {
    const token = localStorage.getItem("auth_token");

    const res = await fetch(
      `${API_URL}/vendor/dashboard/reservation-analytics`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        credentials: "include",
      },
    );

    const responseData = await res.json();

    if (res.ok) {
      return {
        success: true,
        data: responseData.data,
      };
    }

    return {
      success: false,
      error: responseData.message || "Failed to fetch reservation analytics",
    };
  } catch (error) {
    console.error("Reservation analytics error:", error);
    return {
      success: false,
      error: "Unable to fetch reservation analytics. Please try again.",
    };
  }
}
