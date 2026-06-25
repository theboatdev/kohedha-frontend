"use client";

import { Button } from "@/components/ui/button";
import {
  Calendar,
  Clock,
  Loader2,
  MapPin,
  Phone,
  Users,
} from "lucide-react";
import { Reservation, ReservationStatus } from "@/lib/guestList";
import { formatTime12Hour } from "@/lib/publicBooking";

type GuestCardProps = {
  reservation: Reservation;
  onStatusChange: (status: ReservationStatus, reason?: string) => Promise<void>;
  isUpdating?: boolean;
};

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function GuestCard({
  reservation,
  onStatusChange,
  isUpdating = false,
}: GuestCardProps) {
  const reservationDate = new Date(reservation.reservationDate);
  const formattedDate = reservationDate.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="group rounded-xl bg-white border border-black/[0.08] p-4 transition-all duration-200 hover:border-black/[0.16] hover:shadow-md">
      {/* Guest identity */}
      <div className="flex items-start gap-3 mb-4">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-poppins text-sm font-bold"
          style={{ background: "rgba(245,230,66,0.25)", color: "#0D0D0D" }}
        >
          {getInitials(reservation.customerName)}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-poppins font-semibold text-[15px] text-gray-900 truncate">
            {reservation.customerName}
          </h3>
          <p className="font-poppins text-xs text-gray-500 flex items-center gap-1 mt-0.5">
            <Phone className="h-3 w-3 shrink-0" />
            <span className="truncate">{reservation.customerPhone}</span>
          </p>
        </div>
        <div
          className="shrink-0 rounded-lg px-2.5 py-1 font-poppins text-xs font-semibold"
          style={{ background: "#0D0D0D", color: "#ffffff" }}
        >
          {reservation.numberOfGuests}{" "}
          <span className="font-normal opacity-70">
            {reservation.numberOfGuests === 1 ? "guest" : "guests"}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 rounded-lg bg-[#F8F8F6] p-3 mb-3">
        <div className="flex items-center gap-2 text-xs font-poppins text-gray-600">
          <Calendar className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-2 text-xs font-poppins text-gray-600">
          <Clock className="h-3.5 w-3.5 text-gray-400 shrink-0" />
          <span>
            {formatTime12Hour(reservation.startTime)} –{" "}
            {formatTime12Hour(reservation.endTime)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs font-poppins">
          <div className="flex items-center gap-2 text-gray-600 min-w-0">
            <MapPin className="h-3.5 w-3.5 text-gray-400 shrink-0" />
            <span className="truncate">
              {reservation.sectionId.sectionName}
            </span>
          </div>
          <span
            className="shrink-0 rounded-md px-2 py-0.5 font-semibold text-gray-800"
            style={{ background: "rgba(245,230,66,0.35)" }}
          >
            Table {reservation.tableId.tableNumber}
          </span>
        </div>
      </div>

      {reservation.status === "cancelled" && reservation.cancellationReason && (
        <div
          className="mb-3 rounded-lg border border-black/[0.06] bg-white px-3 py-2"
        >
          <p className="font-poppins text-[10px] uppercase tracking-wide text-gray-400 mb-0.5">
            Cancellation reason
          </p>
          <p className="font-poppins text-xs text-gray-700 line-clamp-2">
            {reservation.cancellationReason}
          </p>
        </div>
      )}

      {reservation.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <Button
            size="sm"
            className="flex-1 font-poppins h-9 text-xs font-semibold"
            style={{ background: "#F5E642", color: "#0D0D0D" }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#E8D800";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#F5E642";
            }}
            onClick={() => onStatusChange("confirmed")}
            disabled={isUpdating}
          >
            {isUpdating ? (
              <>
                <Loader2 className="h-3.5 w-3.5 mr-1.5 animate-spin" />
                Confirming…
              </>
            ) : (
              "Confirm"
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="flex-1 font-poppins h-9 text-xs font-medium border-black/15 text-gray-700 hover:bg-gray-50"
            onClick={() => onStatusChange("cancelled", "Declined by vendor")}
            disabled={isUpdating}
          >
            Decline
          </Button>
        </div>
      )}
    </div>
  );
}
