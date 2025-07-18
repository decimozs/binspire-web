import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { Bell, BellIcon } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { useState } from "react";

interface NotificationSheetProps {
  isHeader?: boolean;
}

export default function NotificationSheet({
  isHeader = false,
}: NotificationSheetProps) {
  const isMobile = useIsMobile();
  const [count, setCount] = useState(3);

  const handleClick = () => {
    setCount(0);
  };

  if (isMobile && isHeader) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={handleClick}
            aria-label="Notifications"
          >
            <BellIcon size={16} aria-hidden="true" />
            {count > 0 && (
              <Badge className="absolute -top-2 left-full min-w-5 h-5 px-1 text-xs flex items-center justify-center rounded-full -translate-x-1/2">
                {count > 99 ? "99+" : count}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full">
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

  if (isMobile && !isHeader) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
            <Bell />
            Notification
          </DropdownMenuItem>
        </SheetTrigger>
        <SheetContent className={isMobile ? "w-full" : ""}>
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

  if (!isHeader) {
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
}
