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
import { FileText, LoaderCircleIcon, Send } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import useIssue from "@/queries/use-issue";
import { useForm } from "@tanstack/react-form";
import { createIssueSchema, type CreateIssue } from "@/schemas/issue-schema";
import { useSessionStore } from "@/store/use-session-store";
import { ORG_ID } from "@/lib/constants";
import { Input } from "../ui/input";
import { FormFieldError } from "../form/form-field-error";
import { Label } from "../ui/label";
import { useId, useRef } from "react";
import { Button } from "../ui/button";
import DynamicTextArea from "../core/dynamic-textarea";

export default function ReportTrashbinModal() {
  const id = useId();
  const { createIssue } = useIssue();
  const isPending = createIssue.isPending;
  const { session } = useSessionStore();
  const closeRef = useRef<HTMLButtonElement>(null);

  const defaultValues: CreateIssue = {
    title: "",
    description: "",
    category: "trashbin",
    reporterId: session?.userId || "",
    orgId: ORG_ID,
    priority: "medium",
    status: "open",
    referenceId: undefined,
    isArchive: false,
  };

  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: createIssueSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await createIssue.mutateAsync(value);
      formApi.reset();
      closeRef.current?.click();
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outlineDestructive">Report this trashbin</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row gap-4 items-start">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <FileText className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex flex-col text-left gap-1">
              <DialogTitle>Report This Trashbin</DialogTitle>
              <DialogDescription>
                Report issues or unusual activity for review.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <form.Field name="title">
            {(f) => (
              <>
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-email`}>Title</Label>
                  <div className="relative">
                    <Input
                      id={`${id}-email`}
                      placeholder="Enter the title of the issue"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      aria-invalid={f.state.meta.errors.length > 0}
                    />
                  </div>
                  <FormFieldError field={f} />
                </div>
              </>
            )}
          </form.Field>
          <form.Field
            name="description"
            children={(f) => {
              return (
                <DynamicTextArea
                  f={f}
                  label="Description"
                  placeholder="Describe your issue"
                />
              );
            }}
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" ref={closeRef}>
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && (
                <LoaderCircleIcon
                  className="-ms-1 animate-spin"
                  size={16}
                  aria-hidden="true"
                />
              )}
              Send Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
