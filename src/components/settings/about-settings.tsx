import { useIsMobile } from "@/hooks/use-mobile";
import { useSessionStore } from "@/store/use-session-store";
import { Info } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

export default function AboutSettings() {
  const isMobile = useIsMobile();
  const { session } = useSessionStore();
  const isAdmin = session?.role === "admin";

  if (isMobile && !isAdmin) {
    return (
      <Sheet>
        <SheetTrigger>
          <div className="flex flex-row items-center gap-4 px-4">
            <Info size={20} />
            About
          </div>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>About</SheetTitle>
          </SheetHeader>
          <div className="px-4 -mt-4 flex flex-col gap-4">
            <div>
              <p className="font-medium">System Version</p>
              <p className="text-muted-foreground">1.0.0</p>
            </div>
            <div>
              <p className="font-medium">System Health</p>
              <p className="text-muted-foreground">Good</p>
            </div>
            <div>
              <p className="font-medium">Last Update</p>
              <p className="text-muted-foreground">July 2025</p>
            </div>
            <div>
              <p className="font-medium">Developed By</p>
              <p className="text-muted-foreground">Binspire</p>
            </div>
            <div>
              <p className="font-medium">Contact Information</p>
              <p className="text-muted-foreground">
                binspire.contact@gmail.com
              </p>
            </div>
            <div>
              <p className="font-medium">License</p>
              <p className="text-muted-foreground">MIT License</p>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="flex flex-col gap-8 -mt-2">
      <h1 className="text-4xl font-medium">About</h1>
      <div className="flex flex-col gap-8 max-w-xl text-lg">
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">System Version</p>
          <p className="text-muted-foreground">1.0.0</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">System Health</p>
          <p className="text-muted-foreground">Good</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">Last Update</p>
          <p className="text-muted-foreground">July 2025</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">Developed By</p>
          <p className="text-muted-foreground">Binspire</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">Contact Information</p>
          <p className="text-muted-foreground">binspire.contact@gmail.com</p>
        </div>
        <div className="flex flex-row justify-between items-center">
          <p className="font-medium">License</p>
          <p className="text-muted-foreground">MIT License</p>
        </div>
      </div>
    </div>
  );
}
