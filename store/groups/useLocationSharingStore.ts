import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/utils/storage";
import { Group } from "@/api/groups/types";
interface LocationSharingState {
  currentSharingGroup: Group | null;
  currentSharingUserId: string | null;
  isSharing: boolean;
  startSharing: (group: Group, userId: string) => void;
  stopSharing: () => void;
}

export const useLocationSharingStore = create<LocationSharingState>()(
  persist(
    (set, get) => ({
      currentSharingGroup: null,
      currentSharingUserId: null,
      isSharing: false,
      backgroundTaskName: null,
      currentChannel: null,
      startSharing: (group: Group, userId: string) => {
        set({
          currentSharingGroup: group,
          currentSharingUserId: userId,
          isSharing: true,
        });
      },

      stopSharing: () => {
        set({
          currentSharingGroup: null,
          currentSharingUserId: null,
          isSharing: false,
        });
      },
    }),
    {
      name: "location-sharing",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
