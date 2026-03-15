"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

/**
 * Generic tab navigation for all platforms.
 * TikTok/Spotify: active/inactive styling comes from [data-platform] CSS in globals.css.
 * Instagram: passes explicit Tailwind classes via activeClass/inactiveClass props
 * to bypass CSS-scoping and guarantee the active state renders.
 */
export function PlatformTabNavigation({ tabs, platformId, activeClass, inactiveClass }) {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 bg-[rgba(255,255,255,0.03)] p-1 rounded-lg overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const href = `/dashboard/${platformId}/${tab.path}`;
        const isActive = pathname.endsWith(`/${tab.path}`);
        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap shrink-0",
              isActive ? (activeClass ?? "tab-active") : (inactiveClass ?? "tab-inactive")
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
