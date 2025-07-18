import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/utils/storage";
import { Group } from "@/api/groups/types";

interface LocationSharingState {
  currentSharingGroup: Group | null;
  currentSharingUserId: string | null;
  isSharing: boolean;
  isSubscribe: boolean;
  startBackgroundLocation: (group: Group, userId: string) => void;
  stopBackgroundLocation: () => void;
  setIsSubscribe: (status: boolean) => void;
}

export const useLocationSharingStore = create<LocationSharingState>()(
  persist(
    (set, get) => ({
      currentSharingGroup: null,
      currentSharingUserId: null,
      isSharing: false,
      isSubscribe: false,
      startBackgroundLocation: (group: Group, userId: string) => {
        set({
          currentSharingGroup: group,
          currentSharingUserId: userId,
          isSharing: true,
        });
      },

      stopBackgroundLocation: () => {
        set({
          currentSharingGroup: null,
          currentSharingUserId: null,
          isSharing: false,
        });
      },

      setIsSubscribe: (status: boolean) => {
        set((state) => ({
          ...state,
          isSubscribe: status,
        }));
      },
    }),
    {
      name: "current-sharing-group",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
