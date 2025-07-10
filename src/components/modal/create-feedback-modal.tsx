import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LoaderCircleIcon, Send } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import useIssue from "@/queries/use-issue";
import { useForm } from "@tanstack/react-form";
import { createIssueSchema, type CreateIssue } from "@/schemas/issue-schema";
import { useSessionStore } from "@/store/use-session-store";
import { ORG_ID } from "@/lib/constants";
import { Input } from "../ui/input";
import { FormFieldError } from "../form/form-field-error";
import { Label } from "../ui/label";
import { useId } from "react";
import { Button } from "../ui/button";
import DynamicTextArea from "../core/dynamic-textarea";

export default function CreateFeedbackModal() {
  const id = useId();
  const { createIssue } = useIssue();
  const isPending = createIssue.isPending;
  const { session } = useSessionStore();

  const defaultValues: CreateIssue = {
    title: "",
    description: "",
    category: "general",
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
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <Send />
            Feedback
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent className="min-w-xl">
        <DialogHeader>
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <Send className="opacity-80" size={23} />
          </div>
          <DialogTitle>Feedback</DialogTitle>
          <DialogDescription>Create feedback for the team</DialogDescription>
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
                      placeholder="Enter your title"
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
              return <DynamicTextArea f={f} label="Description" />;
            }}
          />
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && (
              <LoaderCircleIcon
                className="-ms-1 animate-spin"
                size={16}
                aria-hidden="true"
              />
            )}
            Send Feedback
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
