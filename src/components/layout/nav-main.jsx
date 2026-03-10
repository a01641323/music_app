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
      <SidebarGroupLabel>Analytics</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sections.map((section) => {
            const Icon = iconMap[section.icon];
            const href = `/dashboard/${platformId}/${section.path}`;
            const isActive = pathname.includes(`/${section.path}`);

            return (
              <SidebarMenuItem key={section.path}>
                <SidebarMenuButton asChild isActive={isActive}>
                  <Link href={href}>
                    <Icon className="size-4" />
                    <span>{section.name}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
