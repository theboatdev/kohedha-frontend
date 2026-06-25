"use client";

import { useMemo, useRef, useEffect, useState } from "react";
import { Clock, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  formatTime12Hour,
  generateTimeSlots,
} from "@/lib/publicBooking";

type TimePickerProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  minTime?: string;
  maxTime?: string;
  intervalMinutes?: number;
  disabled?: boolean;
  className?: string;
};

const ALL_DAY_SLOTS = generateTimeSlots("00:00", "23:45", 15);

export function TimePicker({
  value,
  onChange,
  id,
  placeholder = "Select time",
  minTime,
  maxTime,
  intervalMinutes = 15,
  disabled = false,
  className,
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLButtonElement>(null);

  const timeOptions = useMemo(() => {
    const slots =
      intervalMinutes === 15
        ? ALL_DAY_SLOTS
        : generateTimeSlots("00:00", "23:45", intervalMinutes);

    return slots.filter((time) => {
      if (minTime && time <= minTime) return false;
      if (maxTime && time > maxTime) return false;
      return true;
    });
  }, [intervalMinutes, minTime, maxTime]);

  useEffect(() => {
    if (open && selectedRef.current && listRef.current) {
      selectedRef.current.scrollIntoView({ block: "center" });
    }
  }, [value, open]);

  const handleSelect = (time: string) => {
    onChange(time);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          id={id}
          type="button"
          disabled={disabled}
          className={cn(
            "flex h-10 w-full items-center justify-between rounded-lg border bg-white px-3 py-2 text-sm font-poppins transition-all",
            "border-gray-300 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-black",
            "disabled:cursor-not-allowed disabled:opacity-50",
            className,
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <Clock className="h-4 w-4 shrink-0 text-gray-400" />
            <span className={value ? "text-gray-900" : "text-gray-400"}>
              {value ? formatTime12Hour(value) : placeholder}
            </span>
          </span>
          <ChevronDown className="h-4 w-4 shrink-0 text-gray-400" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        align="start"
        className="w-[var(--radix-popover-trigger-width)] p-0 overflow-hidden"
      >
        <div className="border-b border-gray-100 px-4 py-3">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 font-poppins">
            Pick a time
          </p>
          <p className="mt-0.5 text-base font-semibold text-gray-900 font-poppins tabular-nums">
            {value ? formatTime12Hour(value) : "—"}
          </p>
        </div>

        <div
          ref={listRef}
          className="max-h-56 overflow-y-auto overscroll-contain py-1"
        >
          {timeOptions.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-gray-500 font-poppins">
              No available times
            </p>
          ) : (
            timeOptions.map((time) => {
              const isSelected = value === time;
              return (
                <button
                  key={time}
                  ref={isSelected ? selectedRef : undefined}
                  type="button"
                  onClick={() => handleSelect(time)}
                  className={cn(
                    "flex w-full items-center justify-between px-4 py-2.5 text-sm font-poppins transition-colors",
                    isSelected
                      ? "bg-black text-white"
                      : "text-gray-700 hover:bg-gray-50",
                  )}
                >
                  <span className="font-medium tabular-nums">
                    {formatTime12Hour(time)}
                  </span>
                  <span
                    className={cn(
                      "text-xs tabular-nums",
                      isSelected ? "text-white/60" : "text-gray-400",
                    )}
                  >
                    {time}
                  </span>
                </button>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
