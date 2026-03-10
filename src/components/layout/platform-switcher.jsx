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

import { Badge } from "@/components/ui/badge";

const iconMap = {
  Instagram,
  Music,
  Video,
};

export function PlatformSwitcher({ platforms, activePlatform, onSelect }) {
  const active = platforms.find((p) => p.id === activePlatform);
  const ActiveIcon = active ? iconMap[active.icon] : Instagram;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div
          role="button"
          tabIndex={0}
          data-sidebar="menu-button"
          data-size="lg"
          className="peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-hidden ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]/sidebar:!size-8 group-data-[collapsible=icon]/sidebar:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 h-12 text-sm group-data-[collapsible=icon]/sidebar:!p-0 cursor-pointer data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#833AB4] via-[#E1306C] to-[#FCAF45]">
            <ActiveIcon className="size-4 text-white" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{active?.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              Analytics
            </span>
          </div>
          <ChevronsUpDown className="ml-auto size-4" />
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        {platforms.map((platform) => {
          const Icon = iconMap[platform.icon];
          return (
            <DropdownMenuItem
              key={platform.id}
              onClick={() => platform.connected && onSelect(platform.id)}
              className={
                !platform.connected ? "opacity-50 cursor-not-allowed" : ""
              }
            >
              <div className="flex items-center gap-2">
                <Icon className="size-4" />
                <span>{platform.name}</span>
              </div>
              {!platform.connected && (
                <Badge variant="outline" className="ml-auto text-xs">
                  Soon
                </Badge>
              )}
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
