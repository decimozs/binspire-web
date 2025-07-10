import { LoaderCircleIcon } from "lucide-react";

type LoadingType = "screen" | "modal";

interface LoadingProps {
  type: LoadingType;
}

export default function Loading({ type }: LoadingProps) {
  return (
    <div
      className={`${type === "screen" ? "h-[90vh]" : ""} w-full flex items-center justify-center`}
    >
      <div className="flex flex-col items-center gap-2">
        <LoaderCircleIcon
          className="-ms-1 animate-spin"
          size={26}
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    </div>
  );
}
