"use client";

import { BookingSlot } from "@/lib/bookingSlots";
import { formatTime12Hour } from "@/lib/publicBooking";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Clock, Layers, Users, ChevronDown } from "lucide-react";

type SlotSelectorProps = {
  slots: BookingSlot[];
  selectedSlotId: string | null;
  onSlotChange: (slotId: string) => void;
  isLoading?: boolean;
};

function formatSlotDate(dateStr: string) {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function SlotSelector({
  slots,
  selectedSlotId,
  onSlotChange,
  isLoading = false,
}: SlotSelectorProps) {
  const selectedSlot = slots.find((s) => s._id === selectedSlotId);

  if (slots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-black/15 bg-white p-8 text-center">
        <p className="font-poppins text-sm text-gray-500">
          No booking slots available. Create a slot to start receiving
          reservations.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden">
      <div className="p-5 border-b border-black/[0.06]">
        <p className="font-poppins text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
          Booking slot
        </p>
        <Select
          value={selectedSlotId || ""}
          onValueChange={onSlotChange}
          disabled={isLoading}
        >
          <SelectTrigger className="h-12 font-poppins rounded-xl border-black/10 bg-[#F8F8F6] text-base">
            <SelectValue placeholder="Choose a slot to view guests…" />
          </SelectTrigger>
          <SelectContent>
            {slots.map((slot) => (
              <SelectItem key={slot._id} value={slot._id} className="font-poppins">
                <span className="font-medium">
                  {slot.slotName || slot.slotType || "Untitled slot"}
                </span>
                <span className="text-gray-400 mx-1.5">·</span>
                <span className="text-gray-500 text-sm">
                  {formatSlotDate(slot.date)}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedSlot && (
        <div
          className="p-5"
          style={{
            background:
              "linear-gradient(135deg, #0D0D0D 0%, #1a1a1a 100%)",
          }}
        >
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
            <div>
              <h3 className="font-poppins font-bold text-lg text-white tracking-tight">
                {selectedSlot.slotName || selectedSlot.slotType}
              </h3>
              <p className="font-poppins text-sm text-white/50 mt-0.5">
                {selectedSlot.slotType}
                {selectedSlot.isRecurring ? " · Recurring" : ""}
              </p>
            </div>
            <span
              className="self-start inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-poppins text-xs font-semibold"
              style={{
                background: selectedSlot.isActive
                  ? "rgba(245,230,66,0.2)"
                  : "rgba(255,255,255,0.1)",
                color: selectedSlot.isActive ? "#F5E642" : "rgba(255,255,255,0.5)",
                border: `1px solid ${selectedSlot.isActive ? "rgba(245,230,66,0.35)" : "rgba(255,255,255,0.1)"}`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  background: selectedSlot.isActive ? "#F5E642" : "rgba(255,255,255,0.4)",
                  boxShadow: selectedSlot.isActive
                    ? "0 0 6px rgba(245,230,66,0.8)"
                    : "none",
                }}
              />
              {selectedSlot.isActive ? "Active" : "Inactive"}
            </span>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                icon: Calendar,
                label: "Date",
                value: formatSlotDate(selectedSlot.date),
              },
              {
                icon: Clock,
                label: "Time window",
                value: `${formatTime12Hour(selectedSlot.startTime)} – ${formatTime12Hour(selectedSlot.endTime)}`,
              },
              {
                icon: Users,
                label: "Bookings",
                value: `${selectedSlot.totalBookings}${selectedSlot.maxBookings ? ` / ${selectedSlot.maxBookings}` : ""}`,
              },
              {
                icon: Layers,
                label: "Section",
                value: selectedSlot.sectionId?.sectionName || "—",
              },
            ].map(({ icon: Icon, label, value }) => (
              <div
                key={label}
                className="rounded-xl p-3"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Icon className="h-3.5 w-3.5 text-white/40" />
                  <p className="font-poppins text-[10px] uppercase tracking-wider text-white/40 font-semibold">
                    {label}
                  </p>
                </div>
                <p className="font-poppins text-sm font-semibold text-white leading-snug">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {!selectedSlot && !isLoading && (
        <div className="px-5 py-4 flex items-center gap-2 text-gray-400">
          <ChevronDown className="h-4 w-4" />
          <p className="font-poppins text-sm">
            Select a slot above to load its guest list
          </p>
        </div>
      )}
    </div>
  );
}
