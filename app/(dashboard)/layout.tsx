import { AppSidebar } from "@/components/web/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { ReactNode } from "react";

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
          <main className="w-full p-6">{children}</main>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};

export default DashboardLayout;
