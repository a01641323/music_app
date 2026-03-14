"use client";

import {
  Instagram,
  Music,
  Video,
  ChevronsUpDown,
  Plus,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const iconMap = { Instagram, Music, Video };

// Per-platform icon badge gradient
const platformGradient = {
  instagram: "from-[#833AB4] via-[#E1306C] to-[#FCAF45]",
  tiktok: "from-[#010101] via-[#fe2c55] to-[#25f4ee]",
  spotify: "from-[#1db954] to-[#1ed760]",
};

export function PlatformSwitcher({ platforms, activePlatform, onSelect }) {
  const active = platforms.find((p) => p.id === activePlatform);
  const ActiveIcon = active ? iconMap[active.icon] : Instagram;
  const gradient = platformGradient[activePlatform] || platformGradient.instagram;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground data-[popup-open]:bg-sidebar-accent data-[popup-open]:text-sidebar-accent-foreground group-data-[collapsible=icon]/sidebar:!size-8 group-data-[collapsible=icon]/sidebar:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-12 cursor-pointer">
        <div className={`flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br ${gradient}`}>
          <ActiveIcon className="size-4 text-white" />
        </div>
        <div className="grid flex-1 text-left text-sm leading-tight">
          <span className="truncate font-semibold">{active?.name}</span>
          <span className="truncate text-xs text-muted-foreground">Analytics</span>
        </div>
        <ChevronsUpDown className="ml-auto size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        {platforms.map((platform) => {
          const Icon = iconMap[platform.icon];
          const grad = platformGradient[platform.id] || platformGradient.instagram;
          return (
            <DropdownMenuItem
              key={platform.id}
              onClick={() => onSelect(platform.id)}
              className={platform.id === activePlatform ? "bg-accent" : ""}
            >
              <div className="flex items-center gap-2">
                <div className={`flex aspect-square size-5 items-center justify-center rounded bg-gradient-to-br ${grad}`}>
                  <Icon className="size-3 text-white" />
                </div>
                <span>{platform.name}</span>
              </div>
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem disabled className="opacity-50">
          <Plus className="size-4 mr-2" />
          Connect Platform
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
