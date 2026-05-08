"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  PauseCircle,
  LayoutGrid,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateProjectBtn } from "./_components/CreateProjectBtn";

const ProjectsPage = () => {
  const projects = useQuery(api.project.getProjects);

  // Helper for Status UI
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "active":
        return {
          icon: Clock,
          color: "text-blue-600 bg-blue-50 border-blue-100",
          label: "Active",
        };
      case "completed":
        return {
          icon: CheckCircle2,
          color: "text-green-600 bg-green-50 border-green-100",
          label: "Completed",
        };
      case "on-hold":
        return {
          icon: PauseCircle,
          color: "text-amber-600 bg-amber-50 border-amber-100",
          label: "On Hold",
        };
      default:
        return {
          icon: Briefcase,
          color: "text-gray-600 bg-gray-50 border-gray-100",
          label: status,
        };
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Track your active contracts and upcoming deadlines.
          </p>
        </div>
        <CreateProjectBtn />
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects === undefined ? (
          [...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-56 w-full bg-slate-50 animate-pulse rounded-2xl border"
            />
          ))
        ) : projects.length === 0 ? (
          <div className="col-span-full py-32 flex flex-col items-center justify-center border-2 border-dashed rounded-3xl bg-slate-50/50">
            <LayoutGrid className="h-12 w-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">
              No projects found. Ready to start something new?
            </p>
          </div>
        ) : (
          projects.map((project) => {
            const statusObj = getStatusConfig(project.status);
            const StatusIcon = statusObj.icon;

            return (
              <div
                key={project._id}
                className="group flex flex-col justify-between bg-white border border-slate-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:-translate-y-1"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div
                      className={cn(
                        "px-3 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5",
                        statusObj.color,
                      )}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {statusObj.label}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {project.title}
                  </h3>

                  {project.description && (
                    <p className="text-slate-500 text-sm line-clamp-2 mb-4">
                      {project.description}
                    </p>
                  )}
                </div>

                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Deadline: {project.deadline}</span>
                    </div>
                  </div>

                  {/* Visual Progress Bar (Static for now, will link to tasks on Day 5) */}
                  <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all duration-500",
                        project.status === "completed"
                          ? "bg-green-500 w-full"
                          : "bg-blue-500 w-1/3",
                      )}
                    />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
