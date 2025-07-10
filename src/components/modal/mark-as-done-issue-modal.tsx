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
import { CheckCircle2, LoaderCircleIcon, TriangleAlert } from "lucide-react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { FormFieldError } from "../form/form-field-error";
import type { Issue } from "@/schemas/issue-schema";
import useIssue from "@/queries/use-issue";
import { generateIdNumber } from "@/lib/utils";

interface MarkAsDoneIssueModalProps {
  data: Issue;
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

export default function MarkAsDoneIssueModal({
  data,
}: MarkAsDoneIssueModalProps) {
  const id = useId();
  const closeRef = useRef<HTMLButtonElement>(null);
  const { updateIssue } = useIssue();
  const { isPending } = updateIssue;

  const handleMarkDone = async () => {
    await updateIssue.mutateAsync({
      id: data.id,
      data: { status: "resolved" },
    });
  };

  const form = useForm({
    defaultValues: {
      identifier: `ISSUE-${generateIdNumber(data.id)}`,
      confirmIdentifier: "",
    },
    validators: {
      onSubmit: confirmationFormSchema,
    },
    onSubmit: async ({ formApi }) => {
      await handleMarkDone();
      formApi.reset();
      closeRef.current?.click();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          disabled={data.status === "resolved"}
          variant={data.status === "resolved" ? "outline" : "default"}
        >
          {data.status === "resolved" ? "Resolved" : "Confirm"}
        </Button>
      </DialogTrigger>
      <DialogContent className="min-w-3xs">
        <DialogHeader className="flex flex-row gap-4 items-start">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CheckCircle2 className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex flex-col text-left gap-1">
              <DialogTitle>Mark this issue as done</DialogTitle>
              <DialogDescription>
                Please confirm that you want to mark this issue as resolved.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <div className="text-sm border-1 border-yellow-600 p-4 rounded-md bg-yellow-600/10 grid grid-cols-[20px_1fr] gap-4">
          <TriangleAlert className="text-yellow-500 mt-1" size={20} />
          <p>
            You're about to mark this issue as <strong>done</strong>. Please
            ensure this issue has been resolved, as this will update the system
            and notify the admin.
          </p>
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
              {`To confirm, type "${`ISSUE-${generateIdNumber(data.id)}`}" in the box below`}
            </Label>
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
              <Button type="button" variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && (
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
