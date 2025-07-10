import { useCharacterLimit } from "@/hooks/use-character-limit";
import type { AnyFieldApi } from "@tanstack/react-form";
import { useEffect, useId } from "react";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { FormFieldError } from "../form/form-field-error";

interface DynamicTextAreaProps {
  f: AnyFieldApi;
  label: string;
  isOptional?: boolean;
  placeholder?: string;
}

export default function DynamicTextArea({
  f,
  label,
  isOptional = false,
  placeholder = "Enter your description here",
}: DynamicTextAreaProps) {
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

  useEffect(() => {
    handleChange({
      target: { value: f.state.value },
    } as React.ChangeEvent<HTMLTextAreaElement>);
  }, [f.state.value]);

  return (
    <div className="*:not-first:mt-2">
      <div className="flex items-center justify-between gap-1">
        <Label htmlFor={id}>{label}</Label>
        {isOptional && (
          <span className="text-xs text-muted-foreground">Optional</span>
        )}
      </div>
      <Textarea
        id={id}
        value={value}
        placeholder={placeholder}
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
}
