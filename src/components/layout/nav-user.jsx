"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SidebarMenuButton } from "@/components/ui/sidebar";

export function NavUser() {
  return (
    <SidebarMenuButton size="lg" className="cursor-default">
      <Avatar className="h-8 w-8 rounded-lg">
        <AvatarFallback className="rounded-lg bg-primary/20 text-primary">
          MH
        </AvatarFallback>
      </Avatar>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <span className="truncate font-semibold">Matias Hidalgo</span>
        <span className="truncate text-xs text-muted-foreground">
          @matiashidalgo
        </span>
      </div>
    </SidebarMenuButton>
  );
}
