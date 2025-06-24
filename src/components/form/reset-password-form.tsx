import { formOptions, useForm } from "@tanstack/react-form";
import z from "zod/v4";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { useId, useMemo, useState } from "react";
import {
  CheckIcon,
  EyeIcon,
  EyeOffIcon,
  LoaderCircleIcon,
  XIcon,
} from "lucide-react";
import { FormFieldError } from "./form-field-error";
import { Link, useRouteContext } from "@tanstack/react-router";
import { useResetPassword } from "@/hooks/use-auth";
import FormHeader from "./form-header";

const resetPasswordSchema = z
  .object({
    email: z
      .email({ message: "Please enter a valid email address" })
      .min(1, { message: "Email is required" }),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[0-9]/, "Must include at least one number")
      .regex(/[a-z]/, "Must include at least one lowercase letter")
      .regex(/[A-Z]/, "Must include at least one uppercase letter"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ResetPasswordFormFields = z.infer<typeof resetPasswordSchema>;

export default function ResetPasswordForm() {
  const id = useId();
  const { email } = useRouteContext({ from: "/auth/reset-password" });
  const resetPassword = useResetPassword();
  const isPending = resetPassword.isPending;
  const [isSuccess, setIsSuccess] = useState(false);

  const defaultValues: ResetPasswordFormFields = {
    email,
    password: "",
    confirmPassword: "",
  };

  const formOpts = formOptions({
    defaultValues,
    validators: {
      onSubmit: resetPasswordSchema,
    },
  });

  const form = useForm({
    ...formOpts,
    onSubmit: async ({ value, formApi }) => {
      await resetPassword.mutateAsync(value);
      formApi.reset();
      setIsSuccess(true);
    },
  });

  const [isVisible, setIsVisible] = useState<boolean>(false);

  const [password, setPassword] = useState("");
  const toggleVisibility = () => setIsVisible((prevState) => !prevState);

  const checkStrength = (pass: string) => {
    const requirements = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[0-9]/, text: "At least 1 number" },
      { regex: /[a-z]/, text: "At least 1 lowercase letter" },
      { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
    ];

    return requirements.map((req) => ({
      met: req.regex.test(pass),
      text: req.text,
    }));
  };

  const strength = checkStrength(password);

  const strengthScore = useMemo(() => {
    return strength.filter((req) => req.met).length;
  }, [strength]);

  const getStrengthColor = (score: number) => {
    if (score === 0) return "bg-border";
    if (score <= 1) return "bg-red-500";
    if (score <= 2) return "bg-orange-500";
    if (score === 3) return "bg-amber-500";
    return "bg-emerald-500";
  };

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password";
    if (score <= 2) return "Weak password";
    if (score === 3) return "Medium password";
    return "Strong password";
  };

  return (
    <div className="w-full max-w-md px-8 space-y-5">
      {isSuccess ? (
        <FormHeader
          props={{
            formTitle: "Password Reset",
            formDescription:
              "Your password has been successfully updated. You can now log in with your new credentials.",
            isModal: true,
            status: "success",
          }}
        />
      ) : (
        <>
          <FormHeader
            props={{
              formTitle: "Password Reset",
              formDescription:
                "Set a new password below to regain access to your account.",
            }}
          />
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
                name="password"
                children={(f) => {
                  return (
                    <div>
                      <div className="*:not-first:mt-2">
                        <Label htmlFor={id}>New Password</Label>
                        <div className="relative">
                          <Input
                            id={id}
                            className="pe-9"
                            placeholder="Enter your new password"
                            type={isVisible ? "text" : "password"}
                            value={f.state.value}
                            onChange={(e) => {
                              const value = e.target.value;
                              f.handleChange(value);
                              setPassword(value);
                            }}
                            onBlur={f.handleBlur}
                            aria-describedby={`${id}-description`}
                            aria-invalid={f.state.meta.errors.length > 0}
                          />
                          <button
                            className="cursor-pointer text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                            type="button"
                            onClick={toggleVisibility}
                            aria-label={
                              isVisible ? "Hide password" : "Show password"
                            }
                            aria-pressed={isVisible}
                            aria-controls="password"
                          >
                            {isVisible ? (
                              <EyeOffIcon size={16} aria-hidden="true" />
                            ) : (
                              <EyeIcon size={16} aria-hidden="true" />
                            )}
                          </button>
                        </div>
                        <FormFieldError field={f} />
                      </div>

                      <div
                        className="bg-border mt-3 mb-4 h-1 w-full overflow-hidden rounded-full"
                        role="progressbar"
                        aria-valuenow={strengthScore}
                        aria-valuemin={0}
                        aria-valuemax={4}
                        aria-label="Password strength"
                      >
                        <div
                          className={`h-full ${getStrengthColor(strengthScore)} transition-all duration-500 ease-out`}
                          style={{ width: `${(strengthScore / 4) * 100}%` }}
                        ></div>
                      </div>
                      <p
                        id={`${id}-description`}
                        className="text-foreground mb-2 text-sm font-medium"
                      >
                        {getStrengthText(strengthScore)}. Must contain:
                      </p>
                      <ul
                        className="space-y-1.5"
                        aria-label="Password requirements"
                      >
                        {strength.map((req, index) => (
                          <li key={index} className="flex items-center gap-2">
                            {req.met ? (
                              <CheckIcon
                                size={16}
                                className="text-emerald-500"
                                aria-hidden="true"
                              />
                            ) : (
                              <XIcon
                                size={16}
                                className="text-muted-foreground/80"
                                aria-hidden="true"
                              />
                            )}
                            <span
                              className={`text-xs ${req.met ? "text-emerald-600" : "text-muted-foreground"}`}
                            >
                              {req.text}
                              <span className="sr-only">
                                {req.met
                                  ? " - Requirement met"
                                  : " - Requirement not met"}
                              </span>
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                }}
              />
              <form.Field
                name="confirmPassword"
                children={(f) => {
                  return (
                    <div className="*:not-first:mt-2">
                      <Label htmlFor={`${id}-password`}>Confirm Password</Label>
                      <div className="relative">
                        <Input
                          id={`${id}-password`}
                          placeholder="Please confirm your password"
                          value={f.state.value}
                          type="password"
                          onChange={(e) => f.handleChange(e.target.value)}
                          aria-invalid={f.state.meta.errors.length > 0}
                        />
                      </div>
                      <FormFieldError field={f} />
                    </div>
                  );
                }}
              />
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
                Reset Password
              </Button>
              <Link to="/">
                <Button type="button" className="w-full" variant="ghost">
                  Back
                </Button>
              </Link>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
