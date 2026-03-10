"use client";

import { useRouter, usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlatformSwitcher } from "./platform-switcher";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { platforms } from "@/data/platforms";

export function AppSidebar(props) {
  const router = useRouter();
  const pathname = usePathname();

  const activePlatformId =
    platforms.find((p) => pathname.includes(`/dashboard/${p.id}`))?.id ||
    "instagram";

  const activePlatform = platforms.find((p) => p.id === activePlatformId);

  const handlePlatformSelect = (platformId) => {
    router.push(`/dashboard/${platformId}`);
  };

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <PlatformSwitcher
              platforms={platforms}
              activePlatform={activePlatformId}
              onSelect={handlePlatformSelect}
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {activePlatform && (
          <NavMain
            sections={activePlatform.sections}
            platformId={activePlatformId}
          />
        )}
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <NavUser />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
