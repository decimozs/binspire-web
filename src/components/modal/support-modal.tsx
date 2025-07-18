import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LifeBuoy } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "../ui/sidebar";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export default function SupportModal() {
  const isMobile = useIsMobile();

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <LifeBuoy className="mt-1" />
              <span className="text-xl">Support</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SheetTrigger>
        <SheetContent className="w-full">
          <SheetHeader>
            <SheetTitle>Need help?</SheetTitle>
            <SheetDescription>
              We're here to assist you. Browse our help resources or contact
              support for further assistance.
            </SheetDescription>
          </SheetHeader>

          <div className="px-4 -mt-4 space-y-4 text-muted-foreground">
            <p>
              <strong>FAQs:</strong> Check out our Frequently Asked Questions to
              find quick answers to common issues.
            </p>
            <p>
              <strong>Troubleshooting:</strong> Experiencing a problem? Visit
              our help center to walk through solutions.
            </p>
            <p>
              <strong>Contact Us:</strong> Still need help? Send us a message at{" "}
              <a
                href="mailto:contact.binspire@example.com"
                className="underline text-primary"
              >
                binspire.contact@gmail.com
              </a>{" "}
              and we’ll get back to you shortly.
            </p>
          </div>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton>
            <LifeBuoy />
            Support
          </SidebarMenuButton>
        </SidebarMenuItem>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Need Help?</DialogTitle>
          <DialogDescription>
            We're here to assist you. Browse our help resources or contact
            support for further assistance.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <p>
            <strong>FAQs:</strong> Check out our Frequently Asked Questions to
            find quick answers to common issues.
          </p>
          <p>
            <strong>Troubleshooting:</strong> Experiencing a problem? Visit our
            help center to walk through solutions.
          </p>
          <p>
            <strong>Contact Us:</strong> Still need help? Send us a message at{" "}
            <a
              href="mailto:contact.binspire@example.com"
              className="underline text-primary"
            >
              binspire.contact@gmail.com
            </a>{" "}
            and we’ll get back to you shortly.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
