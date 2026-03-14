"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { name: "Overview", path: "overview" },
  { name: "Posts", path: "posts" },
  { name: "Reels", path: "reels" },
  { name: "Stories", path: "stories" },
  { name: "Audience", path: "audience" },
];

export function TabNavigation() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 bg-[rgba(255,255,255,0.03)] p-1 rounded-lg overflow-x-auto scrollbar-none">
      {tabs.map((tab) => {
        const href = `/dashboard/instagram/${tab.path}`;
        const isActive = pathname.endsWith(`/${tab.path}`);

        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "px-4 py-2 text-sm font-medium transition-all duration-200 rounded-md whitespace-nowrap shrink-0",
              isActive
                ? "bg-[#00c896] text-white shadow-[0_0_12px_rgba(0,255,190,0.2)]"
                : "text-[#5a8a7a] hover:text-[#00ffbe] hover:bg-[rgba(0,200,150,0.05)]"
            )}
          >
            {tab.name}
          </Link>
        );
      })}
    </nav>
  );
}
