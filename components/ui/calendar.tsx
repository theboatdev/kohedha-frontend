"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { DayPicker } from "react-day-picker"

import { cn } from "@/lib/utils"

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      // "relative" is the anchor for the nav, which v9 renders as a sibling of
      // <months> at the root level — so absolute buttons position correctly here.
      className={cn("relative p-4 select-none", className)}
      classNames={{
        // ── Layout ──────────────────────────────────────────────────────────
        months: "flex flex-col sm:flex-row gap-4",
        month: "flex flex-col gap-3",
        // The caption only needs to center the label; the nav floats over it.
        month_caption: "flex justify-center items-center h-9",
        caption_label: "text-sm font-semibold text-gray-900 tracking-tight",

        // ── Navigation (absolutely positioned over the caption row) ─────────
        // pointer-events-none on the wrapper, pointer-events-auto on the
        // individual buttons so the label stays clickable / selectable.
        nav: "absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none",
        button_previous:
          "h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-500 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-gray-50 hover:border-gray-300 transition-all pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
        button_next:
          "h-8 w-8 rounded-md border border-gray-200 bg-white text-gray-500 flex items-center justify-center opacity-70 hover:opacity-100 hover:bg-gray-50 hover:border-gray-300 transition-all pointer-events-auto focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",

        // ── Grid ────────────────────────────────────────────────────────────
        month_grid: "w-full border-collapse",
        weekdays: "flex mb-1",
        weekday:
          "w-9 text-center text-[0.7rem] font-semibold text-gray-400 uppercase tracking-wider pb-1",
        week: "flex w-full",
        day: "relative h-9 w-9 text-center text-sm p-0 focus-within:z-20",

        // The actual <button> inside each cell
        day_button:
          "h-9 w-9 rounded-lg p-0 text-sm text-gray-700 font-normal hover:bg-gray-100 hover:text-gray-900 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-0 aria-selected:opacity-100",

        // ── Day states ───────────────────────────────────────────────────────
        // Today: soft blue pill so it always stands out
        today:
          "bg-blue-50 text-blue-600 font-semibold rounded-lg ring-1 ring-inset ring-blue-200",
        // Selected: dark background (overrides today with !)
        selected:
          "!bg-gray-900 !text-white hover:!bg-gray-800 rounded-lg",
        // Range
        range_start: "rounded-l-lg",
        range_end: "rounded-r-lg",
        range_middle:
          "aria-selected:bg-blue-50 aria-selected:text-gray-900 aria-selected:rounded-none",
        // Faded states
        outside: "text-gray-300 opacity-40",
        disabled: "text-gray-300 opacity-40 cursor-not-allowed",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation }) =>
          orientation === "left" ? (
            <ChevronLeft className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          ),
      }}
      {...props}
    />
  )
}
Calendar.displayName = "Calendar"

export { Calendar }
