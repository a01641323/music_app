"use client";

import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { Separator } from "@/components/ui/separator";
import { BackgroundAmbient } from "@/components/layout/background-ambient";
import { EqualizerBars } from "@/components/layout/equalizer-bars";
import { TypeAnimation } from "react-type-animation";

export default function DashboardLayout({ children }) {
  return (
    <SidebarProvider className="relative z-[1]">
      <AppSidebar />
      <SidebarInset>
        <BackgroundAmbient />
        <header className="relative z-10 flex h-16 shrink-0 items-center gap-3 border-b border-border px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 !h-4" />
          <div className="flex items-center gap-3">
            <h1
              className="text-xl font-bold text-gradient"
              style={{ fontFamily: "var(--font-display), serif" }}
            >
              Analytics
            </h1>
            <EqualizerBars />
          </div>
          <div className="ml-3 text-xs text-muted-foreground">
            <TypeAnimation
              sequence={[
                "Your music, your numbers",
                3000,
                "Track what matters",
                3000,
                "Studio analytics",
                3000,
              ]}
              wrapper="span"
              speed={40}
              repeat={Infinity}
            />
          </div>
        </header>
        <main className="relative z-10 flex-1 overflow-auto">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
