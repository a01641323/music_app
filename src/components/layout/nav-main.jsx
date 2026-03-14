"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Image,
  Film,
  Circle,
  Users,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const iconMap = {
  LayoutDashboard,
  Image,
  Film,
  Circle,
  Users,
};

export function NavMain({ sections, platformId }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-[#5a8a7a]">Analytics</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sections.map((section) => {
            const Icon = iconMap[section.icon];
            const href = `/dashboard/${platformId}/${section.path}`;
            const isActive = pathname.includes(`/${section.path}`);

            return (
              <SidebarMenuItem key={section.path}>
                <SidebarMenuButton
                  render={<Link href={href} />}
                  isActive={isActive}
                  className={isActive ? "border-l-[3px] border-[#00ffbe] bg-[rgba(0,255,190,0.05)]" : ""}
                >
                  <Icon className="size-4" />
                  <span>{section.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
