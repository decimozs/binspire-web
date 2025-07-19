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
import { useNotificationStore } from "@/store/use-notification-store";
import { useFCMNotifications } from "@/hooks/use-fcm-notification";
import { formatDistanceToNow } from "date-fns";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface NotificationSheetProps {
  isHeader?: boolean;
}

export default function NotificationSheet({
  isHeader = false,
}: NotificationSheetProps) {
  const isMobile = useIsMobile();
  const notifications = useNotificationStore((state) => state.notifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const clearNotifications = useNotificationStore(
    (state) => state.clearNotifications,
  );
  const [count, setCount] = useState(
    notifications.filter((n) => !n.read).length,
  );

  useFCMNotifications((msg) => {
    if (
      typeof msg === "object" &&
      msg !== null &&
      "notification" in msg &&
      typeof msg.notification === "object" &&
      msg.notification !== null &&
      "title" in msg.notification &&
      "body" in msg.notification
    ) {
      const { title, body, link } = msg.notification as {
        title: string;
        body: string;
        link?: string;
      };

      const addNotification = useNotificationStore.getState().addNotification;

      addNotification({
        id: crypto.randomUUID(),
        title,
        body,
        link,
        timestamp: Date.now(),
        read: false,
      });
    }
  });

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
              {notifications.length === 0
                ? "No notifications"
                : "Here’s a list of all system-related events and alerts tied to your account."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 flex flex-row items-center justify-between">
            {notifications.length > 1 && (
              <p className="underline" onClick={markAllAsRead}>
                Mark all as read
              </p>
            )}
            {notifications.length > 0 && (
              <p className="underline" onClick={clearNotifications}>
                Clear notifications
              </p>
            )}
          </div>
          <div className="px-4 flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
            {notifications.map((notification) => (
              <Drawer>
                <DrawerTrigger asChild>
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                    }}
                    className={`rounded-md border-input border-[1px] border-dashed p-4 ${notification.read ? "" : "bg-secondary/40"}`}
                  >
                    <div>
                      <p className="mb-1">{notification.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DrawerTrigger>
                <DrawerContent className="pb-4">
                  <DrawerHeader>
                    <DrawerTitle className="text-left">
                      Notification
                    </DrawerTitle>
                    <DrawerDescription className="text-left">
                      Read your notification details below.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <p className="mb-2 text-xl">{notification.title}</p>
                    <div>
                      <p>Message</p>
                      <p className="mt-2 border-dashed border-input border-[1px] rounded-md p-4 text-sm">
                        {notification.body}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DrawerContent>
              </Drawer>
            ))}
          </div>
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
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle>System Notifications</SheetTitle>
            <SheetDescription>
              {notifications.length === 0
                ? "No notifications"
                : "Here’s a list of all system-related events and alerts tied to your account."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 flex flex-row items-center justify-between">
            {notifications.length > 1 && (
              <p className="underline" onClick={markAllAsRead}>
                Mark all as read
              </p>
            )}
            {notifications.length > 0 && (
              <p className="underline" onClick={clearNotifications}>
                Clear notifications
              </p>
            )}
          </div>
          <div className="px-4 flex flex-col gap-2 overflow-y-auto max-h-[80vh]">
            {notifications.map((notification) => (
              <Drawer>
                <DrawerTrigger asChild>
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                    }}
                    className={`rounded-md border-input border-[1px] border-dashed p-4 ${notification.read ? "" : "bg-secondary/40"}`}
                  >
                    <div>
                      <p className="mb-1">{notification.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DrawerTrigger>
                <DrawerContent className="pb-4">
                  <DrawerHeader>
                    <DrawerTitle className="text-left">
                      Notification
                    </DrawerTitle>
                    <DrawerDescription className="text-left">
                      Read your notification details below.
                    </DrawerDescription>
                  </DrawerHeader>
                  <div className="px-4">
                    <p className="mb-2 text-xl">{notification.title}</p>
                    <div>
                      <p>Message</p>
                      <p className="mt-2 border-dashed border-input border-[1px] rounded-md p-4 text-sm">
                        {notification.body}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DrawerContent>
              </Drawer>
            ))}
          </div>
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
              {notifications.length === 0
                ? "No notifications"
                : "Here’s a list of all system-related events and alerts tied to your account."}
            </SheetDescription>
          </SheetHeader>
          <div className="px-4 flex flex-row items-center justify-between">
            {notifications.length > 1 && (
              <p className="underline cursor-pointer" onClick={markAllAsRead}>
                Mark all as read
              </p>
            )}
            {notifications.length > 0 && (
              <p
                className="underline cursor-pointer"
                onClick={clearNotifications}
              >
                Clear notifications
              </p>
            )}
          </div>
          <div className="px-4 flex flex-col gap-2 overflow-y-auto max-h-[90vh]">
            {notifications.map((notification) => (
              <Dialog>
                <DialogTrigger asChild>
                  <div
                    key={notification.id}
                    onClick={() => {
                      if (!notification.read) markAsRead(notification.id);
                    }}
                    className={`rounded-md border-input border-[1px] border-dashed p-4 ${notification.read ? "" : "bg-secondary/40"}`}
                  >
                    <div>
                      <p className="mb-1">{notification.title}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {notification.body}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DialogTrigger>
                <DialogContent className="pb-4">
                  <DialogHeader>
                    <DialogTitle className="text-left">
                      Notification
                    </DialogTitle>
                    <DialogDescription className="text-left">
                      Read your notification details below.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="">
                    <p className="mb-2 text-xl">{notification.title}</p>
                    <div>
                      <p>Message</p>
                      <p className="mt-2 border-dashed border-input border-[1px] rounded-md p-4 text-sm">
                        {notification.body}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(notification.timestamp), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    );
  }
}
