import type { AnyFieldApi } from "@tanstack/react-form";

export const FormFieldError = ({ field }: { field: AnyFieldApi }) => {
  return (
    <>
      {field.state.meta.errors.length > 0 && (
        <p
          className="text-sm text-destructive mt-1"
          role="alert"
          aria-live="polite"
        >
          {field.state.meta.errors[0]?.message}
        </p>
      )}
    </>
  );
};
