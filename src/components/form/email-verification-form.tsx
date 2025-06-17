import { formOptions, useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useId } from "react";
import { MailIcon } from "lucide-react";
import { FormFieldError } from "./form-field-error";
import { successSonner } from "../ui/sonner";
import Logo from "../core/logo";
import { Link } from "@tanstack/react-router";

const emailVerificationSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
});

type EmailVerificationFormFields = z.infer<typeof emailVerificationSchema>;

const defaultValues: EmailVerificationFormFields = {
  email: "",
};

const formOpts = formOptions({
  defaultValues,
  validators: {
    onSubmit: emailVerificationSchema,
  },
});

export default function EmailVerificationForm() {
  const id = useId();

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value }) => {
      console.log("Email verification submitted:", value.email);
      successSonner("Verification email sent. Please check your inbox.");
    },
  });

  return (
    <div className="w-full max-w-md px-8 space-y-5">
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <div className="flex items-center flex-col gap-2">
          <h1 className="text-lg font-medium">Verify Your Email</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter your email address and we’ll send you a verification link.
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
            name="email"
            children={(f) => (
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
                  <div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 end-0 flex items-center justify-center pe-3">
                    <MailIcon size={16} aria-hidden="true" />
                  </div>
                </div>
                <FormFieldError field={f} />
              </div>
            )}
          />
        </div>
        <div className="space-y-2">
          <Button type="submit" className="w-full">
            Send Verification
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
