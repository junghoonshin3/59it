import { BACKGROUND_LOCATION_TASK } from "@/constants/taskName";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { updateLocationSharingState } from "@/api/groups/groups";
import { Group } from "@/api/groups/types";
import { supabase } from "./supabase/supabaseService";
import { useDerivedValue } from "react-native-reanimated";

const option: Location.LocationOptions = {
  accuracy: Location.Accuracy.High,
  timeInterval: 1000 * 30, // 30초마다
  distanceInterval: 100, // 100m 이동마다
};

// 위치 권한 요청
export const requestLocationPermissions = async () => {
  try {
    // 포그라운드 위치 권한 요청
    const { status: foregroundStatus, canAskAgain: foregroundCanAskAgain } =
      await Location.requestForegroundPermissionsAsync();

    if (foregroundStatus !== "granted") {
      return {
        foregroundStatus: foregroundStatus,
        backgroundStatus: null,
        canAskAgain: foregroundCanAskAgain,
      };
    }

    // 백그라운드 위치 권한 요청
    const { status: backgroundStatus, canAskAgain: backgroundCanAskAgain } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus !== "granted") {
      return {
        foregroundStatus: foregroundStatus,
        backgroundStatus: backgroundStatus,
        canAskAgain: backgroundCanAskAgain,
      };
    }
    console.log("foregroundCanAskAgain", foregroundCanAskAgain);
    console.log("backgroundCanAskAgain", backgroundCanAskAgain);
    return {
      foregroundStatus: foregroundStatus,
      backgroundStatus: backgroundStatus,
      canAskAgain: false,
    };
  } catch (error) {
    console.error("위치 권한 요청 실패:", error);
    return {
      error: error,
    };
  }
};

// 위치 공유 시작
export const startLocationSharing = async (sharingObj: {
  selectedGroup: Group;
  userId: string;
}) => {
  // 백그라운드 위치 추적 시작
  await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
    accuracy: Location.Accuracy.High,
    timeInterval: 10000, // 10초마다 업데이트
    distanceInterval: 100, // 10미터 이동시 업데이트
    // foregroundService: {
    //   notificationTitle: "위치 공유 중",
    //   notificationBody: "그룹 멤버들과 위치를 공유하고 있습니다.",
    //   notificationColor: "#0075FF",
    //   killServiceOnDestroy: true,
    // },
    deferredUpdatesInterval: 10000,
    deferredUpdatesDistance: 100,
  });

  await updateLocationSharingState(
    sharingObj.selectedGroup.id,
    sharingObj.userId,
    true
  );

  useLocationSharingStore
    .getState()
    .startSharing(sharingObj.selectedGroup, sharingObj.userId);
};

// 위치 공유 중지
export const stopLocationSharing = async (sharingObj: {
  userId: string;
  groupId: string;
}) => {
  await updateLocationSharingState(
    sharingObj.groupId,
    sharingObj.userId,
    false
  );
  const isTaskDefined = TaskManager.isTaskDefined(BACKGROUND_LOCATION_TASK);

  if (isTaskDefined) {
    await Location.stopLocationUpdatesAsync(BACKGROUND_LOCATION_TASK);
  }
  useLocationSharingStore.getState().stopSharing();
};

// 현재 위치 가져오기 (포그라운드용)
export const getCurrentPositionAsync = async () => {
  try {
    const { status } = await Location.getForegroundPermissionsAsync();
    if (status !== "granted") {
      const { status: newStatus } =
        await Location.requestForegroundPermissionsAsync();
      if (newStatus !== "granted") {
        throw new Error("위치 권한이 필요합니다.");
      }
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      accuracy: location.coords.accuracy,
      timestamp: location.timestamp,
    };
  } catch (error) {
    console.error("현재 위치 가져오기 실패:", error);
    return null;
  }
};

export async function hasLocationPermissions() {
  const foregroundStatus = await Location.getForegroundPermissionsAsync();
  const backgroundStatus = await Location.getBackgroundPermissionsAsync();

  return {
    isForgroundPermission: foregroundStatus.granted,
    isBackgroundPermission: backgroundStatus.granted,
  };
}
