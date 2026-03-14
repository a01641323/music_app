"use client";

import { DateRangeProvider } from "@/context/date-range-context";
import { TabNavigation } from "@/components/layout/tab-navigation";
import { DateRangeFilter } from "@/components/layout/date-range-filter";

export default function InstagramLayout({ children }) {
  return (
    <DateRangeProvider>
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2">
        <TabNavigation />
        <DateRangeFilter />
      </div>
      <div className="p-4">{children}</div>
    </DateRangeProvider>
  );
}
