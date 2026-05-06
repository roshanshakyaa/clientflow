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

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.team} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
