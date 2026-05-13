import { AppSidebar } from "@/components/web/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { ReactNode } from "react";
import { preloadAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar preloadedUser={preloadedUser} />
          <main className="w-full p-6">{children}</main>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};

export default DashboardLayout;
