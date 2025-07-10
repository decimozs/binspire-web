import type { Session } from "@/routes/dashboard/route";
import { create } from "zustand";

interface SessionStore {
  session: Session | null;
  setSession: (session: Session) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
