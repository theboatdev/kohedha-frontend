"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { ReservationStatus } from "@/lib/guestList";

type GuestListFiltersProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: ReservationStatus | "all";
  onStatusChange: (status: ReservationStatus | "all") => void;
  totalGuests: number;
  filteredGuests: number;
};

export function GuestListFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  totalGuests,
  filteredGuests,
}: GuestListFiltersProps) {
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input
          type="text"
          placeholder="Search by name or phone…"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-10 pl-10 font-poppins bg-white border-black/10 rounded-xl"
        />
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusChange(value as ReservationStatus | "all")
          }
        >
          <SelectTrigger className="h-10 w-full sm:w-44 font-poppins rounded-xl border-black/10 bg-white">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-3.5 w-3.5 text-gray-400" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              onSearchChange("");
              onStatusChange("all");
            }}
            className="h-10 w-10 shrink-0 rounded-xl border-black/10"
            title="Clear filters"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <p className="font-poppins text-xs text-gray-500 sm:ml-auto whitespace-nowrap">
        <span className="font-semibold text-gray-900">{filteredGuests}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalGuests}</span>{" "}
        reservations
      </p>
    </div>
  );
}
