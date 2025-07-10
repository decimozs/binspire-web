import * as React from "react";
import {} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import NavTeams from "../sidebar/nav-teams";
import NavUser from "../sidebar/nav-user";
import NavMain from "../sidebar/nav-main";
import NavCustomerSupport from "../sidebar/nav-customer-support";
import { adminSidebarData, collectorSidebarData } from "@/lib/constants";
import { useSessionStore } from "@/store/use-session-store";
import NavShortcuts from "../sidebar/nav-shortcuts";

export function AdminDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavTeams />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={adminSidebarData.navMain} />
        <NavShortcuts />
      </SidebarContent>
      <SidebarFooter>
        <NavCustomerSupport />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export function CollectorDashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavTeams />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={collectorSidebarData.navMain} />
        <NavShortcuts />
      </SidebarContent>
      <SidebarFooter>
        <NavCustomerSupport />
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

export default function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { session } = useSessionStore();

  if (!session) return null;

  return session.role === "admin" ? (
    <AdminDashboardSidebar {...props} />
  ) : (
    <CollectorDashboardSidebar {...props} />
  );
}
