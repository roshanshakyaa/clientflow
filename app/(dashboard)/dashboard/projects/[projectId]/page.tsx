"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect, use } from "react";
import { Doc, Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";
import { Calendar, DollarSign, User, ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TaskCard } from "../_components/TaskCard";
import { CreateTaskBtn } from "../_components/CreateTaskBtn";

type TaskStatus = "todo" | "in-progress" | "review" | "done";

const TASK_COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: "todo", label: "To Do", color: "bg-slate-100/50" },
  { id: "in-progress", label: "In Progress", color: "bg-blue-50/30" },
  { id: "review", label: "Review", color: "bg-amber-50/30" },
  { id: "done", label: "Done", color: "bg-green-50/30" },
];

type BoardData = Record<TaskStatus, Doc<"tasks">[]>;

const EMPTY_BOARD: BoardData = {
  todo: [],
  "in-progress": [],
  review: [],
  done: [],
};

const STATUS_STYLES: Record<string, string> = {
  proposal: "bg-slate-100 text-slate-600",
  active: "bg-blue-100 text-blue-700",
  "on-hold": "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  archived: "bg-zinc-100 text-zinc-500",
};

const PRIORITY_STYLES: Record<string, string> = {
  low: "bg-slate-100 text-slate-500",
  medium: "bg-orange-100 text-orange-600",
  high: "bg-red-100 text-red-600",
};

interface Props {
  params: Promise<{ projectId: Id<"projects"> }>;
}

const ProjectPage = ({ params }: Props) => {
  const { projectId } = use(params);
  const project = useQuery(api.project.getProject, { projectId });
  const tasks = useQuery(api.tasks.getTasks, { projectId });
  const updateTaskStatus = useMutation(api.tasks.updateTaskStatus);

  const [localBoardData, setLocalBoardData] = useState<BoardData | null>(null);

  const serverBoardData = useMemo<BoardData>(() => {
    if (!tasks) return EMPTY_BOARD;
    const grouped: BoardData = {
      todo: [],
      "in-progress": [],
      review: [],
      done: [],
    };
    for (const task of tasks) {
      const status = task.status as TaskStatus;
      if (grouped[status]) grouped[status].push(task);
    }
    return grouped;
  }, [tasks]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalBoardData(null);
    }, 0);
    return () => clearTimeout(timeout);
  }, [tasks]);

  const boardData = localBoardData ?? serverBoardData;

  const handleDragEnd = (newBoardData: Record<string, Doc<"tasks">[]>) => {
    const typed = newBoardData as BoardData;

    const oldStatusMap = new Map<string, { status: string; order: number }>();
    Object.entries(boardData).forEach(([status, items]) => {
      items.forEach((item) =>
        oldStatusMap.set(item._id, { status, order: item.order }),
      );
    });

    Object.entries(typed).forEach(([newStatus, items]) => {
      items.forEach((item, index) => {
        const newOrder = (index + 1) * 1000;
        const old = oldStatusMap.get(item._id);
        if (old?.status !== newStatus || old?.order !== newOrder) {
          updateTaskStatus({
            id: item._id,
            status: newStatus as TaskStatus,
            order: newOrder,
          });
        }
      });
    });

    setLocalBoardData(typed);
  };

  if (project === undefined) {
    return (
      <div className="p-6 flex items-center justify-center h-[calc(100vh-64px)]">
        <div className="text-muted-foreground text-sm">Loading...</div>
      </div>
    );
  }

  if (project === null) {
    return (
      <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-64px)] gap-3">
        <p className="text-muted-foreground text-sm">Project not found.</p>
        <Link href="/dashboard/projects">
          <Button variant="outline" size="sm">
            Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  const progress =
    project.totalTasks > 0
      ? Math.round((project.completedTasks / project.totalTasks) * 100)
      : 0;

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col gap-6 overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Link
          href="/dashboard/projects"
          className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit"
        >
          <ArrowLeft className="size-3.5" />
          All Projects
        </Link>

        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl font-bold tracking-tight">
                {project.title}
              </h1>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                  STATUS_STYLES[project.status],
                )}
              >
                {project.status}
              </span>
              <span
                className={cn(
                  "text-xs font-medium px-2 py-0.5 rounded-full capitalize",
                  PRIORITY_STYLES[project.priority],
                )}
              >
                {project.priority}
              </span>
            </div>

            {/* Meta row */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              {project.client && (
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  {project.client.name}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                Started {format(new Date(project.startDate), "MMM d, yyyy")}
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                Due {format(new Date(project.deadline), "MMM d, yyyy")}
              </span>
              {project.budget && (
                <span className="flex items-center gap-1.5">
                  <DollarSign className="size-3.5" />
                  {project.budget.toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {project.totalTasks > 0 && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span>{progress}%</span>
              </div>
            )}
            <CreateTaskBtn projectId={projectId} />
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-muted-foreground max-w-2xl">
            {project.description}
          </p>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-border" />

      {/* Task Kanban */}
      <Kanban
        value={boardData}
        onValueChange={handleDragEnd}
        getItemValue={(item: Doc<"tasks">) => item._id}
      >
        <KanbanBoard className="flex gap-6 h-full overflow-x-auto pb-8 scrollbar-hide">
          {TASK_COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              value={col.id}
              className={cn(
                "min-w-[280px] max-w-[320px] flex flex-col rounded-2xl p-4 border border-slate-100",
                col.color,
              )}
            >
              <div className="flex items-center justify-between mb-5 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs uppercase tracking-widest text-slate-500">
                    {col.label}
                  </span>
                  <span className="text-[10px] font-bold bg-white border px-2 py-0.5 rounded-full text-slate-400">
                    {boardData[col.id]?.length ?? 0}
                  </span>
                </div>
              </div>

              <KanbanColumnContent
                value={col.id}
                className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1"
              >
                {boardData[col.id].map((task) => (
                  <KanbanItem key={task._id} value={task._id} asChild>
                    <KanbanItemHandle>
                      <TaskCard task={task} />
                    </KanbanItemHandle>
                  </KanbanItem>
                ))}
              </KanbanColumnContent>
            </KanbanColumn>
          ))}
        </KanbanBoard>
        <KanbanOverlay className="bg-blue-500/10 rounded-xl border-2 border-dashed border-blue-500/50" />
      </Kanban>
    </div>
  );
};

export default ProjectPage;
