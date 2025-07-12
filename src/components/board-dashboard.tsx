import { useSessionStore } from "@/store/use-session-store";
import CollectorBoardTabs from "./tabs/collector-board-tabs";

export default function BoardDashboard() {
  const { session } = useSessionStore();
  const role = session?.role;

  if (role === "admin") {
    return <h1>Admin Dashboard</h1>;
  }

  if (role === "collector") {
    return <CollectorBoardTabs />;
  }
}
