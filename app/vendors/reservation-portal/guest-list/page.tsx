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

export default function GuestListPage() {
  const { toast } = useToast();

  // Slots state
  const [slots, setSlots] = useState<BookingSlot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isSlotsLoading, setIsSlotsLoading] = useState(true);
  const [slotsError, setSlotsError] = useState<string | null>(null);

  // Today view state
  const [showToday, setShowToday] = useState(false);

  // Reservations state
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isReservationsLoading, setIsReservationsLoading] = useState(false);
  const [reservationsError, setReservationsError] = useState<string | null>(
    null,
  );

  // Fetch booking slots on mount
  useEffect(() => {
    fetchSlots();
  }, []);

  // Fetch reservations when slot is selected
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
    if (!selectedSlotId) return;

    try {
      if (status === "confirmed") {
        await confirmReservation(selectedSlotId, reservationId);
      } else if (status === "cancelled") {
        await cancelReservation(selectedSlotId, reservationId, reason);
      }

      // Update local state
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

  return (
    <ReservationPortalLayout pageTitle="Guest List">
      <div
        className="max-w-7xl mx-auto px-3 sm:px-6 py-8 sm:py-12"
        style={{ background: "#F5F5F5" }}
      >
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            
            <p
              className="font-poppins text-sm sm:text-base"
              style={{ color: "#7A7368" }}
            >
              Select a slot and manage your reservations
            </p>
          </div>
          <button
            onClick={handleToggleToday}
            className="font-poppins text-sm px-4 py-2 rounded-lg border transition-colors self-start"
            style={
              showToday
                ? {
                    background: "#2A2620",
                    color: "#ffffff",
                    borderColor: "#2A2620",
                  }
                : {
                    background: "#ffffff",
                    color: "#2A2620",
                    borderColor: "rgba(42,38,32,0.3)",
                  }
            }
          >
            Today&apos;s Reservations
          </button>
        </div>

        {/* Slots Error State */}
        {slotsError && !isSlotsLoading && (
          <div
            className="rounded-lg p-4 mb-6"
            style={{
              background: "#ffffff",
              border: "1px solid rgba(196,114,74,0.3)",
            }}
          >
            <p className="font-poppins text-sm" style={{ color: "#C4724A" }}>
              {slotsError}
            </p>
          </div>
        )}

        {/* Slot Selector - hidden when today view is active */}
        {!showToday && (
          <div className="mb-8">
            <SlotSelector
              slots={slots}
              selectedSlotId={selectedSlotId}
              onSlotChange={handleSlotChange}
              isLoading={isSlotsLoading}
            />
          </div>
        )}

        {/* Content Section */}
        {(selectedSlotId || showToday) && (
          <div className="space-y-6">
            {/* Reservations Error State */}
            {reservationsError && !isReservationsLoading && (
              <div
                className="rounded-lg p-4"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(196,114,74,0.3)",
                }}
              >
                <p
                  className="font-poppins text-sm"
                  style={{ color: "#C4724A" }}
                >
                  {reservationsError}
                </p>
              </div>
            )}

            {/* Guest List */}
            {!reservationsError && (
              <GuestListContainer
                reservations={reservations}
                isLoading={isReservationsLoading}
                onUpdateReservation={handleUpdateReservation}
              />
            )}
          </div>
        )}

        {/* Empty State - No Slot Selected */}
        {!selectedSlotId &&
          !showToday &&
          !isSlotsLoading &&
          slots.length > 0 && (
            <div
              className="text-center py-16 rounded-lg"
              style={{
                background: "#ffffff",
                border: "1px solid rgba(42,38,32,0.1)",
              }}
            >
              <p className="font-poppins" style={{ color: "#7A7368" }}>
                Select a booking slot above to view and manage its guests
              </p>
            </div>
          )}
      </div>
    </ReservationPortalLayout>
  );
}
