import { AppSidebar } from "@/components/web/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import React, { ReactNode } from "react";
import { preloadAuthQuery } from "@/lib/auth-server";
import { api } from "@/convex/_generated/api";
import { Breadcrumbs } from "@/components/web/breadcrumbs";

const DashboardLayout = async ({ children }: { children: ReactNode }) => {
  const preloadedUser = await preloadAuthQuery(api.auth.getCurrentUser);
  return (
    <>
      <TooltipProvider>
        <SidebarProvider>
          <AppSidebar preloadedUser={preloadedUser} />
          <div className="flex flex-col w-full min-h-screen">
            <header className="h-12 border-b flex items-center px-6 shrink-0">
              <Breadcrumbs />
            </header>
            <main className="flex-1 p-6">{children}</main>
          </div>
        </SidebarProvider>
      </TooltipProvider>
    </>
  );
};

export default DashboardLayout;
