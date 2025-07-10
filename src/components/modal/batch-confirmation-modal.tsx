import { useId, useRef } from "react";
import { LoaderCircleIcon, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { z } from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { FormFieldError } from "../form/form-field-error";
import { actionIconMap, getActionContent } from "@/lib/constants";
import type { ActionType, ResourceType } from "@/lib/types";
import { capitalize } from "@/lib/utils";

const confirmationFormSchema = z
  .object({
    identifier: z.string(),
    confirmIdentifier: z.string().min(1, "You must confirm before proceeding"),
  })
  .refine((data) => data.identifier === data.confirmIdentifier, {
    path: ["confirmIdentifier"],
    message: "Input does not match the required identifier.",
  });

interface BatchConfirmationModalProps<T extends { id: string; name?: string }> {
  data: T[];
  action: ActionType;
  onSubmit: (ids: T[]) => Promise<void> | undefined;
  isPending: boolean;
  resourceType?: ResourceType;
}

export function BatchConfirmationModal<
  T extends { id: string; name?: string },
>({
  data,
  action,
  onSubmit,
  isPending,
  resourceType,
}: BatchConfirmationModalProps<T>) {
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const Icon = actionIconMap[action];
  const { title, description, warning } = getActionContent(
    action,
    data,
    resourceType,
  );

  const form = useForm({
    defaultValues: {
      identifier: capitalize(action),
      confirmIdentifier: "",
    },
    validators: {
      onSubmit: confirmationFormSchema,
    },
    onSubmit: async ({ formApi }) => {
      await onSubmit(data);
      formApi.reset();
      closeRef.current?.click();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant={action === "delete" ? "destructive" : "secondary"}
          className="h-8 w-8"
        >
          <Icon />
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xs">
        <div className="flex flex-col items-center gap-2">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Icon className="opacity-80" size={23} />
          </div>
          <DialogHeader>
            <DialogTitle className="sm:text-center">{title}</DialogTitle>
            <DialogDescription className="sm:text-center">
              {description}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="text-sm border-1 border-yellow-600 p-4 rounded-md bg-yellow-600/10 grid grid-cols-[20px_1fr] gap-4">
          <TriangleAlert className="text-yellow-500 mt-1" size={20} />
          <p> {warning}</p>
        </div>
        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <div className="*:not-first:mt-2">
            <Label
              htmlFor={id}
            >{`To confirm, type "${capitalize(action)}" in the box below`}</Label>
            <form.Field
              name="confirmIdentifier"
              children={(f) => {
                return (
                  <>
                    <Input
                      id={id}
                      type="text"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      aria-invalid={f.state.meta.errors.length > 0}
                    />
                    <FormFieldError field={f} />
                  </>
                );
              }}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                ref={closeRef}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className="flex-1 capitalize"
              disabled={isPending}
            >
              {isPending && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              {action}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
