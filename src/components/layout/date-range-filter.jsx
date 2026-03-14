"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useDateRange } from "@/context/date-range-context";

export function DateRangeFilter() {
  const { dateRange, activePreset, presets, selectPreset, selectCustomRange } =
    useDateRange();

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-1 bg-[rgba(255,255,255,0.03)] p-1 rounded-lg">
        {presets.map((preset) => (
          <button
            key={preset.value}
            onClick={() => selectPreset(preset.value)}
            className={cn(
              "px-2.5 h-7 text-xs font-medium rounded-md transition-all duration-200",
              activePreset === preset.value
                ? "bg-[#00c896] text-white shadow-[0_0_12px_rgba(0,255,190,0.2)]"
                : "text-[#5a8a7a] hover:text-[#00ffbe] hover:bg-[rgba(0,200,150,0.05)]"
            )}
          >
            {preset.label}
          </button>
        ))}
      </div>
      <Popover>
        <PopoverTrigger
          className={cn(
            buttonVariants({ variant: "outline", size: "sm" }),
            "h-7 justify-start text-left text-xs font-normal border-[rgba(0,122,92,0.3)] hover:border-[rgba(0,255,190,0.3)] hover:bg-[rgba(0,200,150,0.05)]",
            !dateRange && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-1.5 h-3.5 w-3.5" />
          {dateRange?.from ? (
            dateRange.to ? (
              <>
                {format(dateRange.from, "MMM d")} -{" "}
                {format(dateRange.to, "MMM d, yyyy")}
              </>
            ) : (
              format(dateRange.from, "MMM d, yyyy")
            )
          ) : (
            <span>Pick a date</span>
          )}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 glass" align="end">
          <Calendar
            mode="range"
            defaultMonth={dateRange?.from}
            selected={dateRange}
            onSelect={(range) => {
              if (range?.from) {
                selectCustomRange({
                  from: range.from,
                  to: range.to || range.from,
                });
              }
            }}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
