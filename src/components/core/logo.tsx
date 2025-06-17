export default function Logo() {
  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-md border"
      aria-hidden="true"
    >
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
    </div>
  );
}
