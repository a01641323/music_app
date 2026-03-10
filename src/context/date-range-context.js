"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { subDays } from "date-fns";

const DateRangeContext = createContext(null);

const presets = [
  { label: "7d", value: "7d", days: 7 },
  { label: "30d", value: "30d", days: 30 },
  { label: "90d", value: "90d", days: 90 },
  { label: "1y", value: "1y", days: 365 },
];

export function DateRangeProvider({ children }) {
  const [dateRange, setDateRange] = useState({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [activePreset, setActivePreset] = useState("30d");

  const selectPreset = useCallback((presetValue) => {
    const preset = presets.find((p) => p.value === presetValue);
    if (preset) {
      setDateRange({
        from: subDays(new Date(), preset.days),
        to: new Date(),
      });
      setActivePreset(presetValue);
    }
  }, []);

  const selectCustomRange = useCallback((range) => {
    setDateRange(range);
    setActivePreset("custom");
  }, []);

  return (
    <DateRangeContext.Provider
      value={{
        dateRange,
        activePreset,
        presets,
        selectPreset,
        selectCustomRange,
      }}
    >
      {children}
    </DateRangeContext.Provider>
  );
}

export function useDateRange() {
  const context = useContext(DateRangeContext);
  if (!context) {
    throw new Error("useDateRange must be used within a DateRangeProvider");
  }
  return context;
}
