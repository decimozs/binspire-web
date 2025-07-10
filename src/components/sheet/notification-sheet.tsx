import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Bell } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

export default function NotificationSheet() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Bell />
            Notification
          </DropdownMenuItem>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>System Notifications</SheetTitle>
            <SheetDescription>
              Here’s a list of all system-related events and alerts tied to your
              account.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
          <Bell />
          Notification
        </DropdownMenuItem>
      </SheetTrigger>
      <SheetContent className="min-w-2xl">
        <SheetHeader>
          <SheetTitle>System Notifications</SheetTitle>
          <SheetDescription>
            Here’s a list of all system-related events and alerts tied to your
            account.
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
