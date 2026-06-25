"use client";

import { useState, useEffect } from "react";
import { ReservationPortalLayout } from "@/components/vendors/reservation-portal-layout";
import { TimePicker } from "@/components/vendors/time-picker";
import { Clock, Save, ArrowLeft, Calendar, Users, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter, useParams } from "next/navigation";
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
  getBookingSlotById,
  updateBookingSlot,
  UpdateBookingSlotData,
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

export default function EditBookingSlotPage() {
  const router = useRouter();
  const params = useParams();
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
    isActive: true,
  });

  // Fetch sections and booking slot data on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch sections
        const sectionsResponse = await getSections(true);
        if (sectionsResponse.success) {
          setSections(sectionsResponse.data);
        }

        // Fetch booking slot data
        const slotId = params.id as string;
        const slotResponse = await getBookingSlotById(slotId);

        if (slotResponse.success) {
          const slot = slotResponse.data;

          const recurring = !!slot.isRecurring;
          setIsRecurring(recurring);

          // Initialize recurrence state from the loaded slot rule
          if (recurring && slot.recurrenceRule) {
            const rule = slot.recurrenceRule;
            if (rule.type === "weekly" && "days" in rule) {
              setRecurrenceType("weekly");
              setSelectedDays(rule.days);
            } else if (rule.type === "monthly_date" && "monthDay" in rule) {
              setRecurrenceType("monthly_date");
              setMonthDay(rule.monthDay.toString());
            }
          }

          // Format date fields
          const formatDate = (val: string | null | undefined) => {
            if (!val) return "";
            const d = new Date(val);
            if (isNaN(d.getTime())) return "";
            return d.toISOString().split("T")[0];
          };

          setFormData({
            slotName: slot.slotName || "",
            slotType: slot.slotType,
            date: recurring ? "" : formatDate(slot.date),
            rangeStart: recurring ? formatDate(slot.dateRange?.start) : "",
            rangeEnd: recurring ? formatDate(slot.dateRange?.end ?? "") : "",
            startTime: slot.startTime,
            endTime: slot.endTime,
            sectionId:
              typeof slot.sectionId === "object"
                ? slot.sectionId._id
                : slot.sectionId,
            description: "",
            maxBookings: slot.maxBookings ? slot.maxBookings.toString() : "",
            isActive: slot.isActive,
          });
        }
      } catch (error: any) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to load booking slot data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.slotType ||
      (!isRecurring && !formData.date) ||
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

      const updateData: UpdateBookingSlotData = {
        slotType: formData.slotType,
        startTime: formData.startTime,
        endTime: formData.endTime,
        sectionId: formData.sectionId,
        isActive: formData.isActive,
        maxBookings: parseInt(formData.maxBookings),
        ...(formData.slotName && { slotName: formData.slotName }),
        ...(formData.description && { description: formData.description }),
        // Single-date slots: send `date`; recurring: send `dateRange` + `recurrenceRule`
        ...(!isRecurring
          ? { date: formData.date }
          : {
              dateRange: {
                start: formData.rangeStart || undefined,
                end: formData.rangeEnd || null,
              },
              recurrenceRule: (recurrenceType === "weekly"
                ? { type: "weekly" as const, days: selectedDays }
                : {
                    type: "monthly_date" as const,
                    monthDay: parseInt(monthDay),
                  }) as RecurrenceRule,
            }),
      };

      const slotId = params.id as string;
      const response = await updateBookingSlot(slotId, updateData);

      if (response.success) {
        toast({
          title: "Success!",
          description: response.message || "Booking slot updated successfully",
          variant: "default",
        });
        router.push("/vendors/reservation-portal/booking-slots");
      }
    } catch (error: any) {
      console.error("Error updating booking slot:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update booking slot",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string | boolean) => {
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
      <ReservationPortalLayout pageTitle="Edit Booking Slot">
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
    <ReservationPortalLayout pageTitle="Edit Booking Slot">
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
              Edit Booking Slot
            </h2>
            <p className="font-poppins text-sm text-gray-500">
              Update booking slot details
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Slot Name (Optional) */}
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

              {/* Slot Type */}
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

              {/* Date — single-date slot */}
              {!isRecurring && (
                <div className="space-y-2">
                  <Label htmlFor="date" className="font-poppins font-medium">
                    <Calendar className="inline h-4 w-4 mr-2" />
                    Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleChange("date", e.target.value)}
                    className="font-poppins"
                    required
                  />
                </div>
              )}

              {/* Date range — recurring slot */}
              {isRecurring && (
                <div className="space-y-4">
                  {/* Date range */}
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label
                          htmlFor="rangeStart"
                          className="font-poppins font-medium"
                        >
                          <Calendar className="inline h-4 w-4 mr-2" />
                          Start Date
                        </Label>
                        <Input
                          id="rangeStart"
                          type="date"
                          value={formData.rangeStart}
                          onChange={(e) =>
                            handleChange("rangeStart", e.target.value)
                          }
                          className="font-poppins"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label
                          htmlFor="rangeEnd"
                          className="font-poppins font-medium"
                        >
                          <Calendar className="inline h-4 w-4 mr-2" />
                          End Date{" "}
                          <span className="text-gray-400">
                            (leave blank for ongoing)
                          </span>
                        </Label>
                        <Input
                          id="rangeEnd"
                          type="date"
                          value={formData.rangeEnd}
                          onChange={(e) =>
                            handleChange("rangeEnd", e.target.value)
                          }
                          className="font-poppins"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Recurrence Pattern — editable */}
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

              {/* Maximum Bookings (Required) */}
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
                  Maximum number of reservations allowed for this slot
                </p>
              </div>

              {/* Description (Optional) */}
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

              {/* Active Status */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="space-y-0.5">
                  <Label
                    htmlFor="isActive"
                    className="font-poppins font-medium"
                  >
                    Active Status
                  </Label>
                  <p className="text-sm text-gray-500 font-poppins">
                    Enable this slot for accepting reservations
                  </p>
                </div>
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    handleChange("isActive", checked)
                  }
                />
              </div>

              {/* Action Buttons */}
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
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Booking Slot
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
