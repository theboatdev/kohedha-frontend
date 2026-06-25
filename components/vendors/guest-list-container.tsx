"use client";

import { useState, useMemo } from "react";
import { GuestCard } from "./guest-card";
import { GuestListFilters } from "./guest-list-filters";
import { Reservation, ReservationStatus } from "@/lib/guestList";
import { Users } from "lucide-react";

type GuestListContainerProps = {
  reservations: Reservation[];
  isLoading?: boolean;
  onUpdateReservation: (
    reservationId: string,
    status: ReservationStatus,
    reason?: string,
  ) => Promise<void>;
};

const COLUMNS: {
  key: ReservationStatus;
  label: string;
}[] = [
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Confirmed" },
  { key: "cancelled", label: "Cancelled" },
];

export function GuestListContainer({
  reservations,
  isLoading = false,
  onUpdateReservation,
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
            <div
              className="h-8 rounded animate-pulse"
              style={{ background: "#E5E7EB" }}
            />
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="h-44 rounded-lg animate-pulse"
                style={{ background: "#ffffff" }}
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  if (reservations.length === 0) {
    return (
      <div className="text-center py-16">
        <Users
          className="h-12 w-12 mx-auto mb-4"
          style={{ color: "rgba(255,255,255,0.3)" }}
        />
        <h3 className="font-poppins font-bold text-xl mb-2" style={{ color: "#0D0D0D" }}>
          No Reservations Yet
        </h3>
        <p
          className="font-poppins text-sm max-w-sm mx-auto"
          style={{ color: "rgba(13,13,13,0.48)" }}
        >
          Reservations from your public booking link will appear here. Share
          your booking link to start receiving reservations.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <GuestListFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        totalGuests={reservations.length}
        filteredGuests={filteredReservations.length}
      />

      {filteredReservations.length === 0 ? (
        <div
          className="text-center py-12 rounded-lg"
          style={{
            background: "#ffffff",
            border: "1px solid rgba(13,13,13,0.1)",
          }}
        >
          <Users
            className="h-10 w-10 mx-auto mb-3"
            style={{ color: "rgba(255,255,255,0.3)" }}
          />
          <p className="font-poppins" style={{ color: "rgba(13,13,13,0.48)" }}>
            No guests match your filters
          </p>
        </div>
      ) : (
        /* Jira-style 3-column board */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {COLUMNS.map((col) => {
            const cards = filteredReservations.filter(
              (r) => r.status === col.key,
            );
            return (
              <div
                key={col.key}
                className="rounded-xl overflow-hidden"
                style={{ border: "1px solid rgba(13,13,13,0.12)" }}
              >
                {/* Column header */}
                <div
                  className="flex items-center justify-between px-4 py-3"
                  style={{
                    background: "#ffffff",
                    borderBottom: "1px solid rgba(13,13,13,0.08)",
                  }}
                >
                  <span
                    className="font-poppins font-bold text-base tracking-wide"
                    style={{ color: "#0D0D0D" }}
                  >
                    {col.label}
                  </span>
                  <span
                    className="font-poppins text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      background: "rgba(13,13,13,0.08)",
                      color: "rgba(13,13,13,0.48)",
                    }}
                  >
                    {cards.length}
                  </span>
                </div>

                {/* Cards */}
                <div
                  className="p-3 space-y-3"
                  style={{ background: "#F0F0EE", minHeight: "120px" }}
                >
                  {cards.length === 0 ? (
                    <p
                      className="text-center py-6 font-poppins text-xs"
                      style={{ color: "rgba(13,13,13,0.48)" }}
                    >
                      No {col.label.toLowerCase()} reservations
                    </p>
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
