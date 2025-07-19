import { messaging } from "@/lib/firebase";
import { onMessage } from "firebase/messaging";
import { useEffect } from "react";

export function useFCMNotifications(
  onNotification: (message: unknown) => void,
) {
  useEffect(() => {
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("FCM Message Received:", payload);
      onNotification(payload);
    });

    return () => unsubscribe();
  }, [onNotification]);
}
