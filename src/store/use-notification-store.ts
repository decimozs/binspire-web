// store/notifications.ts
import { create } from "zustand";

interface Notification {
  id: string;
  title: string;
  body: string;
  link?: string;
  timestamp: number;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (msg: Notification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: JSON.parse(localStorage.getItem("notifications") || "[]"),
  addNotification: (msg) =>
    set((state) => {
      const updated = [msg, ...state.notifications];
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated };
    }),
  markAsRead: (id: string) =>
    set((state) => {
      const updated = state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated };
    }),
  markAllAsRead: () =>
    set((state) => {
      const updated = state.notifications.map((n) => ({ ...n, read: true }));
      localStorage.setItem("notifications", JSON.stringify(updated));
      return { notifications: updated };
    }),
  clearNotifications: () =>
    set(() => {
      localStorage.removeItem("notifications");
      return { notifications: [] };
    }),
}));
