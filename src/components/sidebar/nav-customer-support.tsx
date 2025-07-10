import * as React from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
} from "@/components/ui/sidebar";
import CreateFeedbackModal from "../modal/create-feedback-modal";
import SupportModal from "../modal/support-modal";
import SettingsModal from "../modal/settings-modal";

export default function NavCustomerSupport({
  ...props
}: {} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          <SettingsModal />
          <SupportModal />
          <CreateFeedbackModal />
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
