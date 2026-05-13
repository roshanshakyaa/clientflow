"use client";

import * as React from "react";

import { NavMain } from "@/components/web/nav-main";
import { NavProjects } from "@/components/web/nav-projects";
import { NavUser } from "@/components/web/nav-user";
import { TeamSwitcher } from "@/components/web/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import {
  GalleryVerticalEndIcon,
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
} from "lucide-react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { api } from "@/convex/_generated/api";
import { Preloaded } from "convex/react";

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  team: {
    name: "Client Flow",
    logo: <GalleryVerticalEndIcon />,
    plan: "FlowState",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: <TerminalSquareIcon />,
    },
    {
      title: "Clients",
      url: "/dashboard/clients",
      icon: <BotIcon />,
    },
    {
      title: "Projects",
      url: "/dashboard/projects",
      icon: <BookOpenIcon />,
    },
    {
      title: "Tasks",
      url: "/dashboard/tasks",
      icon: <BookOpenIcon />,
    },
    {
      title: "Invoices",
      url: "/dashboard/invoices",
      icon: <Settings2Icon />,
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: <FrameIcon />,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: <PieChartIcon />,
    },
    {
      name: "Travel",
      url: "#",
      icon: <MapIcon />,
    },
  ],
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  preloadedUser: Preloaded<typeof api.auth.getCurrentUser>;
}

export function AppSidebar({ preloadedUser, ...props }: AppSidebarProps) {
  const user = api.auth.getCurrentUser;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavUser preloadedUserQuery={preloadedUser} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href={"/settings"}>
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
