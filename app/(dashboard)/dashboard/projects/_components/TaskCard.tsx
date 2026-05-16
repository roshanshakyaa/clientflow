import { Doc } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { format } from "date-fns";

const PRIORITY_STYLES = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-orange-100 text-orange-600",
  high: "bg-red-100 text-red-600",
};

export function TaskCard({ task }: { task: Doc<"tasks"> }) {
  return (
    <div className="bg-white rounded-xl border border-slate-100 p-3.5 flex flex-col gap-2.5 shadow-xs hover:shadow-sm transition-shadow cursor-grab active:cursor-grabbing">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium leading-snug">{task.title}</p>
        <span
          className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-full shrink-0 capitalize",
            PRIORITY_STYLES[task.priority],
          )}
        >
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="text-xs text-muted-foreground line-clamp-2">
          {task.description}
        </p>
      )}

      {task.dueDate && (
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <Calendar className="size-3" />
          {format(new Date(task.dueDate), "MMM d")}
        </div>
      )}
    </div>
  );
}
