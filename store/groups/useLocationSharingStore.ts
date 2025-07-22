import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { secureStorage } from "@/utils/storage";
import { Group } from "@/api/groups/types";

// 구독 상태 타입 정의
export type SubscriptionStatus =
  | "disconnected"
  | "connecting"
  | "connected"
  | "error";

interface LocationSharingState {
  currentSharingGroup: Group | null;
  currentSharingUserId: string | null;
  isSharing: boolean;
  subscribeStatus: SubscriptionStatus;
  startBackgroundLocation: (group: Group, userId: string) => void;
  stopBackgroundLocation: () => void;
  setSubscribeStatus: (status: SubscriptionStatus) => void;
}

export const useLocationSharingStore = create<LocationSharingState>()(
  persist(
    (set, get) => ({
      currentSharingGroup: null,
      currentSharingUserId: null,
      isSharing: false,
      subscribeStatus: "disconnected",
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

      setSubscribeStatus: (status: SubscriptionStatus) => {
        set((state) => ({
          ...state,
          subscribeStatus: status,
        }));
      },
    }),
    {
      name: "current-sharing-group",
      storage: createJSONStorage(() => secureStorage),
    }
  )
);
