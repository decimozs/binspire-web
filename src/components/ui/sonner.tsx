import {
  CircleAlert,
  CircleCheckIcon,
  LoaderCircleIcon,
  TriangleAlert,
  XIcon,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function warningSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <TriangleAlert
            className="mt-0.5 shrink-0 text-amber-500"
            size={16}
            aria-hidden="true"
          />{" "}
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}

export function errorSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleAlert
            className="mt-0.5 shrink-0 text-red-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}

export function successSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <CircleCheckIcon
            className="mt-0.5 shrink-0 text-emerald-500"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}

export function promiseSonner(message: string) {
  toast.custom((t) => (
    <div className="bg-background text-foreground w-full rounded-md border px-4 py-3 shadow-lg sm:w-[var(--width)]">
      <div className="flex gap-2">
        <div className="flex grow gap-3">
          <LoaderCircleIcon
            className="-ms-1 animate-spin"
            size={16}
            aria-hidden="true"
          />
          <div className="flex grow justify-between gap-12">
            <p className="text-sm">{message}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          className="group -my-1.5 -me-2 size-8 shrink-0 p-0 hover:bg-transparent"
          onClick={() => toast.dismiss(t)}
          aria-label="Close banner"
        >
          <XIcon
            size={16}
            className="opacity-60 transition-opacity group-hover:opacity-100"
            aria-hidden="true"
          />
        </Button>
      </div>
    </div>
  ));
}
