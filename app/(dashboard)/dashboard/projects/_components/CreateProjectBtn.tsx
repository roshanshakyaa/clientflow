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

  // 1. Fetch clients for the dropdown
  const clients = useQuery(api.client.getClient);

  const form = useForm<projectSchemaType>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      clientId: "",
      deadline: "",
      description: "",
      budget: undefined,
    },
  });

  const createProject = useMutation(api.project.createProject);

  function onSubmit(data: projectSchemaType) {
    startTransition(async () => {
      try {
        // data.clientId will be the Convex ID string
        await createProject({
          ...data,
          clientId: data.clientId as Id<"clients">,
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
        {/* Project Title */}
        <Controller
          name="title"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Project Title
              </FieldLabel>
              <Input
                {...field}
                placeholder="E-commerce Redesign"
                className="h-9 text-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Client Selection Dropdown */}
        <Controller
          name="clientId"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Link to Client
              </FieldLabel>
              <select
                {...field}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="" disabled>
                  Select a client
                </option>
                {clients?.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name} {client.company ? `(${client.company})` : ""}
                  </option>
                ))}
              </select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Deadline */}
          <Controller
            name="deadline"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground mb-1">
                  Deadline
                </FieldLabel>
                <Input {...field} type="date" className="h-9 text-sm" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Budget Field */}
          <Controller
            name="budget"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel className="text-xs text-muted-foreground mb-1">
                  Budget (Optional)
                </FieldLabel>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">
                    $
                  </span>
                  <Input
                    type="number"
                    placeholder="0.00"
                    className="h-9 text-sm pl-6"
                    value={field.value ?? ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      field.onChange(value === "" ? undefined : Number(value));
                    }}
                  />
                </div>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>

        {/* Description Field */}
        <Controller
          name="description"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Project Notes
              </FieldLabel>
              <Input
                {...field}
                placeholder="Brief overview of the project scope..."
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
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin mr-2" /> Creating...
            </>
          ) : (
            "Launch Project"
          )}
        </Button>
      </div>
    </form>
  );
}
