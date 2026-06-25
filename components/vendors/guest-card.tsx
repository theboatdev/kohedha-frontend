"use client";

import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Calendar,
  CheckCircle,
  Clock,
  Users,
  XCircle,
  Loader2,
} from "lucide-react";
import { Reservation, ReservationStatus } from "@/lib/guestList";

type GuestCardProps = {
  reservation: Reservation;
  onStatusChange: (status: ReservationStatus, reason?: string) => Promise<void>;
  isUpdating?: boolean;
};

const getStatusColor = (status: ReservationStatus) => {
  return "";
};

const getStatusIcon = (status: ReservationStatus) => {
  switch (status) {
    case "confirmed":
      return <CheckCircle className="h-4 w-4" />;
    case "pending":
      return <AlertCircle className="h-4 w-4" />;
    case "cancelled":
      return <XCircle className="h-4 w-4" />;
  }
};

export function GuestCard({
  reservation,
  onStatusChange,
  isUpdating = false,
}: GuestCardProps) {
  const reservationDate = new Date(reservation.reservationDate);
  const formattedDate = reservationDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="rounded-lg p-4 transition-all duration-200 hover:shadow-md"
      style={{ background: "#ffffff", border: "2px solid rgba(13,13,13,0.2)" }}
    >
      <div className="space-y-3">
        {/* Header: Name and Status */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <h3
              className="font-poppins font-bold text-lg tracking-tight truncate"
              style={{ color: "#0D0D0D" }}
            >
              {reservation.customerName}
            </h3>
            <p
              className="font-poppins text-xs truncate"
              style={{ color: "rgba(13,13,13,0.48)" }}
            >
              {reservation.customerPhone}
            </p>
          </div>
          <div
            className="flex items-center gap-1 px-2 py-1 rounded text-xs font-medium font-poppins flex-shrink-0 whitespace-nowrap"
            style={{ background: "rgba(13,13,13,0.06)", color: "rgba(13,13,13,0.48)" }}
          >
            {getStatusIcon(reservation.status)}
            <span className="hidden sm:inline">
              {reservation.status.charAt(0).toUpperCase() +
                reservation.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(13,13,13,0.1)" }} />

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div>
            <p className="font-poppins mb-0.5" style={{ color: "rgba(13,13,13,0.48)" }}>
              Date
            </p>
            <p
              className="font-poppins font-semibold"
              style={{ color: "#0D0D0D" }}
            >
              {formattedDate}
            </p>
          </div>

          <div>
            <p className="font-poppins mb-0.5" style={{ color: "rgba(13,13,13,0.48)" }}>
              Time
            </p>
            <p
              className="font-poppins font-semibold"
              style={{ color: "#0D0D0D" }}
            >
              {reservation.startTime}
            </p>
          </div>

          <div>
            <p className="font-poppins mb-0.5" style={{ color: "rgba(13,13,13,0.48)" }}>
              Guests
            </p>
            <p
              className="font-poppins font-semibold"
              style={{ color: "#0D0D0D" }}
            >
              {reservation.numberOfGuests}
            </p>
          </div>

          <div>
            <p className="font-poppins mb-0.5" style={{ color: "rgba(13,13,13,0.48)" }}>
              Table
            </p>
            <p
              className="font-poppins font-semibold"
              style={{ color: "#0D0D0D" }}
            >
              #{reservation.tableId.tableNumber}
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px" style={{ background: "rgba(13,13,13,0.1)" }} />

        {/* Section badge */}
        <div className="flex justify-end">
          <div
            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium font-poppins flex-shrink-0"
            style={{
              background: "#E8E8E4",
              color: "#0D0D0D",
              border: "1px solid rgba(13,13,13,0.15)",
            }}
          >
            {reservation.sectionId.sectionName}
          </div>
        </div>

        {/* Cancellation Reason (if applicable) */}
        {reservation.status === "cancelled" &&
          reservation.cancellationReason && (
            <>
              <div
                className="h-px"
                style={{ background: "rgba(13,13,13,0.1)" }}
              />
              <div className="text-xs">
                <p className="font-poppins mb-0.5" style={{ color: "rgba(13,13,13,0.48)" }}>
                  Cancellation Reason
                </p>
                <p
                  className="font-poppins line-clamp-2"
                  style={{ color: "#0D0D0D" }}
                >
                  {reservation.cancellationReason}
                </p>
              </div>
            </>
          )}

        {/* Action Buttons — only for pending */}
        {reservation.status === "pending" && (
          <>
            <div
              className="h-px"
              style={{ background: "rgba(13,13,13,0.1)" }}
            />
            <div className="pt-1">
              <div className="flex gap-2">
                <Button
                  size="xs"
                  className="flex-1 font-poppins h-8 text-xs"
                  style={{ background: "#F5E642", color: "#0D0D0D" }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#E8D800")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "#F5E642")
                  }
                  onClick={() => onStatusChange("confirmed")}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    "Confirm"
                  )}
                </Button>
                <Button
                  size="xs"
                  variant="outline"
                  className="flex-1 font-poppins h-8 text-xs"
                  style={{
                    borderColor: "rgba(13,13,13,0.2)",
                    color: "#0D0D0D",
                  }}
                  onClick={() =>
                    onStatusChange("cancelled", "Declined by vendor")
                  }
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    </>
                  ) : (
                    "Cancel"
                  )}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
