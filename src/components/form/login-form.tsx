import { formOptions, useForm } from "@tanstack/react-form";
import z from "zod";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { useId, useState } from "react";
import { EyeIcon, EyeOffIcon, LoaderCircleIcon, MailIcon } from "lucide-react";
import { FormFieldError } from "./form-field-error";
import Logo from "../core/logo";
import LegalPoliciesFooter from "../core/footer/legal-policies-footer";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/queries/use-auth";

const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
});

export type Login = z.infer<typeof loginFormSchema>;

const defaultValues: Login = {
  email: "",
  password: "",
};

const formOpts = formOptions({
  defaultValues: defaultValues,
  validators: {
    onSubmit: loginFormSchema,
  },
});

export default function LoginForm() {
  const id = useId();
  const { login } = useAuth();
  const isPending = login.isPending;

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value, formApi }) => {
      await login.mutateAsync(value);
      formApi.reset();
    },
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  return (
    <div className="w-full max-w-md px-8 space-y-5">
      <div className="flex flex-col items-center gap-2">
        <Logo />
        <div className="flex items-center flex-col gap-2">
          <h1 className="text-lg font-medium">Welcome back</h1>
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
            name="password"
            children={(f) => {
              return (
                <div className="*:not-first:mt-2">
                  <Label htmlFor={`${id}-password`}>Password</Label>
                  <div className="relative">
                    <Input
                      id={`${id}-password`}
                      placeholder="Enter your password"
                      value={f.state.value}
                      onChange={(e) => f.handleChange(e.target.value)}
                      type={isVisible ? "text" : "password"}
                      aria-invalid={f.state.meta.errors.length > 0}
                    />
                    <button
                      className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      type="button"
                      onClick={toggleVisibility}
                      aria-label={isVisible ? "Hide password" : "Show password"}
                      aria-pressed={isVisible}
                      aria-controls="password"
                    >
                      {isVisible ? (
                        <EyeOffIcon
                          size={16}
                          aria-hidden="true"
                          className="mr-1"
                        />
                      ) : (
                        <EyeIcon
                          size={16}
                          aria-hidden="true"
                          className="mr-1"
                        />
                      )}
                    </button>
                  </div>
                  <FormFieldError field={f} />
                </div>
              );
            }}
          />
        </div>
        <div className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <Checkbox id={`${id}-remember`} />
            <Label
              htmlFor={`${id}-remember`}
              className="text-muted-foreground font-normal"
            >
              Remember me
            </Label>
          </div>
          <Link
            to="/auth/email-verification"
            className="text-sm underline hover:no-underline font-medium"
          >
            Forgot password?
          </Link>
        </div>
        <div className="space-y-2">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && (
              <LoaderCircleIcon
                className="-ms-1 animate-spin"
                size={16}
                aria-hidden="true"
              />
            )}
            Login
          </Button>
          <div className="before:bg-border after:bg-border flex items-center gap-3 before:h-px before:flex-1 after:h-px after:flex-1">
            <span className="text-muted-foreground text-xs">Or</span>
          </div>
          <Link to="/auth/request-access">
            <Button type="button" className="w-full" variant="outline">
              Request Access
            </Button>
          </Link>
        </div>
      </form>
      <LegalPoliciesFooter />
    </div>
  );
}
