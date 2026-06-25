"use client";

import { useState, useEffect } from "react";
import { ReservationPortalLayout } from "@/components/vendors/reservation-portal-layout";
import { SlotSelector } from "@/components/vendors/slot-selector";
import { GuestListContainer } from "@/components/vendors/guest-list-container";
import {
  getSlotReservations,
  getTodayReservations,
  confirmReservation,
  cancelReservation,
  Reservation,
  ReservationStatus,
} from "@/lib/guestList";
import { getBookingSlots, BookingSlot } from "@/lib/bookingSlots";
import { useToast } from "@/hooks/use-toast";
import { CalendarDays, Users } from "lucide-react";

export default function GuestListPage() {
  const { toast } = useToast();

  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSlotsLoading, setIsSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  const [showToday, setShowToday] = useState(false);

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isReservationsLoading, setIsReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    fetchSlots();
  }, []);

  useEffect(() => {
    if (showToday) {
      fetchTodayReservations();
    } else if (selectedSlotId) {
      fetchReservations(selectedSlotId);
    } else {
      setReservations([]);
      setReservationsError(null);
    }
  }, [selectedSlotId, showToday]);

  const fetchSlots = async () => {
    try {
      setIsSlotsLoading(true);
      setSlotsError(null);
      const response = await getBookingSlots();
      setSlots(response.data || []);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch booking slots";
      setSlotsError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsSlotsLoading(false);
    }
  };

  const fetchTodayReservations = async () => {
    try {
      setIsReservationsLoading(true);
      setReservationsError(null);
      const response = await getTodayReservations();
      setReservations(response.data || []);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch today's reservations";
      setReservationsError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsReservationsLoading(false);
    }
  };

  const fetchReservations = async (slotId: string) => {
    try {
      setIsReservationsLoading(true);
      setReservationsError(null);
      const response = await getSlotReservations(slotId);
      setReservations(response.data || []);
    } catch (err: any) {
      const errorMsg = err.message || "Failed to fetch reservations";
      setReservationsError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setIsReservationsLoading(false);
    }
  };

  const handleSlotChange = (slotId: string) => {
    setShowToday(false);
    setSelectedSlotId(slotId);
  };

  const handleToggleToday = () => {
    setShowToday((prev) => !prev);
    if (!showToday) {
      setSelectedSlotId(null);
    }
  };

  const handleUpdateReservation = async (
    reservationId: string,
    status: ReservationStatus,
    reason?: string,
  ) => {
    const slotId = selectedSlotId;
    if (!slotId && !showToday) return;

    try {
      if (status === "confirmed") {
        await confirmReservation(slotId!, reservationId);
      } else if (status === "cancelled") {
        await cancelReservation(slotId!, reservationId, reason);
      }

      setReservations((prev) =>
        prev.map((res) =>
          res._id === reservationId ? { ...res, status } : res,
        ),
      );

      toast({
        title: "Success",
        description: `Reservation ${status} successfully`,
        variant: "default",
      });
    } catch (err: any) {
      const errorMsg = err.message || "Failed to update reservation";
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    }
  };

  const showGuestList = selectedSlotId || showToday;

  return (
    <ReservationPortalLayout
      pageTitle="Guest List"
      headerActions={
        <button
          onClick={handleToggleToday}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: showToday ? "#F5E642" : "transparent",
            border: `1px solid ${showToday ? "#F5E642" : "rgba(13,13,13,0.15)"}`,
            borderRadius: "40px",
            padding: "6px 14px",
            fontSize: "13px",
            color: showToday ? "#0D0D0D" : "rgba(13,13,13,0.48)",
            cursor: "pointer",
            transition: "all 0.2s ease",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#F5E642";
            e.currentTarget.style.color = "#0D0D0D";
            e.currentTarget.style.borderColor = "#F5E642";
          }}
          onMouseLeave={(e) => {
            if (showToday) {
              e.currentTarget.style.background = "#F5E642";
              e.currentTarget.style.color = "#0D0D0D";
              e.currentTarget.style.borderColor = "#F5E642";
            } else {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "rgba(13,13,13,0.48)";
              e.currentTarget.style.borderColor = "rgba(13,13,13,0.15)";
            }
          }}
        >
          <CalendarDays style={{ width: 13, height: 13 }} />
          <span className="hidden sm:inline">Today&apos;s reservations</span>
          <span className="sm:hidden">Today</span>
        </button>
      }
    >
      <div
        className="min-h-full"
        style={{ background: "#F0F0EE" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          {slotsError && !isSlotsLoading && (
            <div className="rounded-2xl border border-black/10 bg-white p-4 mb-6">
              <p className="font-poppins text-sm text-gray-800">{slotsError}</p>
            </div>
          )}

          {/* Today view banner */}
          {showToday && (
            <div
              className="rounded-2xl border border-black/[0.08] bg-white p-5 mb-6 flex items-center gap-4"
            >
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(245,230,66,0.25)" }}
              >
                <CalendarDays className="h-5 w-5 text-gray-800" />
              </div>
              <div>
                <h3 className="font-poppins font-semibold text-gray-900">
                  Today&apos;s reservations
                </h3>
                <p className="font-poppins text-sm text-gray-500">
                  All bookings scheduled for today across your active slots
                </p>
              </div>
            </div>
          )}

          {/* Slot selector */}
          {!showToday && (
            <div className="mb-6">
              <SlotSelector
                slots={slots}
                selectedSlotId={selectedSlotId}
                onSlotChange={handleSlotChange}
                isLoading={isSlotsLoading}
              />
            </div>
          )}

          {/* Guest list */}
          {showGuestList && (
            <div>
              {reservationsError && !isReservationsLoading && (
                <div className="rounded-2xl border border-black/10 bg-white p-4 mb-6">
                  <p className="font-poppins text-sm text-gray-800">
                    {reservationsError}
                  </p>
                </div>
              )}

              {!reservationsError && (
                <GuestListContainer
                  reservations={reservations}
                  isLoading={isReservationsLoading}
                  onUpdateReservation={handleUpdateReservation}
                  isTodayView={showToday}
                />
              )}
            </div>
          )}

          {/* Empty state — no slot selected */}
          {!selectedSlotId && !showToday && !isSlotsLoading && slots.length > 0 && (
            <div className="rounded-2xl border border-dashed border-black/12 bg-white px-6 py-16 text-center">
              <div
                className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
                style={{ background: "rgba(13,13,13,0.05)" }}
              >
                <Users className="h-7 w-7 text-gray-400" />
              </div>
              <h3 className="font-poppins font-semibold text-gray-900 mb-1">
                Pick a slot to get started
              </h3>
              <p className="font-poppins text-sm text-gray-500 max-w-sm mx-auto">
                Choose a booking slot above to see who&apos;s coming in and
                manage confirmations.
              </p>
            </div>
          )}
        </div>
      </div>
    </ReservationPortalLayout>
  );
}
