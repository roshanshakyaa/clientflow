"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { useMediaQuery } from "@/hooks/use-media-query";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Loader2, Plus, Briefcase } from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { projectSchema, projectSchemaType } from "@/lib/schema/project";
import { Id } from "@/convex/_generated/dataModel";

export function CreateProjectBtn() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const TriggerButton = (
    <Button variant="default" size="sm" className="gap-1.5">
      <Plus className="size-3.5" />
      Add Project
    </Button>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{TriggerButton}</DialogTrigger>
        <DialogContent className="sm:max-w-100">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base flex items-center gap-2">
              <Briefcase className="size-4" /> Add Project
            </DialogTitle>
            <DialogDescription className="text-xs">
              Launch a new project and link it to a client.
            </DialogDescription>
          </DialogHeader>
          <ProjectForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{TriggerButton}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-base">Add Project</DrawerTitle>
          <DrawerDescription className="text-xs">
            Launch a new project and link it to a client.
          </DrawerDescription>
        </DrawerHeader>
        <ProjectForm className="px-4" setOpen={setOpen} />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline" size="sm">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

function ProjectForm({
  className,
  setOpen,
}: {
  className?: string;
  setOpen?: (open: boolean) => void;
}) {
  const [isPending, startTransition] = React.useTransition();
  const clients = useQuery(api.client.getClient);
  const createProject = useMutation(api.project.createProject);

  const form = useForm<projectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      clientId: "",
      description: "",
      status: "active", // Reasonable default
      priority: "medium", // Reasonable default
      startDate: new Date().toISOString().split("T")[0], // Defaults to today
      deadline: "",
      budget: undefined,
      hourlyRate: undefined,
    },
  });

  function onSubmit(data: projectSchemaType) {
    startTransition(async () => {
      try {
        await createProject({
          ...data,
          clientId: data.clientId as Id<"clients">,
          // CRITICAL: Convert strings to timestamps for Convex
          startDate: new Date(data.startDate).getTime(),
          deadline: new Date(data.deadline).getTime(),
          budget: data.budget,
          hourlyRate: data.hourlyRate,
        });
        form.reset();
        setOpen?.(false);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <form
      className={cn("flex flex-col gap-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="flex flex-col gap-4">
        {/* Row 1: Title & Client */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="title"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground">
                  Project Title
                </FieldLabel>
                <Input
                  {...field}
                  placeholder="Project name..."
                  className="h-9 text-sm"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Controller
            name="clientId"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground">
                  Client
                </FieldLabel>
                <select
                  {...field}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="" disabled>
                    Select client
                  </option>
                  {clients?.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Row 2: Status & Priority */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="status"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Status
                </FieldLabel>
                <select
                  {...field}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="proposal">Proposal</option>
                  <option value="active">Active</option>
                  <option value="on-hold">On Hold</option>
                  <option value="completed">Completed</option>
                </select>
              </Field>
            )}
          />

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
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </Field>
            )}
          />
        </div>

        {/* Row 3: Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="startDate"
            control={form.control}
            render={({ field }) => (
              <Field>
                <FieldLabel className="text-xs text-muted-foreground">
                  Start Date
                </FieldLabel>
                <Input {...field} type="date" className="h-9 text-sm" />
              </Field>
            )}
          />
          <Controller
            name="deadline"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground">
                  Deadline
                </FieldLabel>
                <Input {...field} type="date" className="h-9 text-sm" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Row 4: Budget & Hourly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Budget Field */}
          <Controller
            name="budget"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground">
                  Budget ($)
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  min="0" // Native browser restriction
                  placeholder="0.00"
                  className="h-9 text-sm"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(
                      val === "" ? undefined : Math.max(0, Number(val)),
                    ); // Logic fallback
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Hourly Rate Field */}
          <Controller
            name="hourlyRate"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground">
                  Hourly Rate ($)
                </FieldLabel>
                <Input
                  {...field}
                  type="number"
                  min="0" // Native browser restriction
                  placeholder="0.00"
                  className="h-9 text-sm"
                  value={field.value ?? ""}
                  onChange={(e) => {
                    const val = e.target.value;
                    field.onChange(
                      val === "" ? undefined : Math.max(0, Number(val)),
                    );
                  }}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Description */}
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-xs text-muted-foreground">
                Project Notes
              </FieldLabel>
              <Input
                {...field}
                placeholder="Scope details..."
                className="h-9 text-sm"
              />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end pt-2">
        <Button
          type="submit"
          size="sm"
          disabled={isPending || !clients}
          className="min-w-30"
        >
          {isPending ? "Launching..." : "Launch Project"}
        </Button>
      </div>
    </form>
  );
}
