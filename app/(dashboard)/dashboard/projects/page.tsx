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
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CreateProjectBtn } from "./_components/CreateProjectBtn";
import { format } from "date-fns";

// Define our Kanban Columns
const COLUMNS = [
  { id: "proposal", label: "Proposals", color: "bg-slate-100/50" },
  { id: "active", label: "Active", color: "bg-blue-50/30" },
  { id: "on-hold", label: "On Hold", color: "bg-amber-50/30" },
  { id: "completed", label: "Completed", color: "bg-green-50/30" },
] as const;

const ProjectsPage = () => {
  const projects = useQuery(api.project.getProjects);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return Clock;
      case "completed":
        return CheckCircle2;
      case "on-hold":
        return PauseCircle;
      default:
        return Briefcase;
    }
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Board</h1>
          <p className="text-muted-foreground text-sm">
            Manage your workflow across different project stages.
          </p>
        </div>
        <CreateProjectBtn />
      </div>

      {/* Kanban Board Container */}
      <div className="flex flex-1 gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {COLUMNS.map((column) => (
          <div
            key={column.id}
            className={cn(
              "flex flex-col min-w-[320px] max-w-[350px] w-full rounded-2xl p-4 border border-slate-100",
              column.color,
            )}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-5 px-1">
              <div className="flex items-center gap-2">
                <span className="font-bold text-xs uppercase tracking-widest text-slate-500">
                  {column.label}
                </span>
                <span className="text-[10px] font-bold bg-white border px-2 py-0.5 rounded-full text-slate-400">
                  {projects?.filter((p) => p.status === column.id).length || 0}
                </span>
              </div>
              <MoreHorizontal className="size-4 text-slate-400 cursor-pointer" />
            </div>

            {/* Column Content */}
            <div className="flex flex-col gap-4 overflow-y-auto pr-1">
              {projects === undefined ? (
                <div className="h-32 w-full bg-white/50 animate-pulse rounded-xl border border-dashed" />
              ) : (
                projects
                  .filter((p) => p.status === column.id)
                  .map((project) => {
                    const StatusIcon = getStatusIcon(project.status);
                    const progress =
                      project.totalTasks > 0
                        ? (project.completedTasks / project.totalTasks) * 100
                        : 0;

                    return (
                      <div
                        key={project._id}
                        className="group bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
                      >
                        <div className="flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <span
                              className={cn(
                                "text-[9px] px-2 py-0.5 rounded-md font-bold uppercase tracking-tighter border",
                                project.priority === "high"
                                  ? "text-red-600 border-red-100 bg-red-50"
                                  : project.priority === "medium"
                                    ? "text-amber-600 border-amber-100 bg-amber-50"
                                    : "text-slate-500 border-slate-100 bg-slate-50",
                              )}
                            >
                              {project.priority}
                            </span>
                          </div>

                          <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight">
                            {project.title}
                          </h3>

                          {project.description && (
                            <p className="text-slate-500 text-xs line-clamp-2">
                              {project.description}
                            </p>
                          )}

                          <div className="pt-2 flex flex-col gap-3">
                            {/* Simple Progress Bar */}
                            <div className="space-y-1.5">
                              <div className="flex justify-between text-[10px] font-medium text-slate-400">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                              </div>
                              <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-blue-500 transition-all duration-500"
                                  style={{ width: `${progress}%` }}
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="size-3" />
                                <span>
                                  {format(project.deadline, "MMM dd")}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="size-3" />
                                <span>
                                  {project.completedTasks}/{project.totalTasks}{" "}
                                  tasks
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProjectsPage;
