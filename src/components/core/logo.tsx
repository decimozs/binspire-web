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
      <>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="35"
          height="35"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="lucide lucide-arrow-up-right-icon lucide-arrow-up-right stroke-zinc-800 dark:stroke-zinc-100"
        >
          <path d="M7 7h10v10" />
          <path d="M7 17 17 7" />
        </svg>
      </>
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
