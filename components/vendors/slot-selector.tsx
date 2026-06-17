"use client";

import { BookingSlot } from "@/lib/bookingSlots";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Users } from "lucide-react";

type SlotSelectorProps = {
  slots: BookingSlot[];
  selectedSlotId: string | null;
  onSlotChange: (slotId: string) => void;
  isLoading?: boolean;
};

export function SlotSelector({
  slots,
  selectedSlotId,
  onSlotChange,
  isLoading = false,
}: SlotSelectorProps) {
  if (slots.length === 0) {
    return (
      <div className="bg-white rounded-lg p-6 border border-gray-200 text-center">
        <p className="font-poppins text-gray-600">
          No booking slots available. Create a booking slot to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
      <div>
        <label className="block font-poppins font-semibold text-sm text-gray-700 mb-2">
          Select Booking Slot
        </label>
        <Select
          value={selectedSlotId || ""}
          onValueChange={onSlotChange}
          disabled={isLoading}
        >
          <SelectTrigger className="font-poppins">
            <SelectValue placeholder="Choose a slot to view guests..." />
          </SelectTrigger>
          <SelectContent>
            {slots.map((slot) => {
              const slotDate = new Date(slot.date);
              const formattedDate = slotDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });

              return (
                <SelectItem key={slot._id} value={slot._id}>
                  <div className="flex items-center gap-2">
                    <span>{slot.slotName || "Untitled Slot"}</span>
                    <span className="text-gray-500">•</span>
                    <span className="text-sm text-gray-600">
                      {formattedDate} {slot.startTime}
                    </span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Selected Slot Details */}
      {selectedSlotId && (
        <div className="border-t border-gray-200 pt-4">
          {(() => {
            const selectedSlot = slots.find((s) => s._id === selectedSlotId);
            if (!selectedSlot) return null;

            const slotDate = new Date(selectedSlot.date);
            const formattedDate = slotDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-poppins font-semibold text-gray-900">
                    {selectedSlot.slotName || "Untitled Slot"}
                  </h3>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium font-poppins bg-gray-100 text-gray-700">
                    {selectedSlot.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-poppins text-xs text-gray-500">Date</p>
                      <p className="font-poppins text-sm font-medium text-gray-900">
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-poppins text-xs text-gray-500">Time</p>
                      <p className="font-poppins text-sm font-medium text-gray-900">
                        {selectedSlot.startTime} - {selectedSlot.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="font-poppins text-xs text-gray-500">
                        Bookings
                      </p>
                      <p className="font-poppins text-sm font-medium text-gray-900">
                        {selectedSlot.totalBookings}/
                        {selectedSlot.maxBookings || "∞"}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="font-poppins text-xs text-gray-500">
                      Section
                    </p>
                    <p className="font-poppins text-sm font-medium text-gray-900">
                      {selectedSlot.sectionId?.sectionName || "—"}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
