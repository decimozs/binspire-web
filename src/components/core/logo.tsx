import { CircleCheckIcon, CircleAlertIcon } from "lucide-react";

type LogoProps = {
  status?: "success" | "fail";
};

export default function Logo({ status }: LogoProps) {
  const icon =
    status === "success" ? (
      <CircleCheckIcon size={23} />
    ) : status === "fail" ? (
      <CircleAlertIcon size={23} />
    ) : (
      <svg
        className="stroke-zinc-800 dark:stroke-zinc-100"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        <circle cx="16" cy="16" r="12" fill="none" strokeWidth="8" />
      </svg>
    );

  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-md border"
      aria-hidden="true"
    >
      {icon}
    </div>
  );
}
