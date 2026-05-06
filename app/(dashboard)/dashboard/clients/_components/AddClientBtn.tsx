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
import { clientSchema, clientSchemaType } from "@/lib/schema/client";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Loader2, Plus } from "lucide-react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

export function AddClientBtn() {
  const [open, setOpen] = React.useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="default" size="sm" className="gap-1.5">
            <Plus className="size-3.5" />
            Add Client
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[360px]">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-base">Add Client</DialogTitle>
            <DialogDescription className="text-xs">
              Add a new client to your portfolio.
            </DialogDescription>
          </DialogHeader>
          <ProfileForm setOpen={setOpen} />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="default" size="sm" className="gap-1.5">
          <Plus className="size-3.5" />
          Add Client
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left pb-2">
          <DrawerTitle className="text-base">Add Client</DrawerTitle>
          <DrawerDescription className="text-xs">
            Add a new client to your portfolio.
          </DrawerDescription>
        </DrawerHeader>
        <ProfileForm className="px-4" setOpen={setOpen} />
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

function ProfileForm({
  className,
  setOpen,
}: React.ComponentProps<"form"> & { setOpen?: (open: boolean) => void }) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<clientSchemaType>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      email: "",
      name: "",
      company: "",
      phone: "",
    },
  });

  const createClient = useMutation(api.client.createClient);

  function onSubmit(data: clientSchemaType) {
    startTransition(async () => {
      try {
        await createClient(data);
        form.reset();
        setOpen?.(false);
      } catch (error) {
        console.error(error);
      }
    });
  }

  return (
    <form
      className={cn("flex flex-col gap-3", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      <FieldGroup className="flex flex-col gap-3">
        <Controller
          name="name"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Name
              </FieldLabel>
              <Input
                {...field}
                placeholder="Johny Harris"
                className="h-8 text-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="email"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Email
              </FieldLabel>
              <Input
                {...field}
                placeholder="john@gmail.com"
                type="email"
                className="h-8 text-sm"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          name="company"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Company (Optional)
              </FieldLabel>
              <Input
                {...field}
                placeholder="Acme Corp"
                className="h-8 text-sm"
              />
            </Field>
          )}
        />

        <Controller
          name="phone"
          control={form.control}
          render={({ field }) => (
            <Field>
              <FieldLabel className="text-xs text-muted-foreground mb-1">
                Phone (Optional)
              </FieldLabel>
              <Input {...field} placeholder="+977..." className="h-8 text-sm" />
            </Field>
          )}
        />
      </FieldGroup>

      <div className="flex justify-end pt-1">
        <Button
          type="submit"
          size="sm"
          disabled={isPending}
          className="min-w-[110px] gap-1.5"
        >
          {isPending ? (
            <>
              <Loader2 className="size-3.5 animate-spin" />
              Creating...
            </>
          ) : (
            "Create Client"
          )}
        </Button>
      </div>
    </form>
  );
}
