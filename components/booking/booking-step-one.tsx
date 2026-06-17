"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Users, Clock, Calendar } from "lucide-react";
import {
  getAvailableTables,
  getAvailableDates,
  generateTimeSlots,
  formatTime12Hour,
  type BookingSlotDetails,
  type Table,
} from "@/lib/publicBooking";

interface BookingStepOneProps {
  bookingSlot: BookingSlotDetails;
  token: string;
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
  numberOfGuests: number;
  setNumberOfGuests: (value: number) => void;
  selectedStartTime: string;
  setSelectedStartTime: (value: string) => void;
  selectedEndTime: string;
  setSelectedEndTime: (value: string) => void;
  selectedTable: string | null;
  setSelectedTable: (value: string | null) => void;
  onNext: () => void;
}

export function BookingStepOne({
  bookingSlot,
  token,
  selectedDate,
  setSelectedDate,
  numberOfGuests,
  setNumberOfGuests,
  selectedStartTime,
  setSelectedStartTime,
  selectedEndTime,
  setSelectedEndTime,
  selectedTable,
  setSelectedTable,
  onNext,
}: BookingStepOneProps) {
  const [availableTables, setAvailableTables] = useState<Table[]>([]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);
  const [loadingDates, setLoadingDates] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const timeSlots = generateTimeSlots(
    bookingSlot.timeWindow.start,
    bookingSlot.timeWindow.end,
    30,
  );

  // Fetch available dates for recurring slots
  useEffect(() => {
    if (bookingSlot.isRecurring) {
      fetchAvailableDates();
    }
  }, [bookingSlot.isRecurring]);

  // Fetch tables whenever time or date changes
  useEffect(() => {
    if (selectedStartTime && selectedEndTime) {
      // For recurring slots, also require a selected date
      if (bookingSlot.isRecurring && !selectedDate) return;
      fetchAvailableTables();
    }
  }, [selectedStartTime, selectedEndTime, numberOfGuests, selectedDate]);

  const fetchAvailableDates = async () => {
    try {
      setLoadingDates(true);
      const dates = await getAvailableDates(token, 90);
      setAvailableDates(dates);
    } catch (err: any) {
      setError(err.message || "Failed to load available dates");
    } finally {
      setLoadingDates(false);
    }
  };

  const fetchAvailableTables = async () => {
    if (!selectedStartTime || !selectedEndTime) return;

    try {
      setLoading(true);
      setError(null);
      setSelectedTable(null);

      const dateStr = selectedDate
        ? selectedDate.toISOString().split("T")[0]
        : undefined;

      const tables = await getAvailableTables(
        token,
        selectedStartTime,
        selectedEndTime,
        numberOfGuests,
        dateStr,
      );
      setAvailableTables(tables);

      if (tables.length === 0) {
        setError(
          "No tables available for the selected time. Please choose a different time.",
        );
      }
    } catch (err: any) {
      setError(err.message);
      setAvailableTables([]);
    } finally {
      setLoading(false);
    }
  };

  // Reset times and table when date changes
  const handleDateChange = (dateStr: string) => {
    setSelectedDate(new Date(dateStr));
    setSelectedStartTime("");
    setSelectedEndTime("");
    setSelectedTable(null);
    setAvailableTables([]);
    setError(null);
  };

  const formatDateOption = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const selectedDateStr = selectedDate
    ? selectedDate.toISOString().split("T")[0]
    : "";

  const canProceed =
    selectedStartTime &&
    selectedEndTime &&
    selectedTable &&
    (!bookingSlot.isRecurring || selectedDate);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-playfair font-bold text-gray-900 mb-2">
          Select Your Table
        </h2>
        <p className="text-gray-600 font-poppins">
          {bookingSlot.isRecurring
            ? "Choose a date, time, and table for your reservation"
            : `Choose your preferred time and table for ${new Date(bookingSlot.date!).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}`}
        </p>
      </div>

      {/* Date Dropdown — only for recurring slots */}
      {bookingSlot.isRecurring && (
        <div>
          <Label className="text-base font-poppins font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Select Date
          </Label>
          {loadingDates ? (
            <div className="flex items-center gap-2 py-3">
              <Loader2 className="w-5 h-5 animate-spin text-gray-500" />
              <span className="text-sm text-gray-500 font-poppins">
                Loading available dates...
              </span>
            </div>
          ) : (
            <Select value={selectedDateStr} onValueChange={handleDateChange}>
              <SelectTrigger className="w-full font-poppins">
                <SelectValue placeholder="Pick an available date" />
              </SelectTrigger>
              <SelectContent>
                {availableDates.map((dateStr) => (
                  <SelectItem key={dateStr} value={dateStr}>
                    {formatDateOption(dateStr)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      )}

      {/* Only show the rest once a date is chosen (or for single-date slots) */}
      {(!bookingSlot.isRecurring || selectedDate) && (
        <>
          {/* Number of Guests */}
          <div>
            <Label className="text-base font-poppins font-medium mb-3 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Number of Guests
            </Label>
            <Select
              value={numberOfGuests.toString()}
              onValueChange={(value) => setNumberOfGuests(parseInt(value))}
            >
              <SelectTrigger className="w-full font-poppins">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                  <SelectItem key={num} value={num.toString()}>
                    {num} {num === 1 ? "Guest" : "Guests"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Time Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-base font-poppins font-medium mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Start Time
              </Label>
              <Select
                value={selectedStartTime}
                onValueChange={setSelectedStartTime}
              >
                <SelectTrigger className="w-full font-poppins">
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.slice(0, -1).map((time) => (
                    <SelectItem key={time} value={time}>
                      {formatTime12Hour(time)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-base font-poppins font-medium mb-3 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                End Time
              </Label>
              <Select
                value={selectedEndTime}
                onValueChange={setSelectedEndTime}
                disabled={!selectedStartTime}
              >
                <SelectTrigger className="w-full font-poppins">
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots
                    .filter((time) => time > selectedStartTime)
                    .map((time) => (
                      <SelectItem key={time} value={time}>
                        {formatTime12Hour(time)}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Available Tables */}
          {selectedStartTime && selectedEndTime && (
            <div>
              <Label className="text-base font-poppins font-medium mb-3 block">
                Available Tables
              </Label>

              {loading && (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-black" />
                </div>
              )}

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-700 font-poppins text-sm">{error}</p>
                </div>
              )}

              {!loading && !error && availableTables.length > 0 && (
                <RadioGroup
                  value={selectedTable || ""}
                  onValueChange={setSelectedTable}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableTables.map((table) => (
                      <div key={table._id} className="relative">
                        <RadioGroupItem
                          value={table._id}
                          id={table._id}
                          className="peer sr-only"
                        />
                        <Label
                          htmlFor={table._id}
                          className="flex items-center justify-between p-4 border-2 border-gray-200 rounded-lg cursor-pointer transition-all hover:border-gray-300 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gray-900 rounded flex items-center justify-center">
                              <span className="text-white font-bold font-poppins">
                                {table.tableNumber}
                              </span>
                            </div>
                            <div>
                              <p className="font-poppins font-semibold text-gray-900">
                                Table {table.tableNumber}
                              </p>
                              <p className="text-sm text-gray-600 font-poppins">
                                Seats {table.seatingCapacity}
                              </p>
                            </div>
                          </div>
                          <div className="w-5 h-5 border-2 border-gray-300 rounded-full peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-black flex items-center justify-center">
                            {selectedTable === table._id && (
                              <div className="w-2 h-2 bg-white rounded-full" />
                            )}
                          </div>
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </div>
          )}
        </>
      )}

      {/* Next Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={onNext}
          disabled={!canProceed}
          className="px-8 font-poppins"
          size="lg"
        >
          Continue to Details
        </Button>
      </div>
    </div>
  );
}
