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
import { Search, X } from "lucide-react";
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

  const handleReset = () => {
    onSearchChange("");
    onStatusChange("all");
  };

  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search by guest name or phone..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 font-poppins"
            />
          </div>
        </div>

        {/* Status Filter */}
        <Select
          value={statusFilter}
          onValueChange={(value) =>
            onStatusChange(value as ReservationStatus | "all")
          }
        >
          <SelectTrigger className="w-full md:w-48 font-poppins">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Reset Button */}
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="font-poppins"
          >
            <X className="h-4 w-4 mr-2" />
            Reset
          </Button>
        )}
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-sm">
        <p className="font-poppins text-gray-600">
          Showing <span className="font-semibold">{filteredGuests}</span> of{" "}
          <span className="font-semibold">{totalGuests}</span> guests
        </p>
        {filteredGuests === 0 && hasActiveFilters && (
          <p className="font-poppins text-gray-500">
            No guests match your filters
          </p>
        )}
      </div>
    </div>
  );
}
