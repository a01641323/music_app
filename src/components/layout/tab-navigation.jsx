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
    <nav className="flex gap-1 border-b border-border">
      {tabs.map((tab) => {
        const href = `/dashboard/instagram/${tab.path}`;
        const isActive = pathname.endsWith(`/${tab.path}`);

        return (
          <Link
            key={tab.path}
            href={href}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors relative",
              isActive
                ? "text-foreground"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.name}
            {isActive && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#833AB4] via-[#E1306C] to-[#FCAF45]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
