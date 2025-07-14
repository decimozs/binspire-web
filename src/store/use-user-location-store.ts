import { create } from "zustand";

interface Location {
  lat: number;
  lng: number;
}

interface UserLocationState {
  location: Location | null;
  previousLocation: Location | null;
  setLocation: (location: Location | null) => void;
}

export const useUserLocationStore = create<UserLocationState>((set, get) => ({
  location: null,
  previousLocation: null,
  setLocation: (location) => {
    const current = get().location;
    set({
      previousLocation: current,
      location: location,
    });
  },
}));
