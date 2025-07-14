import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { useRef } from "react";
import { CircleAlert, RouteOff } from "lucide-react";

interface CancelCollectionModalProps {
  onCancel: () => void;
}

export default function CancelCollectionModal({
  onCancel,
}: CancelCollectionModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null);

  const handleOnCancel = () => {
    onCancel();
    closeRef.current?.click();
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">
          <RouteOff />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="flex flex-row gap-4 items-start">
          <div
            className="flex size-11 shrink-0 items-center justify-center rounded-full border"
            aria-hidden="true"
          >
            <CircleAlert className="opacity-80" size={23} />
          </div>
          <div className="flex flex-col text-left">
            <div className="flex flex-col text-left gap-1">
              <DialogTitle>Cancel Collection</DialogTitle>
              <DialogDescription>
                You're about to cancel the collection of this trashbin.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" ref={closeRef}>
              Cancel
            </Button>
          </DialogClose>
          <Button type="submit" className="w-full" onClick={handleOnCancel}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
