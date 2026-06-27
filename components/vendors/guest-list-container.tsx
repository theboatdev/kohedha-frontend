"use client";

import { useState, useMemo } from "react";
import { GuestCard } from "./guest-card";
import { GuestListFilters } from "./guest-list-filters";
import { Reservation, ReservationStatus } from "@/lib/guestList";
import { Users, UserCheck, Clock, UserX, Inbox } from "lucide-react";

type GuestListContainerProps = {
  reservations: Reservation[];
  isLoading?: boolean;
  onUpdateReservation: (
    reservationId: string,
    status: ReservationStatus,
    reason?: string,
  ) => Promise<void>;
  isTodayView?: boolean;
};

const COLUMNS: {
  key: ReservationStatus;
  label: string;
  accent: string;
  badgeBg: string;
  badgeText: string;
  icon: typeof Clock;
}[] = [
  {
    key: "pending",
    label: "Pending",
    accent: "#F5E642",
    badgeBg: "rgba(245,230,66,0.2)",
    badgeText: "#7A6F00",
    icon: Clock,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    accent: "#0D0D0D",
    badgeBg: "rgba(13,13,13,0.08)",
    badgeText: "#0D0D0D",
    icon: UserCheck,
  },
  {
    key: "cancelled",
    label: "Cancelled",
    accent: "rgba(13,13,13,0.2)",
    badgeBg: "rgba(13,13,13,0.06)",
    badgeText: "rgba(13,13,13,0.55)",
    icon: UserX,
  },
];

export function GuestListContainer({
  reservations,
  isLoading = false,
  onUpdateReservation,
  isTodayView = false,
}: GuestListContainerProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<ReservationStatus | "all">(
    "all",
  );
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredReservations = useMemo(() => {
    return reservations.filter((r) => {
      const matchesSearch =
        r.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.customerPhone.includes(searchQuery);
      const matchesStatus = statusFilter === "all" || r.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [reservations, searchQuery, statusFilter]);

  const handleStatusChange = async (
    reservationId: string,
    status: ReservationStatus,
    reason?: string,
  ) => {
    setUpdatingId(reservationId);
    try {
      await onUpdateReservation(reservationId, status, reason);
    } finally {
      setUpdatingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.key} className="space-y-3">
            <div className="h-12 rounded-xl animate-pulse bg-white" />
            {Array.from({ length: 2 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-xl animate-pulse bg-white border border-black/[0.06]"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="rounded-2xl border border-black/[0.08] bg-white px-6 py-16 text-center">
        <div
          className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ background: "rgba(245,230,66,0.2)" }}
        >
          <Inbox className="h-7 w-7 text-gray-700" />
        </div>
        <h3 className="font-poppins font-bold text-xl text-gray-900 mb-2">
          No reservations yet
        </h3>
        <p className="font-poppins text-sm text-gray-500 max-w-md mx-auto">
          {isTodayView
            ? "There are no reservations scheduled for today across your booking slots."
            : "Share your public booking link for this slot and reservations will appear here automatically."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-black/[0.08] bg-white p-4">
        <GuestListFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          totalGuests={reservations.length}
          filteredGuests={filteredReservations.length}
        />
      </div>

      {filteredReservations.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-black/15 bg-white px-6 py-14 text-center">
          <Users className="h-10 w-10 mx-auto mb-3 text-gray-300" />
          <p className="font-poppins text-sm text-gray-500">
            No guests match your search or filters
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {COLUMNS.map((col) => {
            const cards = filteredReservations.filter(
              (r) => r.status === col.key,
            );
            const ColIcon = col.icon;

            return (
              <div
                key={col.key}
                className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden"
              >
                <div
                  className="h-1"
                  style={{ background: col.accent }}
                />
                <div className="flex items-center justify-between px-4 py-3.5 border-b border-black/[0.06]">
                  <div className="flex items-center gap-2">
                    <ColIcon className="h-4 w-4 text-gray-500" />
                    <span className="font-poppins font-semibold text-sm text-gray-900">
                      {col.label}
                    </span>
                  </div>
                  <span
                    className="font-poppins text-xs font-bold px-2.5 py-1 rounded-full tabular-nums"
                    style={{
                      background: col.badgeBg,
                      color: col.badgeText,
                    }}
                  >
                    {cards.length}
                  </span>
                </div>

                <div
                  className="p-3 space-y-3 min-h-[140px]"
                  style={{ background: "#F8F8F6" }}
                >
                  {cards.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-10 text-center">
                      <p className="font-poppins text-xs text-gray-400">
                        No {col.label.toLowerCase()} guests
                      </p>
                    </div>
                  ) : (
                    cards.map((reservation) => (
                      <GuestCard
                        key={reservation._id}
                        reservation={reservation}
                        isUpdating={updatingId === reservation._id}
                        onStatusChange={(status, reason) =>
                          handleStatusChange(reservation._id, status, reason)
                        }
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
