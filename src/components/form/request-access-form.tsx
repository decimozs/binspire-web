import { formOptions, useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useId } from "react";
import { roleValues } from "@/lib/constants";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "../ui/textarea";
import { useCharacterLimit } from "@/hooks/use-character-limit";
import { MailIcon } from "lucide-react";
import type { AnyFieldApi } from "@tanstack/react-form";
import { FormFieldError } from "./form-field-error";
import Logo from "../core/logo";
import { Link } from "@tanstack/react-router";

export const requestAccessFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  reason: z
    .string()
    .max(180, { message: "Reason must be 180 characters or fewer" })
    .optional(),
  role: z.enum(roleValues, {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),
});

type RequestAccessFormFields = z.infer<typeof requestAccessFormSchema>;

const defaultValues: RequestAccessFormFields = {
  name: "",
  email: "",
  reason: "",
  role: "admin",
};

const formOpts = formOptions({
  defaultValues: defaultValues,
  validators: {
    onSubmit: requestAccessFormSchema,
  },
});

export default function RequestAccessForm() {
  const id = useId();
  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log(`Errors: ${form.getAllErrors()}`);
      console.log(value);
    },
  });

  return (
    <div className="w-full max-w-md p-8 space-y-5">
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <div className="flex items-center flex-col gap-2">
          <h1 className="text-lg font-medium">Request Access</h1>
          <p className="text-sm wrap text-muted-foreground">
            Enter your credentials to login to your account.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="space-y-5"
      >
        <div className="space-y-4">
          <form.Field
            name="name"
            children={(f) => {
              return (
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-name`}>Name</Label>
                  <Input
                    id={`${id}-name`}
                    placeholder="Enter your full name"
                    type="text"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    aria-invalid={f.state.meta.errors.length > 0}
                  />
                  <FormFieldError field={f} />
                </div>
              );
            }}
          />
          <form.Field
            name="email"
            children={(f) => {
              return (
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-email`}>Email</Label>
                  <div className="relative">
                    <Input
                      id={`${id}-email`}
                      placeholder="Enter your email"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      aria-invalid={f.state.meta.errors.length > 0}
                    />
                    <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3 peer-disabled:opacity-50">
                      <MailIcon size={16} aria-hidden="true" />
                    </div>
                  </div>
                  <FormFieldError field={f} />
                </div>
              );
            }}
          />
          <form.Field
            name="reason"
            children={(f) => {
              return <RequestAccessReasonTextArea f={f} />;
            }}
          />
        </div>
        <form.Field
          name="role"
          children={(f) => {
            return <RoleRadioGroup f={f} />;
          }}
        />
        <div className="space-y-2">
          <Button type="submit" className="w-full">
            Request Access
          </Button>
          <Link to="/">
            <Button type="button" className="w-full" variant="ghost">
              Back
            </Button>
          </Link>
        </div>
      </form>
    </div>
  );
}

export const RoleRadioGroup = ({ f }: { f: AnyFieldApi }) => {
  const id = useId();
  return (
    <RadioGroup
      className="gap-2"
      defaultValue="admin"
      onValueChange={(v) => f.handleChange(v)}
      value={f.state.value}
    >
      <Label htmlFor={`${id}-role`}>Role</Label>
      <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border p-4 shadow-xs outline-none">
        <RadioGroupItem
          value="admin"
          id={`${id}-admin`}
          aria-describedby={`${id}-admin-description`}
          className="cursor-pointer order-1 after:absolute after:inset-0"
        />
        <div className="flex grow items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-shield-icon lucide-shield"
          >
            <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
          </svg>
          <div className="grid grow gap-2">
            <Label htmlFor={`${id}-admin`}>
              Admin{" "}
              <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                (Has full access)
              </span>
            </Label>
            <p
              id={`${id}-admin-description`}
              className="text-muted-foreground text-xs"
            >
              Full access to all features and administrative tools.
            </p>
          </div>
        </div>
      </div>
      <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-accent relative flex w-full items-center gap-2 rounded-md border p-4 shadow-xs outline-none">
        <RadioGroupItem
          value="collector"
          id={`${id}-collector`}
          aria-describedby={`${id}-collector-description`}
          className="cursor-pointer order-1 after:absolute after:inset-0"
        />
        <div className="flex grow items-start gap-3">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-hard-hat-icon lucide-hard-hat"
          >
            <path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5" />
            <path d="M14 6a6 6 0 0 1 6 6v3" />
            <path d="M4 15v-3a6 6 0 0 1 6-6" />
            <rect x="2" y="15" width="20" height="4" rx="1" />
          </svg>
          <div className="grid grow gap-2">
            <Label htmlFor={`${id}-collector`}>
              Collector{" "}
              <span className="text-muted-foreground text-xs leading-[inherit] font-normal">
                (Restricted access)
              </span>
            </Label>
            <p
              id={`${id}-collector-description`}
              className="text-muted-foreground text-xs"
            >
              Typically for collection-related tasks only.
            </p>
          </div>
        </div>
      </div>
      <FormFieldError field={f} />
    </RadioGroup>
  );
};

const RequestAccessReasonTextArea = ({ f }: { f: AnyFieldApi }) => {
  const id = useId();

  const maxLength = 180;

  const {
    value,
    characterCount,
    handleChange,
    maxLength: limit,
  } = useCharacterLimit({ maxLength, initialValue: f.state.value });

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleChange(e);
    f.handleChange(e.target.value);
  };

  return (
    <div className="*:not-first:mt-2">
      <div className="flex items-center justify-between gap-1">
        <Label htmlFor={id}>Reason</Label>
        <span className="text-muted-foreground text-sm">Optional</span>
      </div>
      <Textarea
        id={id}
        value={value}
        onChange={handleTextChange}
        maxLength={maxLength}
        aria-describedby={`${id}-description`}
        aria-invalid={f.state.meta.errors.length > 0}
      />
      <p
        id={`${id}-description`}
        className="text-muted-foreground mt-2 text-right text-xs"
        role="status"
        aria-live="polite"
      >
        <span className="tabular-nums">{limit - characterCount}</span>{" "}
        characters left
      </p>
      <FormFieldError field={f} />
    </div>
  );
};
