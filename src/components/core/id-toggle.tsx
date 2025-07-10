import { useState } from "react";
import { CheckIcon, CopyIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { copiedSonner } from "../ui/sonner";

export function IdToggle({ id }: { id: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(id);
    setCopied(true);
    copiedSonner("Copied to clipboard");
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="relative mt-2 flex flex-row gap-2 items-center">
      <p className="p-2 border-dashed border-[1px] font-mono text-sm bg-muted-foreground/5 rounded-md">
        {id}
      </p>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        title="Copy to clipboard"
        disabled={copied}
        className="relative"
      >
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-all",
            copied ? "scale-100 opacity-100" : "scale-0 opacity-0",
          )}
        >
          <CheckIcon size={16} className="text-emerald-500" />
        </div>
        <div
          className={cn(
            "transition-all",
            copied ? "scale-0 opacity-0" : "scale-100 opacity-100",
          )}
        >
          <CopyIcon size={16} />
        </div>
      </Button>
    </div>
  );
}
