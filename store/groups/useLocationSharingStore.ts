import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/utils/storage";
interface LocationSharingState {
  currentSharingGroupId: string | null;
  isSharing: boolean;
  sharingStartTime: number | null;
  backgroundTaskName: string | null;

  // Actions
  startSharing: (groupId: string, taskName: string) => void;
  stopSharing: () => void;
  getCurrentSharingGroup: () => string | null;
  isCurrentlySharing: () => boolean;
  getBackgroundTaskName: () => string | null;
}

export const useLocationSharingStore = create<LocationSharingState>()(
  persist(
    (set, get) => ({
      currentSharingGroupId: null,
      isSharing: false,
      sharingStartTime: null,
      backgroundTaskName: null,

      startSharing: (groupId: string, taskName: string) => {
        set({
          currentSharingGroupId: groupId,
          isSharing: true,
          sharingStartTime: Date.now(),
          backgroundTaskName: taskName,
        });
      },

      stopSharing: () => {
        set({
          currentSharingGroupId: null,
          isSharing: false,
          sharingStartTime: null,
          backgroundTaskName: null,
        });
      },

      getCurrentSharingGroup: () => get().currentSharingGroupId,
      isCurrentlySharing: () => get().isSharing,
      getBackgroundTaskName: () => get().backgroundTaskName,
    }),
    {
      name: "location-sharing-secure-storage",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
