"use client";

import { useState, useEffect } from "react";
import { ReservationPortalLayout } from "@/components/vendors/reservation-portal-layout";
import { DeleteConfirmationDialog } from "@/components/vendors/delete-confirmation-dialog";
import {
  Plus,
  Clock,
  Calendar,
  Edit,
  Trash2,
  Loader2,
  ExternalLink,
  Copy,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getBookingSlots,
  deleteBookingSlot,
  toggleBookingSlotStatus,
  deleteRecurringSeries,
  BookingSlot,
} from "@/lib/bookingSlots";

const slotTypes = ["Lunch", "Dinner", "Brunch", "Happy Hour", "Special Event"];

export default function BookingSlotsPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [bookingSlots, setBookingSlots] = useState<BookingSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<BookingSlot | null>(null);

  // Filter states
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterSlotType, setFilterSlotType] = useState<string>("all");
  const [filterDateFrom, setFilterDateFrom] = useState<string>("");
  const [filterDateTo, setFilterDateTo] = useState<string>("");

  // Fetch booking slots on mount
  useEffect(() => {
    fetchBookingSlots();
  }, []);

  const fetchBookingSlots = async () => {
    try {
      setIsLoading(true);
      const response = await getBookingSlots();
      if (response.success) {
        setBookingSlots(response.data);
      }
    } catch (error: any) {
      console.error("Error fetching booking slots:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch booking slots",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (slot: BookingSlot) => {
    setSlotToDelete(slot);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!slotToDelete) return;

    try {
      setIsDeleting(slotToDelete._id);
      let response;

      if (slotToDelete.isRecurring && slotToDelete.recurrenceGroupId) {
        response = await deleteRecurringSeries(
          slotToDelete.recurrenceGroupId,
          "all",
        );
      } else {
        response = await deleteBookingSlot(slotToDelete._id);
      }

      if (response.success) {
        toast({
          title: "Success!",
          description: response.message || "Booking slot deleted successfully",
          variant: "default",
        });
        fetchBookingSlots();
      }
    } catch (error: any) {
      console.error("Error deleting booking slot:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to delete booking slot",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(null);
      setSlotToDelete(null);
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      const response = await toggleBookingSlotStatus(id);

      if (response.success) {
        toast({
          title: "Success!",
          description: response.message || "Status updated successfully",
          variant: "default",
        });
        fetchBookingSlots();
      }
    } catch (error: any) {
      console.error("Error toggling status:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update status",
        variant: "destructive",
      });
    }
  };

  const handleCopyLink = async (publicLink: string) => {
    try {
      await navigator.clipboard.writeText(publicLink);
      toast({
        title: "Success!",
        description: "Public booking link copied to clipboard",
        variant: "default",
      });
    } catch (error) {
      console.error("Error copying link:", error);
      toast({
        title: "Error",
        description: "Failed to copy link to clipboard",
        variant: "destructive",
      });
    }
  };

  const resetFilters = () => {
    setFilterStatus("all");
    setFilterSlotType("all");
    setFilterDateFrom("");
    setFilterDateTo("");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateRange = (slot: BookingSlot) => {
    if (!slot.isRecurring || !slot.dateRange) return formatDate(slot.date);
    const start = new Date(slot.dateRange.start).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    if (!slot.dateRange.end) return `From ${start} (Ongoing)`;
    const end = new Date(slot.dateRange.end).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    return `${start} – ${end}`;
  };

  // Filter booking slots and sort latest first
  const filteredBookingSlots = bookingSlots
    .filter((slot) => {
      // Status filter
      if (filterStatus === "active" && !slot.isActive) return false;
      if (filterStatus === "inactive" && slot.isActive) return false;

      // Slot type filter
      if (filterSlotType !== "all" && slot.slotType !== filterSlotType)
        return false;

      // Date range filter
      if (filterDateFrom) {
        const slotDate = new Date(slot.date || slot.dateRange?.start || 0);
        const fromDate = new Date(filterDateFrom);
        if (slotDate < fromDate) return false;
      }
      if (filterDateTo) {
        const slotDate = new Date(slot.date || slot.dateRange?.start || 0);
        const toDate = new Date(filterDateTo);
        if (slotDate > toDate) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const aDate = new Date(
        a.dateRange?.start || a.date || a.createdAt,
      ).getTime();
      const bDate = new Date(
        b.dateRange?.start || b.date || b.createdAt,
      ).getTime();
      return bDate - aDate;
    });

  return (
    <ReservationPortalLayout pageTitle="Booking Slots">
      <div className="min-h-full bg-gray-50 px-4 py-5 sm:px-6 sm:py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8">
          {/* Stats Row */}
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
              <span className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">Total</span>
              <span className="font-poppins text-sm font-semibold text-[#0D0D0D]">
                {bookingSlots.length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#F5E642]" />
              <span className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">
                Active
              </span>
              <span className="font-poppins text-sm font-semibold text-[#0D0D0D]">
                {bookingSlots.filter((s) => s.isActive).length}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-4 py-1.5 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gray-300" />
              <span className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">
                Inactive
              </span>
              <span className="font-poppins text-sm font-semibold text-[#0D0D0D]">
                {bookingSlots.filter((s) => !s.isActive).length}
              </span>
            </div>
          </div>
          <Button
            onClick={() =>
              router.push("/vendors/reservation-portal/booking-slots/create")
            }
            className="font-poppins shrink-0 bg-[#F5E642] hover:bg-[#E8D800] text-[#0D0D0D] rounded-full px-6"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Booking Slot
          </Button>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-5 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 font-poppins text-sm font-medium text-[#0D0D0D]">
              <Filter className="h-4 w-4 text-[rgba(13,13,13,0.48)]" />
              <span>Filters</span>
            </div>
            <button
              onClick={resetFilters}
              className="font-poppins text-xs text-[rgba(13,13,13,0.48)] hover:text-[#0D0D0D] transition-colors underline-offset-2 hover:underline"
            >
              Reset all
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-1.5">
              <Label className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">
                Status
              </Label>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="font-poppins h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-poppins">
                    All Status
                  </SelectItem>
                  <SelectItem value="active" className="font-poppins">
                    Active
                  </SelectItem>
                  <SelectItem value="inactive" className="font-poppins">
                    Inactive
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">
                Slot Type
              </Label>
              <Select value={filterSlotType} onValueChange={setFilterSlotType}>
                <SelectTrigger className="font-poppins h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" className="font-poppins">
                    All Types
                  </SelectItem>
                  {slotTypes.map((type) => (
                    <SelectItem
                      key={type}
                      value={type}
                      className="font-poppins"
                    >
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">
                Date From
              </Label>
              <Input
                type="date"
                value={filterDateFrom}
                onChange={(e) => setFilterDateFrom(e.target.value)}
                className="font-poppins h-9 text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="font-poppins text-xs text-[rgba(13,13,13,0.48)]">
                Date To
              </Label>
              <Input
                type="date"
                value={filterDateTo}
                onChange={(e) => setFilterDateTo(e.target.value)}
                className="font-poppins h-9 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-[#0D0D0D]" />
            <p className="font-poppins text-sm text-[rgba(13,13,13,0.48)]">
              Loading booking slots…
            </p>
          </div>
        ) : filteredBookingSlots.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
              <Clock className="h-7 w-7 text-gray-400" />
            </div>
            <div className="text-center">
              <h3 className="font-poppins font-bold text-xl text-[#0D0D0D] mb-1">
                {bookingSlots.length === 0
                  ? "No Booking Slots Yet"
                  : "No Matching Slots"}
              </h3>
              <p className="font-poppins text-sm text-[rgba(13,13,13,0.48)] max-w-xs">
                {bookingSlots.length === 0
                  ? "Create your first booking slot to start accepting reservations."
                  : "Try adjusting your filters to see more results."}
              </p>
            </div>
            {bookingSlots.length === 0 && (
              <Button
                onClick={() =>
                  router.push(
                    "/vendors/reservation-portal/booking-slots/create",
                  )
                }
                className="font-poppins mt-2 bg-[#F5E642] hover:bg-[#E8D800] text-[#0D0D0D] rounded-full px-6"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Booking Slot
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredBookingSlots.map((slot) => (
              <div
                key={slot._id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md hover:border-gray-300 transition-all flex"
              >
                {/* Left accent bar */}
                <div
                  className={`w-1 shrink-0 ${slot.isActive ? "bg-[#F5E642]" : "bg-gray-200"}`}
                />

                <div className="flex-1 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 min-w-0">
                  {/* Left: info */}
                  <div className="flex-1 min-w-0 space-y-2.5">
                    {/* Badges */}
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`inline-flex items-center gap-1.5 font-poppins text-xs font-medium px-2.5 py-1 rounded-full ${
                          slot.isActive
                            ? "bg-orange-50 text-[#0D0D0D]"
                            : "bg-gray-100 text-[rgba(13,13,13,0.48)]"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${slot.isActive ? "bg-[#F5E642]" : "bg-gray-400"}`}
                        />
                        {slot.isActive ? "Active" : "Inactive"}
                      </span>
                      <span className="inline-flex font-poppins text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-[#0D0D0D]">
                        {slot.slotType}
                      </span>
                      {slot.isRecurring && (
                        <span className="inline-flex items-center gap-1 font-poppins text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-[#0D0D0D]">
                          <svg
                            className="w-3 h-3"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                          Recurring
                        </span>
                      )}
                    </div>

                    {/* Title + time meta */}
                    <div>
                      <h3 className="font-poppins font-bold text-xl text-[#0D0D0D] leading-tight">
                        {slot.slotName || `${slot.slotType} Slot`}
                      </h3>
                      <div className="flex items-center gap-4 flex-wrap mt-1 font-poppins text-sm text-[rgba(13,13,13,0.48)]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 shrink-0" />
                          {formatDateRange(slot)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 shrink-0" />
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                    </div>

                    {/* Detail chips */}
                    <div className="flex items-center gap-2 flex-wrap font-poppins text-xs">
                      <span className="bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1 text-[#0D0D0D]">
                        <span className="text-[rgba(13,13,13,0.48)]">Section · </span>
                        {typeof slot.sectionId === "object"
                          ? slot.sectionId.sectionName
                          : "N/A"}
                      </span>
                      <span className="bg-gray-50 border border-gray-200 rounded-md px-2.5 py-1 text-[#0D0D0D]">
                        <span className="text-[rgba(13,13,13,0.48)]">Bookings · </span>
                        {slot.maxBookings
                          ? slot.isRecurring
                            ? `${slot.maxBookings} per day`
                            : `${slot.totalBookings} / ${slot.maxBookings}`
                          : `${slot.totalBookings} (Unlimited)`}
                      </span>
                    </div>

                    {/* Public link */}
                    {slot.publicLink && (
                      <div className="flex items-center gap-3 pt-0.5">
                        <a
                          href={slot.publicLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-poppins text-xs text-[#0D0D0D] hover:underline flex items-center gap-1 underline-offset-2"
                        >
                          <ExternalLink className="h-3 w-3" />
                          Public link
                        </a>
                        <button
                          onClick={() => handleCopyLink(slot.publicLink!)}
                          className="font-poppins text-xs text-[rgba(13,13,13,0.48)] hover:text-[#0D0D0D] flex items-center gap-1 transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                          Copy
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Right: action buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        router.push(
                          `/vendors/reservation-portal/booking-slots/edit/${slot._id}`,
                        )
                      }
                      className="font-poppins h-8 px-3 text-xs border-gray-200 text-[#0D0D0D] hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      <Edit className="h-3.5 w-3.5 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleStatus(slot._id)}
                      className="font-poppins h-8 px-3 text-xs border-gray-200 text-[rgba(13,13,13,0.48)] hover:bg-gray-50 hover:border-gray-300 transition-colors"
                    >
                      {slot.isActive ? "Deactivate" : "Activate"}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteClick(slot)}
                      disabled={isDeleting === slot._id}
                      className="font-poppins h-8 px-3 text-xs border-gray-200 text-red-400 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-colors disabled:opacity-50"
                    >
                      {isDeleting === slot._id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <>
                          <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                          Delete
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        title={
          slotToDelete?.isRecurring
            ? "Delete recurring series?"
            : "Delete booking slot?"
        }
        description={
          slotToDelete?.isRecurring
            ? `Are you sure you want to delete this entire recurring series? This will delete all ${bookingSlots.filter((s) => s.recurrenceGroupId === slotToDelete.recurrenceGroupId).length} occurrences. This action cannot be undone.`
            : "Are you sure you want to delete this booking slot? This action cannot be undone."
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </ReservationPortalLayout>
  );
}
