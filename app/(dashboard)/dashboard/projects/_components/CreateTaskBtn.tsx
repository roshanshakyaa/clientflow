"use client";

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Loader2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().max(500).optional(),
  priority: z.enum(["low", "medium", "high"]),
  dueDate: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskSchema>;

export function CreateTaskBtn({ projectId }: { projectId: Id<"projects"> }) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();
  const createTask = useMutation(api.tasks.createTask);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: "",
      description: "",
      priority: "medium",
      dueDate: "",
    },
  });

  function onSubmit(data: TaskFormValues) {
    startTransition(async () => {
      try {
        await createTask({
          projectId,
          title: data.title,
          description: data.description || undefined,
          priority: data.priority,
          dueDate: data.dueDate ? new Date(data.dueDate).getTime() : undefined,
        });
        form.reset();
        setOpen(false);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[360px]">
        <DialogHeader>
          <DialogTitle className="text-base">Add Task</DialogTitle>
        </DialogHeader>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FieldGroup className="flex flex-col gap-3">
            <Controller
              name="title"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Title
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Task title"
                    className="h-8 text-sm"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="description"
              control={form.control}
              render={({ field }) => (
                <Field>
                  <FieldLabel className="text-xs text-muted-foreground">
                    Description
                  </FieldLabel>
                  <Input
                    {...field}
                    placeholder="Optional"
                    className="h-8 text-sm"
                  />
                </Field>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <Controller
                name="priority"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Priority
                    </FieldLabel>
                    <select
                      {...field}
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </Field>
                )}
              />
              <Controller
                name="dueDate"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel className="text-xs text-muted-foreground">
                      Due Date
                    </FieldLabel>
                    <Input {...field} type="date" className="h-8 text-sm" />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
          <div className="flex justify-end pt-1">
            <Button
              type="submit"
              size="sm"
              disabled={isPending}
              className="min-w-[100px]"
            >
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                "Add Task"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
