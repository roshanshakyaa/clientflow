"use client";

import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useState, useMemo, useEffect } from "react";
import React from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { Doc } from "@/convex/_generated/dataModel";

import {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnContent,
  KanbanItem,
  KanbanItemHandle,
  KanbanOverlay,
} from "@/components/reui/kanban";
import { CreateProjectBtn } from "./_components/CreateProjectBtn";
import { ProjectCard } from "./_components/ProjectCard";

type StatusKey = "proposal" | "active" | "on-hold" | "completed";

const COLUMNS: { id: StatusKey; label: string; color: string }[] = [
  { id: "proposal", label: "Proposals", color: "bg-slate-100/50" },
  { id: "active", label: "Active", color: "bg-blue-50/30" },
  { id: "on-hold", label: "On Hold", color: "bg-amber-50/30" },
  { id: "completed", label: "Completed", color: "bg-green-50/30" },
];

type BoardData = Record<StatusKey, Doc<"projects">[]>;

const EMPTY_BOARD: BoardData = {
  proposal: [],
  active: [],
  "on-hold": [],
  completed: [],
};

const ProjectsPage = () => {
  const projects = useQuery(api.project.getProjects);
  const updateStatus = useMutation(api.project.updateProjectStatus);
  const [localBoardData, setLocalBoardData] = useState<BoardData | null>(null);

  const serverBoardData = useMemo<BoardData>(() => {
    if (!projects) return EMPTY_BOARD;
    const grouped: BoardData = {
      proposal: [],
      active: [],
      "on-hold": [],
      completed: [],
    };
    for (const project of projects) {
      const status = project.status as StatusKey;
      if (grouped[status]) grouped[status].push(project);
    }
    return grouped;
  }, [projects]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLocalBoardData(null);
    }, 0);
    return () => clearTimeout(timeout);
  }, [projects]);
  const boardData = localBoardData ?? serverBoardData;

  const handleDragEnd = (newBoardData: Record<string, Doc<"projects">[]>) => {
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
          updateStatus({
            id: item._id,
            status: newStatus as StatusKey,
            order: newOrder,
          });
        }
      });
    });

    setLocalBoardData(typed);
  };

  return (
    <div className="p-6 h-[calc(100vh-64px)] flex flex-col space-y-6 overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Project Board</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Drag and drop projects to update their current stage.
          </p>
        </div>
        <CreateProjectBtn />
      </div>

      <Kanban
        value={boardData}
        onValueChange={handleDragEnd}
        getItemValue={(item: Doc<"projects">) => item._id}
      >
        <KanbanBoard className="flex gap-6 h-full overflow-x-auto pb-8 scrollbar-hide">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.id}
              value={col.id}
              className={cn(
                "min-w-[320px] max-w-87.5 flex flex-col rounded-2xl p-4 border border-slate-100",
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
                <MoreHorizontal className="size-4 text-slate-400 cursor-pointer" />
              </div>

              <KanbanColumnContent
                value={col.id}
                className="flex flex-col gap-4 overflow-y-auto pr-1 flex-1"
              >
                {boardData[col.id].map((project) => (
                  <KanbanItem key={project._id} value={project._id} asChild>
                    <KanbanItemHandle>
                      <ProjectCard project={project} />
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

export default ProjectsPage;
