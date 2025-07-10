import apiClient from "@/lib/axios";
import { useSessionStore } from "@/store/use-session-store";
import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { z } from "zod/v4";
import { permissionValues, roleValues } from "@/lib/constants";
import SidebarBreadcrumbs from "@/components/sidebar/sidebar-breadcrumbs";
import { Suspense } from "react";
import Loading from "@/components/core/loading";
import DashboardSidebar from "@/components/core/dashboard-sidebar";
import ReviewTrashbinModal from "@/components/modal/review-trashbin-modal";
import ReviewUserModal from "@/components/modal/review-user-modal";
import ReviewIssueModal from "@/components/modal/review-issue-modal";
import ReviewRequestAccessModal from "@/components/modal/review-request-access-modal";
import ReviewActivityModal from "@/components/modal/review-activity-modal";
import ReviewHistoryModal from "@/components/modal/review-history-modal";
import ShortcutCommands from "@/components/core/shortcut-commands";
import { useIsMobile } from "@/hooks/use-mobile";
import Logo from "@/components/core/logo";

export const sessionSchema = z.object({
  userId: z.string(),
  orgId: z.string(),
  permission: z.enum(permissionValues),
  role: z.enum(roleValues),
});

export type Session = z.infer<typeof sessionSchema>;

type SessionResponse = {
  payload: Session;
};

export const Route = createFileRoute("/dashboard")({
  component: DasboardLayoutRouteComponent,
  beforeLoad: async () => {
    try {
      const response = await apiClient.get<SessionResponse>("/auth/session");
      const parsed = sessionSchema.safeParse(response.data.payload);

      if (!parsed.success) throw new Error("Failed to parsed session");

      const session = parsed.data;

      useSessionStore.getState().setSession(session);
    } catch {
      throw redirect({ to: "/" });
    }
  },
});

function DasboardLayoutRouteComponent() {
  const { session } = useSessionStore();
  const isMobile = useIsMobile();

  if (session?.role === "admin" && isMobile) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-md text-muted-foreground text-center w-[300px] border-[1px] border-dashed rounded-md p-4 flex flex-col items-center gap-2">
          <Logo />
          <p> Dashboard is not available on mobile for admin users.</p>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 bg-background flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <SidebarBreadcrumbs />
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4">
          <Suspense fallback={<Loading type="screen" />}>
            <Outlet />
            <ReviewTrashbinModal />
            <ReviewUserModal />
            <ReviewIssueModal />
            <ReviewActivityModal />
            <ReviewRequestAccessModal />
            <ReviewHistoryModal />
            <ShortcutCommands />
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
