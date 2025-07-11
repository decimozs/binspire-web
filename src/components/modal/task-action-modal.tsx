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
import { Button } from "../ui/button";
import z from "zod/v4";
import { useForm } from "@tanstack/react-form";
import { useId, useRef } from "react";
import { LoaderCircleIcon, Trash, TriangleAlert } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormFieldError } from "../form/form-field-error";
import type { Task } from "@/schemas/task-schema";
import { generateIdNumber } from "@/lib/utils";
import useTask from "@/queries/use-task";

interface TaskActionModalProps {
  data: Task;
}

const confirmationFormSchema = z
  .object({
    identifier: z.string(),
    confirmIdentifier: z.string().min(1, "You must confirm before proceeding"),
  })
  .refine((data) => data.identifier === data.confirmIdentifier, {
    path: ["confirmIdentifier"],
    message: "Input does not match the required identifier.",
  });

export default function TaskActionModal({ data }: TaskActionModalProps) {
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { updateTask } = useTask();

  const handleMark = async () => {
    await updateTask.mutateAsync({
      id: data.id,
      data: {
        status: data.status === "pending" ? "in-progress" : "done",
      },
    });
  };

  const form = useForm({
    defaultValues: {
      identifier: `TASK-${generateIdNumber(data.id)}`,
      confirmIdentifier: "",
    },
    validators: {
      onSubmit: confirmationFormSchema,
    },
    onSubmit: async ({ formApi }) => {
      await handleMark();
      formApi.reset();
      closeRef.current?.click();
    },
  });

  const isPending = data.status === "pending";
  const isInProgress = data.status === "in-progress";
  const isDone = data.status === "done";

  const title = isPending
    ? "Start Task"
    : isInProgress
      ? "Mark Task as Done"
      : "Task Completed";

  const description = isPending
    ? "Confirm that you're starting this task. This will update the task status to 'in-progress'."
    : "Confirm that this task has been completed and is ready to be marked as done.";

  const alertMessage = isPending
    ? "You're about to start this task. This will assign the task and notify related users."
    : "You're about to mark this task as done. Ensure all related actions are completed. This will notify the system.";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={isDone ? "secondary" : "default"} disabled={isDone}>
          {isDone
            ? "Task Completed"
            : isPending
              ? "Start Task"
              : "Mark as Done"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xs">
        <DialogHeader className="flex flex-row gap-4 items-start">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Trash className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left gap-1">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </div>
        </DialogHeader>

        <div className="text-sm border-1 border-yellow-600 p-4 rounded-md bg-yellow-600/10 grid grid-cols-[20px_1fr] gap-4">
          <TriangleAlert className="text-yellow-500 mt-1" size={20} />
          <p>{alertMessage}</p>
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
            <Label htmlFor={id}>
              {`To confirm, type "TASK-${generateIdNumber(data.id)}" in the box below`}
            </Label>
            <form.Field
              name="confirmIdentifier"
              children={(f) => (
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
              )}
            />
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={updateTask.isPending}>
              {updateTask.isPending && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Confirm
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
