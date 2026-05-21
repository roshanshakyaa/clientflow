import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

import { Calendar, Clock } from "lucide-react";
import Link from "next/link";

export function ProjectCard({ project }: { project: Doc<"projects"> }) {
  const progress =
    project.totalTasks > 0
      ? (project.completedTasks / project.totalTasks) * 100
      : 0;

  return (
    <Link href={`/dashboard/projects/${project.slug}`}>
      <div className="group bg-white border border-slate-200/60 rounded-xl p-5 shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing">
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

          <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors leading-tight line-clamp-1">
            {project.title}
          </h3>

          <div className="space-y-1.5">
            <div className="flex justify-between text-[10px] font-medium text-slate-400">
              <span>Progress</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
            <div className="flex items-center gap-1">
              <Calendar className="size-3" />
              <span>{format(project.deadline, "MMM dd")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="size-3" />
              <span>
                {project.completedTasks}/{project.totalTasks}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
