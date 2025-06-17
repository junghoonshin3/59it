import { LOCATION_TASK_NAME } from "@/constants/taskName";
import * as Location from "expo-location";
import {
  unregisterAllTasksAsync,
  unregisterTaskAsync,
} from "expo-task-manager";

/**
 * Requests foreground and background location permissions.
 * @returns Permission statuses for foreground and background.
 */
export async function requestLocationPermissionsAsync() {
  const foreground = await Location.requestForegroundPermissionsAsync();
  if (foreground.status !== Location.PermissionStatus.GRANTED) {
    console.warn("Foreground location permission denied.");
    return {
      foregroundStatus: foreground.status,
      backgroundStatus: null,
      canAskAgain: foreground.canAskAgain,
    };
  }

  const background = await Location.requestBackgroundPermissionsAsync();
  if (background.status !== Location.PermissionStatus.GRANTED) {
    console.warn("Background location permission denied.");
    return {
      foregroundStatus: foreground.status,
      backgroundStatus: background.status,
      canAskAgain: background.canAskAgain,
    };
  }

  return {
    foregroundStatus: foreground.status,
    backgroundStatus: background.status,
    canAskAgain: true, // 둘 다 허용된 경우엔 true로 간주
  };
}

/**
 * Stops background location updates if running.
 */
export async function stopLocationUpdatesAsync() {
  try {
    await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
    await unregisterAllTasksAsync();
    console.log("Background location updates stopped.");
  } catch (e) {
    console.log("stopLocationUpdatesAsync >>>>>>>>>>>>>>>>>>>>>>> ", e);
  }
}

export const startForegroundTracking = async () => {
  await Location.watchPositionAsync(
    {
      accuracy: Location.Accuracy.High,
      timeInterval: 5000, // 5초마다
      distanceInterval: 50, // 10m 이동마다
    },
    (location) => {
      console.log("포그라운드 위치:", location.coords);
    }
  );
};

export const startBackgroundTracking = async () => {
  const hasStarted = await Location.hasStartedLocationUpdatesAsync(
    LOCATION_TASK_NAME
  );
  if (hasStarted) return;
  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Balanced,
    timeInterval: 10000,
    distanceInterval: 100,
    showsBackgroundLocationIndicator: true, // iOS only
    foregroundService: {
      notificationTitle: "위치 추적 중",
      notificationBody: "앱이 백그라운드에서도 위치를 추적하고 있습니다.",
    },
  });
};

export async function getLastKnownPositionAsync() {
  try {
    const position = await Location.getLastKnownPositionAsync();

    if (!position) {
      console.warn("No last known position available.");
      return null;
    }

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error("Failed to get last known position:", error);
    return null;
  }
}

export async function getCurrentPositionAsync() {
  try {
    const position = await Location.getCurrentPositionAsync();

    if (!position) {
      console.warn("No Current position available.");
      return null;
    }

    return {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    };
  } catch (error) {
    console.error("Failed to get Current position:", error);
    return null;
  }
}

export async function hasLocationPermissions() {
  const foregroundStatus = await Location.getForegroundPermissionsAsync();
  const backgroundStatus = await Location.getBackgroundPermissionsAsync();

  return {
    isForgroundPermission: foregroundStatus.granted,
    isBackgroundPermission: backgroundStatus.granted,
  };
}
