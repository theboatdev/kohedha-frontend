"use client";

import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CompactTimePickerProps = {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string;
  disabled?: boolean;
};

const HOURS = Array.from({ length: 24 }, (_, i) =>
  i.toString().padStart(2, "0"),
);
const MINUTES = Array.from({ length: 12 }, (_, i) =>
  (i * 5).toString().padStart(2, "0"),
);

function parseTime(value?: string): { hour: string; minute: string } {
  const match = value?.match(/^(\d{1,2}):(\d{2})/);
  if (!match) return { hour: "", minute: "" };
  return {
    hour: match[1].padStart(2, "0"),
    minute: match[2],
  };
}

export function CompactTimePicker({
  value,
  onChange,
  placeholder = "Select time",
  className,
  id,
  disabled = false,
}: CompactTimePickerProps) {
  const { hour, minute } = parseTime(value);
  const display = hour && minute ? `${hour}:${minute}` : "";

  const minuteOptions =
    minute && !MINUTES.includes(minute)
      ? [...MINUTES, minute].sort()
      : MINUTES;

  const commit = (nextHour: string, nextMinute: string) => {
    onChange(`${nextHour || "00"}:${nextMinute || "00"}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          disabled={disabled}
          className={cn(
            "h-10 w-full justify-start text-left font-poppins font-normal rounded-md border-gray-300 bg-white hover:bg-white hover:border-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            !display && "text-gray-400",
            className,
          )}
        >
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          {display || <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-4 space-y-4">
          <div className="flex items-center gap-2">
            <Select
              value={hour || undefined}
              onValueChange={(nextHour) => commit(nextHour, minute)}
            >
              <SelectTrigger className="w-20 font-poppins">
                <SelectValue placeholder="HH" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {HOURS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-xl font-bold">:</span>
            <Select
              value={minute || undefined}
              onValueChange={(nextMinute) => commit(hour, nextMinute)}
            >
              <SelectTrigger className="w-20 font-poppins">
                <SelectValue placeholder="MM" />
              </SelectTrigger>
              <SelectContent className="max-h-[200px]">
                {minuteOptions.map((item) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-xs text-gray-500 font-poppins">
            Time in 24-hour format
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
