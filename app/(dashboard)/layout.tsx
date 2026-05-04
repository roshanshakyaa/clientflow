import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppSidebar } from "@/components/web/AppSidebar";
import React from "react";

const DashboardLayout = () => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
      </SidebarProvider>
    </>
  );
};

export default DashboardLayout;
