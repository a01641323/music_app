"use client";

import { DateRangeProvider } from "@/context/date-range-context";
import { PlatformTabNavigation } from "@/components/layout/platform-tab-navigation";
import { DateRangeFilter } from "@/components/layout/date-range-filter";

const tabs = [
  { name: "Overview", path: "overview" },
  { name: "Audience", path: "audience" },
];

// Explicit Tailwind classes matching the same visual treatment as TikTok/Spotify tabs,
// using Instagram's emerald palette (#00c896 / #00ffbe).
const igActiveClass =
  "bg-[rgba(225,48,108,0.13)] text-[#E1306C] border border-[rgba(225,48,108,0.4)] [text-shadow:0_0_12px_rgba(131,58,180,0.5)]";
const igInactiveClass =
  "text-[rgba(225,48,108,0.5)] border border-transparent hover:text-[#833AB4] hover:bg-[rgba(225,48,108,0.06)]";

export default function InstagramLayout({ children }) {
  return (
    <DateRangeProvider>
      <div data-platform="instagram">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2">
          <PlatformTabNavigation
            tabs={tabs}
            platformId="instagram"
            activeClass={igActiveClass}
            inactiveClass={igInactiveClass}
          />
          <DateRangeFilter />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </DateRangeProvider>
  );
}
