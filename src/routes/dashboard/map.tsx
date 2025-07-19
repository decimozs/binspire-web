import notificationApi from "@/api/notification-api";
import DashboardMap from "@/components/core/dashboard-map";
import { generateToken } from "@/lib/firebase";
import { useSessionStore } from "@/store/use-session-store";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard/map")({
  component: MapRouteComponent,
});

function MapRouteComponent() {
  const { session } = useSessionStore();

  useEffect(() => {
    async function setupFCM() {
      const token = await generateToken();
      if (!token || !session?.userId) return;

      try {
        const existing = await notificationApi.getNotificationByFCMToken(token);

        if (!existing || existing.length === 0) {
          await notificationApi.createNotificationToken({
            userId: session.userId,
            fcmToken: token,
          });
          console.log("New FCM token registered.");
        } else {
          console.log("FCM token already registered.");
        }
      } catch (error) {
        console.error("Error checking or creating FCM token:", error);
      }
    }

    setupFCM();
  }, []);

  return <DashboardMap />;
}
