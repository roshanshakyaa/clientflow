import { AppSidebar } from "@/components/web/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

const DashboardLayout = () => {
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar />
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};

export default DashboardLayout;
