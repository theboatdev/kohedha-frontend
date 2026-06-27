"use client";

import { useState, useEffect, useRef } from "react";
import { ReservationPortalLayout } from "@/components/vendors/reservation-portal-layout";
import { TimePicker } from "@/components/vendors/time-picker";
import {
  Clock,
  Save,
  ArrowLeft,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import {
  createBookingSlot,
  CreateBookingSlotData,
  createRecurringBookingSlot,
  CreateRecurringBookingSlotData,
  RecurrenceRule,
} from "@/lib/bookingSlots";
import { getSections, Section } from "@/lib/sections";

const slotTypes = ["Lunch", "Dinner", "Brunch", "Happy Hour", "Special Event"];
const dayLabels = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

// Date Picker

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function DatePicker({
  value,
  onChange,
  id,
}: {
  value: string;
  onChange: (val: string) => void;
  id?: string;
}) {
  const today = new Date();
  const parseDate = (v: string) => (v ? new Date(v + "T00:00:00") : null);
  const selected = parseDate(value);

  const [viewYear, setViewYear] = useState(
    selected?.getFullYear() ?? today.getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    selected?.getMonth() ?? today.getMonth(),
  );
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDow = new Date(viewYear, viewMonth, 1).getDay();

  const selectDay = (day: number) => {
    const m = String(viewMonth + 1).padStart(2, "0");
    const d = String(day).padStart(2, "0");
    onChange(`${viewYear}-${m}-${d}`);
    setOpen(false);
  };

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const displayValue = selected
    ? selected.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "Select date";

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  const isSelected = (day: number) =>
    selected &&
    selected.getDate() === day &&
    selected.getMonth() === viewMonth &&
    selected.getFullYear() === viewYear;

  return (
    <div className="relative" ref={ref}>
      <button
        id={id}
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-sm font-poppins transition-all
          ${open ? "border-black ring-2 ring-black/10" : "border-gray-300 hover:border-gray-400"}
          bg-white text-gray-900`}
      >
        <span className={value ? "text-gray-900" : "text-gray-400"}>
          {displayValue}
        </span>
        <Calendar className="h-4 w-4 text-gray-400 shrink-0" />
      </button>

      {open && (
        <div className="absolute z-50 mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl p-4 w-72">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronLeft className="h-4 w-4 text-gray-600" />
            </button>
            <span className="font-semibold text-sm font-poppins text-gray-900">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChevronRight className="h-4 w-4 text-gray-600" />
            </button>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 mb-1">
            {DOW.map((d) => (
              <div
                key={d}
                className="text-center text-[10px] font-semibold text-gray-400 font-poppins py-1 uppercase tracking-wide"
              >
                {d}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-y-1">
            {Array.from({ length: firstDow }).map((_, i) => (
              <div key={`empty-${i}`} />
            ))}
            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
              <button
                key={day}
                type="button"
                onClick={() => selectDay(day)}
                className={`aspect-square flex items-center justify-center rounded-lg text-sm font-poppins transition-all
                  ${
                    isSelected(day)
                      ? "bg-black text-white font-semibold"
                      : isToday(day)
                        ? "border border-black text-black font-semibold hover:bg-gray-50"
                        : "text-gray-700 hover:bg-gray-100"
                  }`}
              >
                {day}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
            <button
              type="button"
              onClick={() => {
                const t = new Date();
                setViewYear(t.getFullYear());
                setViewMonth(t.getMonth());
                const m = String(t.getMonth() + 1).padStart(2, "0");
                const d = String(t.getDate()).padStart(2, "0");
                onChange(`${t.getFullYear()}-${m}-${d}`);
                setOpen(false);
              }}
              className="text-xs font-poppins font-medium text-gray-500 hover:text-black transition-colors"
            >
              Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Main Page
export default function CreateBookingSlotPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurrenceType, setRecurrenceType] = useState<
    "weekly" | "monthly_date"
  >("weekly");
  const [selectedDays, setSelectedDays] = useState<number[]>([1]);
  const [monthDay, setMonthDay] = useState<string>("15");

  const [formData, setFormData] = useState({
    slotName: "",
    slotType: "",
    date: "",
    rangeStart: "",
    rangeEnd: "",
    startTime: "",
    endTime: "",
    sectionId: "",
    description: "",
    maxBookings: "",
  });

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      setIsLoading(true);
      const response = await getSections(true);
      if (response.success) setSections(response.data);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to fetch sections",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.slotType ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.sectionId ||
      !formData.maxBookings
    ) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      if (isRecurring) {
        if (!formData.rangeStart || !formData.rangeEnd) {
          toast({
            title: "Validation Error",
            description: "Please specify the range start and end dates",
            variant: "destructive",
          });
          return;
        }

        let recurrence: RecurrenceRule;
        if (recurrenceType === "weekly") {
          if (selectedDays.length === 0) {
            toast({
              title: "Validation Error",
              description:
                "Please select at least one day for weekly recurrence",
              variant: "destructive",
            });
            return;
          }
          recurrence = { type: "weekly", days: selectedDays };
        } else {
          const day = parseInt(monthDay);
          if (isNaN(day) || day < 1 || day > 31) {
            toast({
              title: "Validation Error",
              description: "Please enter a valid day (1-31)",
              variant: "destructive",
            });
            return;
          }
          recurrence = { type: "monthly_date", monthDay: day };
        }

        const recurringData: CreateRecurringBookingSlotData = {
          slotType: formData.slotType,
          startTime: formData.startTime,
          endTime: formData.endTime,
          sectionId: formData.sectionId,
          recurrence,
          rangeStart: formData.rangeStart,
          rangeEnd: formData.rangeEnd,
          maxBookings: parseInt(formData.maxBookings),
          ...(formData.slotName && { slotName: formData.slotName }),
          ...(formData.description && { description: formData.description }),
        };

        const response = await createRecurringBookingSlot(recurringData);
        if (response.success) {
          toast({
            title: "Success!",
            description: `${response.data?.count || 0} recurring booking slots created successfully`,
          });
          router.push("/vendors/reservation-portal/booking-slots");
        }
      } else {
        if (!formData.date) {
          toast({
            title: "Validation Error",
            description: "Please select a date",
            variant: "destructive",
          });
          return;
        }

        const bookingSlotData: CreateBookingSlotData = {
          slotType: formData.slotType,
          date: formData.date,
          startTime: formData.startTime,
          endTime: formData.endTime,
          sectionId: formData.sectionId,
          maxBookings: parseInt(formData.maxBookings),
          ...(formData.slotName && { slotName: formData.slotName }),
          ...(formData.description && { description: formData.description }),
        };

        const response = await createBookingSlot(bookingSlotData);
        if (response.success) {
          toast({
            title: "Success!",
            description:
              response.message || "Booking slot created successfully",
          });
          router.push("/vendors/reservation-portal/booking-slots");
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create booking slot",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleDay = (day: number) => {
    setSelectedDays((prev) =>
      prev.includes(day)
        ? prev.filter((d) => d !== day)
        : [...prev, day].sort(),
    );
  };

  if (isLoading) {
    return (
      <ReservationPortalLayout pageTitle="Create Booking Slot">
        <div
          className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12"
          style={{ background: "#F0F0EE" }}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-12">
            <div className="flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          </div>
        </div>
      </ReservationPortalLayout>
    );
  }

  return (
    <ReservationPortalLayout pageTitle="Create Booking Slot">
      <div
        className="max-w-4xl mx-auto px-4 py-6 sm:px-6 sm:py-8 lg:py-12"
        style={{ background: "#F0F0EE" }}
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-4 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  router.push("/vendors/reservation-portal/booking-slots")
                }
                className="font-poppins"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
            </div>
            <h2 className="font-poppins font-bold text-2xl tracking-tight text-gray-900 mb-2">
              Create Booking Slot
            </h2>
            <p className="font-poppins text-sm text-gray-500">
              Define a new time slot for accepting reservations
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Booking Type Dropdown */}
              <div className="space-y-2">
                <Label
                  htmlFor="bookingType"
                  className="font-poppins font-medium"
                >
                  Booking Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={isRecurring ? "recurring" : "single"}
                  onValueChange={(value) =>
                    setIsRecurring(value === "recurring")
                  }
                >
                  <SelectTrigger className="font-poppins h-10 text-base">
                    <SelectValue placeholder="Select booking type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single" className="font-poppins">
                      Single Slot (One specific date)
                    </SelectItem>
                    <SelectItem value="recurring" className="font-poppins">
                      Recurring Slots (Repeat on a schedule)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Slot Name */}
              <div className="space-y-2">
                <Label htmlFor="slotName" className="font-poppins font-medium">
                  Slot Name <span className="text-gray-400">(Optional)</span>
                </Label>
                <Input
                  id="slotName"
                  type="text"
                  value={formData.slotName}
                  onChange={(e) => handleChange("slotName", e.target.value)}
                  placeholder="e.g., Friday Night Special"
                  className="font-poppins"
                />
              </div>

              {/* ── Slot Type ────────────────────────────────────── */}
              <div className="space-y-2">
                <Label htmlFor="slotType" className="font-poppins font-medium">
                  Slot Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.slotType}
                  onValueChange={(value) => handleChange("slotType", value)}
                >
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Select slot type" />
                  </SelectTrigger>
                  <SelectContent>
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

              {/* Single Date */}
              {!isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-poppins font-medium">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <DatePicker
                    id="date"
                    value={formData.date}
                    onChange={(val) => handleChange("date", val)}
                  />
                </div>
              )}

              {/* Date Range */}
              {isRecurring && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="rangeStart"
                        className="font-poppins font-medium"
                      >
                        <Calendar className="inline h-4 w-4 mr-2" />
                        Start Date <span className="text-red-500">*</span>
                      </Label>
                      <DatePicker
                        id="rangeStart"
                        value={formData.rangeStart}
                        onChange={(val) => handleChange("rangeStart", val)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="rangeEnd"
                        className="font-poppins font-medium"
                      >
                        <Calendar className="inline h-4 w-4 mr-2" />
                        End Date <span className="text-red-500">*</span>
                      </Label>
                      <DatePicker
                        id="rangeEnd"
                        value={formData.rangeEnd}
                        onChange={(val) => handleChange("rangeEnd", val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Recurrence Pattern */}
              {isRecurring && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="space-y-2">
                    <Label
                      htmlFor="recurrenceType"
                      className="font-poppins font-medium"
                    >
                      Repeat <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={recurrenceType}
                      onValueChange={(value: any) => setRecurrenceType(value)}
                    >
                      <SelectTrigger className="font-poppins">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="weekly" className="font-poppins">
                          Weekly
                        </SelectItem>
                        <SelectItem
                          value="monthly_date"
                          className="font-poppins"
                        >
                          Monthly (by Date)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Weekly — day buttons */}
                  {recurrenceType === "weekly" && (
                    <div className="space-y-3">
                      <Label className="font-poppins font-medium">
                        Days of Week <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                        {dayLabels.map((label, index) => {
                          const active = selectedDays.includes(index);
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => toggleDay(index)}
                              className={`
                                relative flex flex-col items-center justify-center rounded-xl py-2.5 px-1
                                font-poppins text-xs font-semibold tracking-wide transition-all duration-150
                                select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-black/40
                                ${
                                  active
                                    ? "bg-black text-white shadow-md shadow-black/20 scale-[1.03]"
                                    : "bg-white border border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-800 hover:shadow-sm"
                                }
                              `}
                            >
                              <span className="text-[11px]">
                                {label.substring(0, 3).toUpperCase()}
                              </span>
                              {active && (
                                <span className="absolute bottom-1 w-1 h-1 rounded-full bg-white/60" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Monthly */}
                  {recurrenceType === "monthly_date" && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="monthDay"
                        className="font-poppins font-medium"
                      >
                        Day of Month <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="monthDay"
                        type="number"
                        min="1"
                        max="31"
                        value={monthDay}
                        onChange={(e) => setMonthDay(e.target.value)}
                        placeholder="1-31"
                        className="font-poppins"
                      />
                      <p className="text-xs text-gray-600 font-poppins">
                        Slot will repeat on this day of each month within the
                        range
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Time Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="startTime"
                    className="font-poppins font-medium"
                  >
                    <Clock className="inline h-4 w-4 mr-2" />
                    Start Time <span className="text-red-500">*</span>
                  </Label>
                  <TimePicker
                    id="startTime"
                    value={formData.startTime}
                    onChange={(val) => {
                      setFormData((prev) => ({
                        ...prev,
                        startTime: val,
                        endTime:
                          prev.endTime && prev.endTime <= val ? "" : prev.endTime,
                      }));
                    }}
                    placeholder="Select start time"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime" className="font-poppins font-medium">
                    <Clock className="inline h-4 w-4 mr-2" />
                    End Time <span className="text-red-500">*</span>
                  </Label>
                  <TimePicker
                    id="endTime"
                    value={formData.endTime}
                    onChange={(val) => handleChange("endTime", val)}
                    minTime={formData.startTime || undefined}
                    placeholder="Select end time"
                  />
                </div>
              </div>

              {/* Section */}
              <div className="space-y-2">
                <Label htmlFor="sectionId" className="font-poppins font-medium">
                  Section <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.sectionId}
                  onValueChange={(value) => handleChange("sectionId", value)}
                >
                  <SelectTrigger className="font-poppins">
                    <SelectValue placeholder="Select a section" />
                  </SelectTrigger>
                  <SelectContent>
                    {sections.length === 0 ? (
                      <div className="p-2 text-sm text-gray-500 font-poppins">
                        No active sections available
                      </div>
                    ) : (
                      sections.map((section) => (
                        <SelectItem
                          key={section._id}
                          value={section._id}
                          className="font-poppins"
                        >
                          {section.sectionName} ({section.sectionType})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 font-poppins">
                  Select which section this booking slot applies to
                </p>
              </div>

              {/* Max Bookings */}
              <div className="space-y-2">
                <Label
                  htmlFor="maxBookings"
                  className="font-poppins font-medium"
                >
                  Maximum Bookings <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="maxBookings"
                  type="number"
                  min="1"
                  value={formData.maxBookings}
                  onChange={(e) => handleChange("maxBookings", e.target.value)}
                  placeholder="Enter maximum number of bookings"
                  className="font-poppins"
                  required
                />
                <p className="text-xs text-gray-500 font-poppins">
                  {isRecurring
                    ? "Maximum number of reservations allowed per slot"
                    : "Maximum number of reservations allowed for this slot"}
                </p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label
                  htmlFor="description"
                  className="font-poppins font-medium"
                >
                  Description <span className="text-gray-400">(Optional)</span>
                </Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleChange("description", e.target.value)}
                  placeholder="Add any additional details about this booking slot..."
                  className="w-full min-h-24 px-3 py-2 border border-gray-300 rounded-lg font-poppins text-sm focus:outline-none focus:ring-2 focus:ring-black"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    router.push("/vendors/reservation-portal/booking-slots")
                  }
                  className="font-poppins"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="font-poppins bg-black hover:bg-gray-800"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Create Booking {isRecurring ? "Series" : "Slot"}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </ReservationPortalLayout>
  );
}
