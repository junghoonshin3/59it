import { BACKGROUND_LOCATION_TASK } from "@/constants/taskName";
import { useLocationSharingStore } from "@/store/groups/useLocationSharingStore";
import * as SecureStore from "expo-secure-store";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
import { updateLocationSharingState } from "@/api/groups/groups";

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
export const startLocationSharing = async (obj: {
  groupId: string;
  userId: string;
}) => {
  try {
    // 위치 권한 확인
    const permissionResult = await requestLocationPermissions();
    if (permissionResult.error) {
      console.log("error : ", permissionResult.error);
      throw permissionResult.error;
    }

    // 사용자 ID를 SecureStore에 저장 (백그라운드 태스크에서 사용)
    await SecureStore.setItemAsync("user_id", obj.userId, {
      keychainService: "LocationSharingService",
    });

    // 백그라운드 위치 추적 시작
    await Location.startLocationUpdatesAsync(BACKGROUND_LOCATION_TASK, {
      accuracy: Location.Accuracy.High,
      timeInterval: 10000, // 10초마다 업데이트
      distanceInterval: 10, // 10미터 이동시 업데이트
      foregroundService: {
        notificationTitle: "위치 공유 중",
        notificationBody: "그룹 멤버들과 위치를 공유하고 있습니다.",
        notificationColor: "#0075FF",
      },
      pausesUpdatesAutomatically: false,
      deferredUpdatesInterval: 10000,
      deferredUpdatesDistance: 10,
    });

    // 스토어에 공유 상태 저장
    useLocationSharingStore
      .getState()
      .startSharing(obj.groupId, BACKGROUND_LOCATION_TASK);

    console.log(`위치 공유 시작 - 그룹 ${obj.groupId}`);
    return { success: true };
  } catch (error) {
    console.error("위치 공유 시작 실패:", error);
    return { success: false, error: error };
  }
};

// 위치 공유 중지
export const stopLocationSharing = async (userId: string) => {
  try {
    const { getCurrentSharingGroup, getBackgroundTaskName } =
      useLocationSharingStore.getState();
    const currentGroupId = getCurrentSharingGroup();
    const taskName = getBackgroundTaskName();

    if (currentGroupId) {
      // 서버에 공유 중지 상태 업데이트
      await updateLocationSharingState(currentGroupId, userId, false);
    }

    // 백그라운드 위치 업데이트 중지
    if (taskName) {
      const isTaskDefined = TaskManager.isTaskDefined(taskName);
      if (isTaskDefined) {
        await Location.stopLocationUpdatesAsync(taskName);
      }
    }

    // SecureStore에서 사용자 ID 제거
    await SecureStore.deleteItemAsync("user_id", {
      keychainService: "LocationSharingService",
    });

    // 스토어에서 공유 상태 제거
    useLocationSharingStore.getState().stopSharing();

    console.log("위치 공유 중지");
    return { success: true };
  } catch (error) {
    console.error("위치 공유 중지 실패:", error);
    return { success: false, error: error };
  }
};

// 앱 시작 시 위치 공유 복구
export const restoreLocationSharingOnAppStart = async (userId: string) => {
  try {
    const {
      getCurrentSharingGroup,
      isCurrentlySharing,
      getBackgroundTaskName,
    } = useLocationSharingStore.getState();

    const currentGroupId = getCurrentSharingGroup();
    const taskName = getBackgroundTaskName();

    if (currentGroupId && isCurrentlySharing()) {
      console.log(`위치 공유 복구 시도 - 그룹 ${currentGroupId}`);

      // 백그라운드 태스크가 실행 중인지 확인
      const isTaskRegistered = await Location.hasStartedLocationUpdatesAsync(
        taskName || BACKGROUND_LOCATION_TASK
      );

      if (!isTaskRegistered) {
        // 백그라운드 태스크가 중지되어 있다면 재시작
        console.log("백그라운드 위치 추적 재시작");
        const result = await startLocationSharing({
          groupId: currentGroupId,
          userId: userId,
        });
        return { restored: true, restarted: true, groupId: currentGroupId };
      } else {
        console.log("백그라운드 위치 추적이 이미 실행 중");
        return { restored: true, restarted: false, groupId: currentGroupId };
      }
    }

    return { restored: false };
  } catch (error) {
    console.error("위치 공유 복구 실패:", error);
    return { restored: false, error: error };
  }
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
