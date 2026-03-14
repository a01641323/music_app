"use client";

import { DateRangeProvider } from "@/context/date-range-context";
import { PlatformTabNavigation } from "@/components/layout/platform-tab-navigation";
import { DateRangeFilter } from "@/components/layout/date-range-filter";

const tabs = [
  { name: "Overview", path: "overview" },
  { name: "Tracks", path: "tracks" },
  { name: "Audience", path: "audience" },
  { name: "Playlists", path: "playlists" },
];

export default function SpotifyLayout({ children }) {
  return (
    <DateRangeProvider>
      <div data-platform="spotify">
        <div className="flex flex-wrap items-center justify-between gap-2 px-4 pt-2">
          <PlatformTabNavigation tabs={tabs} platformId="spotify" />
          <DateRangeFilter />
        </div>
        <div className="p-4">{children}</div>
      </div>
    </DateRangeProvider>
  );
}
